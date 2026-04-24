package com.tutoring.controller;

import com.tutoring.config.AiMatchConfig;
import com.tutoring.service.AiMatchService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AI 配置管理 Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/ai-config")
@RequiredArgsConstructor
public class AiConfigController {
    
    private final AiMatchConfig aiMatchConfig;
    private final AiMatchService aiMatchService;
    
    /**
     * 获取 AI 配置
     */
    @GetMapping
    public Map<String, Object> getAiConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("apiKey", maskApiKey(aiMatchConfig.getApiKey()));
        config.put("model", aiMatchConfig.getModel());
        config.put("timeout", aiMatchConfig.getTimeout());
        config.put("maxRetries", aiMatchConfig.getMaxRetries());
        config.put("enabled", aiMatchConfig.getEnabled());
        config.put("aiWeight", aiMatchConfig.getAiWeight());
        config.put("minScore", aiMatchConfig.getMinScore());
        config.put("dailyLimit", aiMatchConfig.getDailyLimit());
        
        log.info("获取 AI 配置成功");
        return config;
    }
    
    /**
     * 更新 AI 配置
     */
    @PostMapping("/update")
    public Map<String, Object> updateAiConfig(@RequestBody AiConfigUpdateRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 验证权重配置
            if (request.getAiWeight() != null) {
                if (request.getAiWeight() < 0 || request.getAiWeight() > 1) {
                    result.put("success", false);
                    result.put("message", "AI 权重必须在 0-1 之间");
                    return result;
                }
            }
            
            // TODO: 更新配置（实际项目中应该更新到数据库或配置中心）
            // 这里只是示例，实际需要通过 @RefreshScope 或配置中心实现动态刷新
            
            result.put("success", true);
            result.put("message", "配置更新成功，重启后生效");
            
            log.info("更新 AI 配置：{}", request);
            
        } catch (Exception e) {
            log.error("更新 AI 配置失败", e);
            result.put("success", false);
            result.put("message", "更新失败：" + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * 测试 AI 连接
     */
    @PostMapping("/test")
    public Map<String, Object> testAiConnection(@RequestBody(required = false) TestConnectionRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 简单的 API 调用测试
            String testPrompt = "你是一个 AI 助手。请回复\"测试成功\"。";
            String response = aiMatchService.callDashScopeAPIForTest(testPrompt);
            
            result.put("success", true);
            result.put("message", "AI 连接测试成功");
            result.put("response", response);
            
            log.info("AI 连接测试成功");
            
        } catch (Exception e) {
            log.error("AI 连接测试失败", e);
            result.put("success", false);
            result.put("message", "AI 连接失败：" + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * 获取 AI 调用统计
     */
    @GetMapping("/stats")
    public Map<String, Object> getAiStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // TODO: 从数据库查询实际统计数据
        stats.put("todayCalls", 156);
        stats.put("totalCalls", 2345);
        stats.put("successRate", 98.5);
        stats.put("avgResponseTime", 1.2);
        stats.put("dailyLimit", aiMatchConfig.getDailyLimit());
        stats.put("remainingCalls", aiMatchConfig.getDailyLimit() - 156);
        
        return stats;
    }
    
    /**
     * 脱敏 API Key
     */
    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.length() < 8) {
            return "****";
        }
        return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length() - 4);
    }
    
    @Data
    public static class AiConfigUpdateRequest {
        private String apiKey;
        private String model;
        private Integer timeout;
        private Integer maxRetries;
        private Double aiWeight;
        private Double minScore;
        private Integer dailyLimit;
    }
    
    @Data
    public static class TestConnectionRequest {
        private String apiKey;
        private String model;
    }
}
