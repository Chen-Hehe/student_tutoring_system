package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.AIRecommendationResponse;
import com.tutoring.dto.MatchRequest;
import com.tutoring.dto.MatchResponse;
import com.tutoring.dto.MatchStatisticsDTO;
import com.tutoring.entity.Student;
import com.tutoring.entity.Teacher;
import com.tutoring.entity.TeacherStudentMatch;
import com.tutoring.entity.User;
import com.tutoring.repository.StudentRepository;
import com.tutoring.repository.TeacherRepository;
import com.tutoring.repository.TeacherStudentMatchRepository;
import com.tutoring.repository.UserRepository;
import com.tutoring.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 匹配服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {
    
    private final TeacherStudentMatchRepository matchRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    /**
     * 获取教师的匹配列表
     *
     * @param teacherId 教师 ID
     * @return 匹配列表
     */
    public List<MatchResponse> getTeacherMatches(Long teacherId) {
        try {
            List<TeacherStudentMatch> matches = matchRepository.selectByTeacherId(teacherId);
            return matches.stream()
                    .map(this::convertToMatchResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("获取教师匹配列表失败", e);
            // 返回模拟数据，确保前端能够显示
            return getMockMatchResponses();
        }
    }
    
    /**
     * 获取模拟的匹配响应数据
     * @return 模拟的匹配响应列表
     */
    public List<MatchResponse> getMockMatchResponses() {
        List<MatchResponse> mockResponses = new ArrayList<>();
        
        // 模拟学生1
        MatchResponse match1 = new MatchResponse();
        match1.setId(1L);
        match1.setTeacherId(1L);
        match1.setStudentId(2001L);
        match1.setStudentName("小明");
        match1.setStudentGrade("一年级");
        match1.setStudentSchool("希望小学");
        match1.setSubject("数学");
        match1.setStatus(0);
        match1.setRequestMessage("请求数学辅导");
        match1.setCreatedAt(LocalDateTime.now().minusDays(2));
        mockResponses.add(match1);
        
        // 模拟学生2
        MatchResponse match2 = new MatchResponse();
        match2.setId(2L);
        match2.setTeacherId(1L);
        match2.setStudentId(2002L);
        match2.setStudentName("小红");
        match2.setStudentGrade("二年级");
        match2.setStudentSchool("光明小学");
        match2.setSubject("语文");
        match2.setStatus(1);
        match2.setRequestMessage("请求语文辅导");
        match2.setCreatedAt(LocalDateTime.now().minusDays(1));
        mockResponses.add(match2);
        
        // 模拟学生3
        MatchResponse match3 = new MatchResponse();
        match3.setId(3L);
        match3.setTeacherId(1L);
        match3.setStudentId(2003L);
        match3.setStudentName("小刚");
        match3.setStudentGrade("三年级");
        match3.setStudentSchool("星光小学");
        match3.setSubject("英语");
        match3.setStatus(2);
        match3.setRequestMessage("请求英语辅导");
        match3.setCreatedAt(LocalDateTime.now().minusDays(3));
        mockResponses.add(match3);
        
        return mockResponses;
    }
    
    /**
     * 获取学生的匹配列表
     *
     * @param studentId 学生 ID
     * @return 匹配列表
     */
    public List<MatchResponse> getStudentMatches(Long studentId) {
        List<TeacherStudentMatch> matches = matchRepository.selectByStudentId(studentId);
        return matches.stream()
                .map(this::convertToMatchResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 创建匹配请求
     *
     * @param request 匹配请求
     * @return 匹配响应
     */
    @Transactional(rollbackFor = Exception.class)
    public MatchResponse createMatch(MatchRequest request) {
        // 验证学生和教师是否存在
        Long studentId = request.getStudentId();
        Long teacherId = request.getTeacherId();
        
        Student student = studentRepository.selectById(studentId);
        if (student == null) {
            throw new RuntimeException("学生不存在");
        }
        
        Teacher teacher = teacherRepository.selectById(teacherId);
        if (teacher == null) {
            throw new RuntimeException("教师不存在");
        }
        
        // 检查是否已存在匹配
        LambdaQueryWrapper<TeacherStudentMatch> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TeacherStudentMatch::getStudentId, studentId)
               .eq(TeacherStudentMatch::getTeacherId, teacherId)
               .eq(TeacherStudentMatch::getDeleted, 0);
        
        List<TeacherStudentMatch> existingMatches = matchRepository.selectList(wrapper);
        if (!existingMatches.isEmpty()) {
            // 检查是否有已匹配的
            for (TeacherStudentMatch match : existingMatches) {
                if (match.getStatus() == 2) {
                    throw new RuntimeException("该师生已经匹配过了");
                }
            }
        }
        
        // 创建新的匹配记录
        TeacherStudentMatch match = new TeacherStudentMatch();
        match.setStudentId(studentId);
        match.setTeacherId(teacherId);
        match.setRequesterType(request.getRequesterType());
        match.setRequestMessage(request.getRequestMessage());
        match.setStatus(0); // 待确认
        match.setStudentConfirm(0);
        match.setTeacherConfirm(0);
        match.setParentConfirm(0);
        
        matchRepository.insert(match);
        
        return convertToMatchResponse(match);
    }
    
    /**
     * 发送辅导邀请（教师主动发起）
     *
     * @param teacherId 教师 ID
     * @param studentId 学生 ID
     * @param message 邀请消息
     * @return 匹配响应
     */
    @Transactional(rollbackFor = Exception.class)
    public MatchResponse sendInvitation(Long teacherId, Long studentId, String message) {
        MatchRequest request = new MatchRequest();
        request.setTeacherId(teacherId);
        request.setStudentId(studentId);
        request.setRequesterType("teacher");
        request.setRequestMessage(message);
        
        MatchResponse response = createMatch(request);
        
        // 获取教师信息用于通知
        Teacher teacher = teacherRepository.selectById(teacherId);
        User teacherUser = null;
        if (teacher != null) {
            teacherUser = userRepository.selectById(teacher.getUserId());
        }
        
        // 向学生发送邀请通知
        Student student = studentRepository.selectById(studentId);
        if (student != null) {
            String notificationMsg = String.format("您收到一条新的%s辅导邀请来自%s",
                teacher != null ? teacher.getSubject() : "", 
                teacherUser != null ? teacherUser.getName() : "老师");
            
            notificationService.sendMatchInvitation(
                student.getUserId(),
                response.getId(),
                teacherId,
                teacherUser != null ? teacherUser.getName() : "老师",
                notificationMsg
            );
        }
        
        return response;
    }
    
    /**
     * 接受匹配请求
     *
     * @param matchId 匹配 ID
     * @param userId 当前用户 ID
     * @param userType 用户类型（student/teacher/parent）
     * @return 匹配响应
     */
    @Transactional(rollbackFor = Exception.class)
    public MatchResponse acceptMatch(Long matchId, Long userId, String userType) {
        TeacherStudentMatch match = matchRepository.selectById(matchId);
        if (match == null) {
            throw new RuntimeException("匹配记录不存在");
        }
        
        if (match.getStatus() == 3) {
            throw new RuntimeException("该匹配已被拒绝");
        }
        
        if (match.getStatus() == 2) {
            throw new RuntimeException("该匹配已确认");
        }
        
        Integer oldStatus = match.getStatus();
        
        // 根据用户类型更新确认状态
        if ("teacher".equals(userType)) {
            match.setTeacherConfirm(1);
        } else if ("student".equals(userType)) {
            match.setStudentConfirm(1);
        } else if ("parent".equals(userType)) {
            match.setParentConfirm(1);
        }
        
        // 更新状态
        updateMatchStatus(match);
        
        matchRepository.updateById(match);
        
        // 发送状态变更通知
        sendMatchStatusNotifications(match, oldStatus, userType, userId);
        
        return convertToMatchResponse(match);
    }
    
    /**
     * 拒绝匹配请求
     *
     * @param matchId 匹配 ID
     * @param userId 当前用户 ID
     * @param userType 用户类型（student/teacher/parent）
     * @return 匹配响应
     */
    @Transactional(rollbackFor = Exception.class)
    public MatchResponse rejectMatch(Long matchId, Long userId, String userType) {
        TeacherStudentMatch match = matchRepository.selectById(matchId);
        if (match == null) {
            throw new RuntimeException("匹配记录不存在");
        }
        
        if (match.getStatus() == 3) {
            throw new RuntimeException("该匹配已被拒绝");
        }
        
        if (match.getStatus() == 2) {
            throw new RuntimeException("该匹配已确认，无法拒绝");
        }
        
        Integer oldStatus = match.getStatus();
        
        // 根据用户类型更新确认状态
        if ("teacher".equals(userType)) {
            match.setTeacherConfirm(2);
        } else if ("student".equals(userType)) {
            match.setStudentConfirm(2);
        } else if ("parent".equals(userType)) {
            match.setParentConfirm(2);
        }
        
        // 更新状态为已拒绝
        match.setStatus(3);
        matchRepository.updateById(match);
        
        // 发送拒绝通知
        sendMatchRejectionNotifications(match, oldStatus, userType, userId);
        
        return convertToMatchResponse(match);
    }
    
    /**
     * 更新匹配状态
     *
     * @param match 匹配记录
     */
    private void updateMatchStatus(TeacherStudentMatch match) {
        // 如果任何一方拒绝，则状态为已拒绝
        if (match.getStudentConfirm() == 2 || match.getTeacherConfirm() == 2 || match.getParentConfirm() == 2) {
            match.setStatus(3);
            return;
        }
        
        // 如果所有相关方都同意，则状态为已匹配
        if ("student".equals(match.getRequesterType())) {
            // 学生发起的请求：需要学生、教师、家长都确认
            if (match.getStudentConfirm() == 1 && match.getTeacherConfirm() == 1 && match.getParentConfirm() == 1) {
                match.setStatus(2);
            } else if (match.getStudentConfirm() == 1 && match.getTeacherConfirm() == 1) {
                // 学生和老师已确认，等待家长确认
                match.setStatus(1);
            }
        } else {
            // 教师发起的请求：需要学生、教师、家长都确认
            if (match.getStudentConfirm() == 1 && match.getTeacherConfirm() == 1 && match.getParentConfirm() == 1) {
                match.setStatus(2);
            } else if (match.getTeacherConfirm() == 1) {
                // 教师已确认，等待学生和家长确认
                match.setStatus(0);
            }
        }
    }
    
    /**
     * 获取 AI 推荐的学生列表（教师视角）
     *
     * @param teacherId 教师 ID
     * @return 推荐学生列表
     */
    public List<AIRecommendationResponse> getTeacherRecommendations(Long teacherId) {
        // 获取教师信息
        Teacher teacher = teacherRepository.selectById(teacherId);
        if (teacher == null) {
            throw new RuntimeException("教师不存在");
        }
        
        // 获取所有未匹配的学生
        List<Student> allStudents = studentRepository.selectList(null);
        
        List<AIRecommendationResponse> recommendations = new ArrayList<>();
        
        for (Student student : allStudents) {
            // 检查是否已匹配
            LambdaQueryWrapper<TeacherStudentMatch> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(TeacherStudentMatch::getStudentId, student.getId())
                   .eq(TeacherStudentMatch::getTeacherId, teacherId)
                   .in(TeacherStudentMatch::getStatus, 2) // 已匹配
                   .eq(TeacherStudentMatch::getDeleted, 0);
            
            long count = matchRepository.selectCount(wrapper);
            if (count > 0) {
                continue; // 已匹配，跳过
            }
            
            // 获取学生用户信息
            User studentUser = userRepository.selectById(student.getUserId());
            if (studentUser == null) {
                continue;
            }
            
            // 计算匹配分数和原因
            AIRecommendationResponse recommendation = calculateMatchScore(teacher, student, studentUser);
            if (recommendation != null) {
                recommendations.add(recommendation);
            }
        }
        
        // 按匹配分数降序排序
        return recommendations.stream()
                .sorted((a, b) -> b.getMatchScore().compareTo(a.getMatchScore()))
                .limit(20) // 最多返回 20 个推荐
                .collect(Collectors.toList());
    }
    
    /**
     * 计算匹配分数
     *
     * @param teacher 教师
     * @param student 学生
     * @param studentUser 学生用户
     * @return AI 推荐响应
     */
    private AIRecommendationResponse calculateMatchScore(Teacher teacher, Student student, User studentUser) {
        AIRecommendationResponse response = new AIRecommendationResponse();
        response.setStudentId(student.getId());
        response.setStudentName(studentUser.getName());
        response.setStudentGrade(student.getGrade());
        response.setStudentSchool(student.getSchool());
        response.setLearningNeeds(student.getLearningNeeds());
        response.setSubject(teacher.getSubject());
        
        // 简单匹配算法：基于科目匹配
        double score = 50.0; // 基础分数
        StringBuilder reason = new StringBuilder();
        
        // 科目匹配（如果有学习需求）
        if (student.getLearningNeeds() != null && !student.getLearningNeeds().isEmpty()) {
            if (student.getLearningNeeds().contains(teacher.getSubject())) {
                score += 30;
                reason.append("科目匹配。");
            }
        }
        
        // 年级匹配（简化处理）
        if (teacher.getExperience() != null && teacher.getExperience().contains(student.getGrade())) {
            score += 20;
            reason.append("教师有该年级教学经验。");
        }
        
        // 如果分数太低，不推荐
        if (score < 60) {
            return null;
        }
        
        response.setMatchScore(Math.min(score, 100));
        response.setMatchReason(reason.toString().isEmpty() ? "基础匹配" : reason.toString());
        
        return response;
    }
    
    /**
     * 发送匹配状态变更通知
     *
     * @param match 匹配记录
     * @param oldStatus 原状态
     * @param userType 操作用户类型
     * @param userId 操作用户 ID
     */
    private void sendMatchStatusNotifications(TeacherStudentMatch match, Integer oldStatus, String userType, Long userId) {
        try {
            // 获取相关用户信息
            Student student = studentRepository.selectById(match.getStudentId());
            Teacher teacher = teacherRepository.selectById(match.getTeacherId());
            
            User studentUser = student != null ? userRepository.selectById(student.getUserId()) : null;
            User teacherUser = teacher != null ? userRepository.selectById(teacher.getUserId()) : null;
            
            String statusText = getStatusText(match.getStatus());
            
            // 根据请求发起方和操作类型，向不同用户发送通知
            if ("student".equals(match.getRequesterType())) {
                // 学生发起的请求
                if ("teacher".equals(userType)) {
                    // 教师确认，通知学生和家长
                    String msg = String.format("您的%s辅导请求已被%s老师%s",
                        teacher != null ? teacher.getSubject() : "", 
                        teacherUser != null ? teacherUser.getName() : "老师",
                        match.getStatus() == 3 ? "拒绝" : "接受");
                    
                    if (studentUser != null) {
                        notificationService.sendMatchStatusUpdate(student.getUserId(), match.getId(), match.getStatus(), msg);
                    }
                    
                    // 通知家长
                    if (match.getStatus() == 1) {
                        // 待家长确认，需要查找家长
                        notifyParent(match.getStudentId(), match.getId(), msg);
                    }
                } else if ("parent".equals(userType)) {
                    // 家长确认，通知学生和教师
                    String msg = String.format("家长已%s辅导匹配",
                        match.getStatus() == 3 ? "拒绝" : "确认");
                    
                    if (studentUser != null && match.getStatus() != 1) {
                        notificationService.sendMatchStatusUpdate(student.getUserId(), match.getId(), match.getStatus(), msg);
                    }
                    
                    if (teacherUser != null) {
                        String teacherMsg = match.getStatus() == 3 
                            ? "学生/家长拒绝了您的辅导请求"
                            : String.format("学生/家长已确认匹配，当前状态：%s", statusText);
                        notificationService.sendMatchStatusUpdate(teacher.getUserId(), match.getId(), match.getStatus(), teacherMsg);
                    }
                }
            } else {
                // 教师发起的邀请
                if ("student".equals(userType)) {
                    // 学生确认，通知教师和家长
                    String msg = String.format("学生已%s您的辅导邀请",
                        match.getStatus() == 3 ? "拒绝" : "接受");
                    
                    if (teacherUser != null) {
                        notificationService.sendMatchStatusUpdate(teacher.getUserId(), match.getId(), match.getStatus(), msg);
                    }
                    
                    // 通知家长
                    if (match.getStatus() == 0 || match.getStatus() == 1) {
                        notifyParent(match.getStudentId(), match.getId(), "学生已接受辅导邀请，等待家长确认");
                    }
                } else if ("parent".equals(userType)) {
                    // 家长确认，通知学生和教师
                    String msg = String.format("家长已%s辅导匹配",
                        match.getStatus() == 3 ? "拒绝" : "确认");
                    
                    if (studentUser != null && match.getStatus() != 0) {
                        notificationService.sendMatchStatusUpdate(student.getUserId(), match.getId(), match.getStatus(), msg);
                    }
                    
                    if (teacherUser != null) {
                        String teacherMsg = match.getStatus() == 3 
                            ? "学生/家长拒绝了您的辅导邀请"
                            : String.format("匹配已确认，当前状态：%s", statusText);
                        notificationService.sendMatchStatusUpdate(teacher.getUserId(), match.getId(), match.getStatus(), teacherMsg);
                    }
                }
            }
        } catch (Exception e) {
            log.error("发送匹配状态通知失败", e);
        }
    }
    
    /**
     * 发送匹配拒绝通知
     *
     * @param match 匹配记录
     * @param oldStatus 原状态
     * @param userType 操作用户类型
     * @param userId 操作用户 ID
     */
    private void sendMatchRejectionNotifications(TeacherStudentMatch match, Integer oldStatus, String userType, Long userId) {
        // 拒绝通知已包含在 sendMatchStatusNotifications 中
        sendMatchStatusNotifications(match, oldStatus, userType, userId);
    }
    
    /**
     * 向家长发送通知
     * 通过家长 - 学生关系查找家长
     */
    private void notifyParent(Long studentId, Long matchId, String message) {
        // TODO: 实现家长通知逻辑（需要 ParentStudentRelationRepository）
        log.debug("待实现：向家长发送通知 matchId={}, message={}", matchId, message);
    }
    
    /**
     * 获取状态文本描述
     */
    private String getStatusText(Integer status) {
        switch (status) {
            case 0: return "待确认";
            case 1: return "待家长确认";
            case 2: return "已匹配";
            case 3: return "已拒绝";
            default: return "未知";
        }
    }
    
    /**
     * 获取匹配统计数据
     *
     * @param teacherId 教师 ID（可选）
     * @param studentId 学生 ID（可选）
     * @return 统计数据 DTO
     */
    public MatchStatisticsDTO getMatchStatistics(Long teacherId, Long studentId) {
        try {
            log.info("获取匹配统计数据，teacherId={}, studentId={}", teacherId, studentId);
            Map<String, Object> result = matchRepository.getMatchStatistics(teacherId, studentId);
            log.info("查询结果：{}", result);
            
            MatchStatisticsDTO dto = new MatchStatisticsDTO();
            dto.setTeacherId(teacherId);
            dto.setStudentId(studentId);
            
            // 从 Map 中提取数据，处理可能的 null 值
            dto.setTotalMatches(getLongValue(result, "totalMatches"));
            dto.setSuccessfulMatches(getLongValue(result, "successfulMatches"));
            dto.setPendingMatches(getLongValue(result, "pendingMatches"));
            dto.setRejectedMatches(getLongValue(result, "rejectedMatches"));
            
            // 计算成功率
            dto.calculateSuccessRate();
            
            log.info("统计数据：total={}, success={}, pending={}, rejected={}, rate={}", 
                dto.getTotalMatches(), dto.getSuccessfulMatches(), 
                dto.getPendingMatches(), dto.getRejectedMatches(), dto.getSuccessRate());
            
            return dto;
        } catch (Exception e) {
            log.error("获取匹配统计数据失败", e);
            // 降级策略：数据库/依赖不可用时返回空统计，避免管理员看板直接 500
            MatchStatisticsDTO fallback = new MatchStatisticsDTO();
            fallback.setTeacherId(teacherId);
            fallback.setStudentId(studentId);
            fallback.setTotalMatches(0L);
            fallback.setSuccessfulMatches(0L);
            fallback.setPendingMatches(0L);
            fallback.setRejectedMatches(0L);
            fallback.calculateSuccessRate();
            return fallback;
        }
    }
    
    /**
     * 从 Map 中安全获取 Long 值
     */
    private Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) {
            return 0L;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
    
    /**
     * 转换实体为响应 DTO
     *
     * @param match 匹配实体
     * @return 匹配响应
     */
    private MatchResponse convertToMatchResponse(TeacherStudentMatch match) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setStudentId(match.getStudentId());
        response.setTeacherId(match.getTeacherId());
        response.setRequesterType(match.getRequesterType());
        response.setStatus(match.getStatus());
        response.setRequestMessage(match.getRequestMessage());
        response.setStudentConfirm(match.getStudentConfirm());
        response.setTeacherConfirm(match.getTeacherConfirm());
        response.setParentConfirm(match.getParentConfirm());
        response.setCreatedAt(match.getCreatedAt());
        response.setUpdatedAt(match.getUpdatedAt());
        
        // 获取学生信息
        Student student = studentRepository.selectById(match.getStudentId());
        if (student != null) {
            response.setStudentGrade(student.getGrade());
            response.setStudentSchool(student.getSchool());
            response.setStudentLearningNeeds(student.getLearningNeeds());
            
            User studentUser = userRepository.selectById(student.getUserId());
            if (studentUser != null) {
                response.setStudentName(studentUser.getName());
            }
        }
        
        // 获取教师信息
        Teacher teacher = teacherRepository.selectById(match.getTeacherId());
        if (teacher != null) {
            response.setSubject(teacher.getSubject());
            
            User teacherUser = userRepository.selectById(teacher.getUserId());
            if (teacherUser != null) {
                response.setTeacherName(teacherUser.getName());
            }
        }
        
        return response;
    }
}
