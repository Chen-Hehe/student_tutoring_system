package com.tutoring.service;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutoring.config.AiMatchConfig;
import com.tutoring.entity.Student;
import com.tutoring.entity.Teacher;
import com.tutoring.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * AI 匹配服务 - 集成通义千问大模型
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiMatchService {
    
    private final AiMatchConfig aiMatchConfig;
    private final ObjectMapper objectMapper;
    
    /**
     * 使用 AI 分析师生匹配度
     *
     * @param teacher 教师信息
     * @param student 学生信息
     * @param teacherUser 教师用户信息
     * @param studentUser 学生用户信息
     * @return AI 分析结果
     */
    public AiMatchResult analyzeMatchByAI(Teacher teacher, Student student,
                                           User teacherUser, User studentUser) {
        log.info("AI 匹配分析：教师={}, 学生={}",
            teacherUser != null ? teacherUser.getName() : "unknown",
            studentUser != null ? studentUser.getName() : "unknown");
        
        try {
            // 构建 Prompt
            String prompt = buildMatchPrompt(teacher, student, teacherUser, studentUser);
            
            // 调用通义千问 API
            String aiResponse = callDashScopeAPI(prompt);
            
            // 解析 AI 响应
            return parseAiResponse(aiResponse, teacher.getId(), student.getId());
            
        } catch (Exception e) {
            log.error("AI 匹配分析失败", e);
            // 降级：返回默认结果
            return createFallbackResult(teacher.getId(), student.getId());
        }
    }
    
    /**
     * 构建 AI Prompt
     */
    private String buildMatchPrompt(Teacher teacher, Student student,
                                     User teacherUser, User studentUser) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是一个专业的师生匹配专家。请根据以下信息分析师生匹配的适合程度：\n\n");
        
        // 教师信息
        prompt.append("【教师信息】\n");
        if (teacherUser != null) {
            prompt.append("- 姓名：").append(teacherUser.getName()).append("\n");
        }
        if (teacher != null) {
            prompt.append("- 科目：").append(teacher.getSubject()).append("\n");
            prompt.append("- 教学经验：").append(teacher.getExperience() != null ? teacher.getExperience() : "未知").append("\n");
            prompt.append("- 可辅导年级：").append(teacher.getAvailability() != null ? teacher.getAvailability() : "未知").append("\n");
        }
        
        prompt.append("\n【学生信息】\n");
        if (studentUser != null) {
            prompt.append("- 姓名：").append(studentUser.getName()).append("\n");
        }
        if (student != null) {
            prompt.append("- 年级：").append(student.getGrade() != null ? student.getGrade() : "未知").append("\n");
            prompt.append("- 学校：").append(student.getSchool() != null ? student.getSchool() : "未知").append("\n");
            prompt.append("- 学习需求：").append(student.getLearningNeeds() != null ? student.getLearningNeeds() : "未知").append("\n");
        }
        
        prompt.append("\n请输出 JSON 格式的分析结果：\n");
        prompt.append("{\n");
        prompt.append("  \"score\": 85,  // 匹配分数 (0-100)\n");
        prompt.append("  \"reasons\": [\"原因 1\", \"原因 2\", \"原因 3\"],  // 匹配原因 (3-5 条)\n");
        prompt.append("  \"risks\": [\"潜在风险 1\"],  // 潜在风险 (可选，最多 2 条)\n");
        prompt.append("  \"suggestions\": [\"辅导建议 1\", \"辅导建议 2\"]  // 辅导建议 (最多 3 条)\n");
        prompt.append("}\n\n");
        prompt.append("只输出 JSON，不要有其他内容。");
        
        return prompt.toString();
    }
    
    /**
     * 调用通义千问 API
     */
    private String callDashScopeAPI(String prompt) throws Exception {
        if (!aiMatchConfig.getEnabled()) {
            throw new IllegalStateException("AI 匹配功能未启用");
        }
        
        String apiKey = aiMatchConfig.getApiKey();
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("API Key 未配置");
        }
        
        Generation gen = new Generation();
        
        // 构建消息
        List<Message> messages = new ArrayList<>();
        Message systemMsg = Message.builder()
            .role(Role.SYSTEM.getValue())
            .content("你是一个专业的教育匹配专家，擅长分析师生匹配度。请客观、准确地评估匹配程度。")
            .build();
        messages.add(systemMsg);
        
        Message userMsg = Message.builder()
            .role(Role.USER.getValue())
            .content(prompt)
            .build();
        messages.add(userMsg);
        
        // 构建请求参数
        GenerationParam param = GenerationParam.builder()
            .apiKey(apiKey)
            .model(aiMatchConfig.getModel())
            .messages(messages)
            .resultFormat(GenerationParam.ResultFormat.MESSAGE)
            .build();
        
        // 调用 API（带重试）
        int retries = 0;
        GenerationResult result = null;
        
        while (retries < aiMatchConfig.getMaxRetries()) {
            try {
                result = gen.call(param);
                // DashScope SDK 成功时 result 不为 null 且有输出
                if (result != null && result.getOutput() != null) {
                    break;
                }
            } catch (Exception e) {
                log.warn("AI API 调用失败，第 {} 次重试", retries + 1, e);
                retries++;
                Thread.sleep(1000 * retries); // 指数退避
            }
        }
        
        if (result == null || result.getOutput() == null) {
            throw new RuntimeException("AI API 调用失败：响应为空");
        }
        
        return result.getOutput().getChoices().get(0).getMessage().getContent();
    }
    
    /**
     * 解析 AI 响应
     */
    private AiMatchResult parseAiResponse(String response, Long teacherId, Long studentId) 
            throws JsonProcessingException {
        log.debug("AI 响应：{}", response);
        
        JsonNode root = objectMapper.readTree(response);
        
        AiMatchResult result = new AiMatchResult();
        result.setTeacherId(teacherId);
        result.setStudentId(studentId);
        result.setScore(root.has("score") ? root.get("score").asDouble() : 50.0);
        
        // 解析原因
        if (root.has("reasons") && root.get("reasons").isArray()) {
            List<String> reasons = new ArrayList<>();
            for (JsonNode reason : root.get("reasons")) {
                reasons.add(reason.asText());
            }
            result.setReasons(reasons);
        }
        
        // 解析风险
        if (root.has("risks") && root.get("risks").isArray()) {
            List<String> risks = new ArrayList<>();
            for (JsonNode risk : root.get("risks")) {
                risks.add(risk.asText());
            }
            result.setRisks(risks);
        }
        
        // 解析建议
        if (root.has("suggestions") && root.get("suggestions").isArray()) {
            List<String> suggestions = new ArrayList<>();
            for (JsonNode suggestion : root.get("suggestions")) {
                suggestions.add(suggestion.asText());
            }
            result.setSuggestions(suggestions);
        }
        
        // 确保分数在 0-100 范围内
        result.setScore(Math.min(100, Math.max(0, result.getScore())));
        
        return result;
    }
    
    /**
     * 降级结果（AI 不可用时）
     */
    private AiMatchResult createFallbackResult(Long teacherId, Long studentId) {
        AiMatchResult result = new AiMatchResult();
        result.setTeacherId(teacherId);
        result.setStudentId(studentId);
        result.setScore(50.0); // 默认中等分数
        result.setReasons(Arrays.asList("AI 服务暂时不可用", "使用默认匹配算法"));
        result.setRisks(new ArrayList<>());
        result.setSuggestions(new ArrayList<>());
        return result;
    }
    
    /**
     * 混合匹配策略：规则匹配 + AI 匹配
     *
     * @param ruleScore 规则匹配分数（来自 MatchAlgorithmService）
     * @param aiResult AI 匹配结果
     * @return 最终匹配分数
     */
    public double calculateHybridScore(double ruleScore, AiMatchResult aiResult) {
        double aiWeight = aiMatchConfig.getAiWeight();
        double ruleWeight = 1.0 - aiWeight;
        
        double hybridScore = ruleScore * ruleWeight + aiResult.getScore() * aiWeight;
        log.info("混合匹配分数：规则分数={}, AI 分数={}, 权重={}, 最终分数={}",
            ruleScore, aiResult.getScore(), aiWeight, hybridScore);
        
        return Math.min(100, Math.max(0, hybridScore));
    }
    
    /**
     * AI 匹配结果类
     */
    @lombok.Data
    public static class AiMatchResult {
        private Long teacherId;
        private Long studentId;
        private Double score;
        private List<String> reasons;
        private List<String> risks;
        private List<String> suggestions;
        
        /**
         * 转换为 JSON 字符串
         */
        public String toJson() {
            try {
                return new ObjectMapper().writeValueAsString(this);
            } catch (JsonProcessingException e) {
                return "{}";
            }
        }
    }
    
    /**
     * 测试 API 调用（用于配置测试）
     */
    public String callDashScopeAPIForTest(String prompt) throws Exception {
        Generation gen = new Generation();
        
        List<Message> messages = new ArrayList<>();
        messages.add(Message.builder()
            .role(Role.USER.getValue())
            .content(prompt)
            .build());
        
        GenerationParam param = GenerationParam.builder()
            .apiKey(aiMatchConfig.getApiKey())
            .model(aiMatchConfig.getModel())
            .messages(messages)
            .resultFormat(GenerationParam.ResultFormat.MESSAGE)
            .build();
        
        GenerationResult result = gen.call(param);
        
        if (result == null || result.getOutput() == null) {
            throw new RuntimeException("API 调用失败：响应为空");
        }
        
        return result.getOutput().getChoices().get(0).getMessage().getContent();
    }
}
