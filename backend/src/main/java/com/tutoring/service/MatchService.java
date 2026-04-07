package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.AIRecommendationResponse;
import com.tutoring.dto.MatchRequest;
import com.tutoring.dto.MatchResponse;
import com.tutoring.entity.Student;
import com.tutoring.entity.Teacher;
import com.tutoring.entity.TeacherStudentMatch;
import com.tutoring.entity.User;
import com.tutoring.repository.StudentRepository;
import com.tutoring.repository.TeacherRepository;
import com.tutoring.repository.TeacherStudentMatchRepository;
import com.tutoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 匹配服务类
 */
@Service
@RequiredArgsConstructor
public class MatchService {
    
    private final TeacherStudentMatchRepository matchRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    
    /**
     * 获取教师的匹配列表
     *
     * @param teacherId 教师 ID
     * @return 匹配列表
     */
    public List<MatchResponse> getTeacherMatches(Long teacherId) {
        List<TeacherStudentMatch> matches = matchRepository.selectByTeacherId(teacherId);
        return matches.stream()
                .map(this::convertToMatchResponse)
                .collect(Collectors.toList());
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
        Student student = studentRepository.selectById(request.getStudentId());
        if (student == null) {
            throw new RuntimeException("学生不存在");
        }
        
        Teacher teacher = teacherRepository.selectById(request.getTeacherId());
        if (teacher == null) {
            throw new RuntimeException("教师不存在");
        }
        
        // 检查是否已存在匹配
        LambdaQueryWrapper<TeacherStudentMatch> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TeacherStudentMatch::getStudentId, request.getStudentId())
               .eq(TeacherStudentMatch::getTeacherId, request.getTeacherId())
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
        match.setStudentId(request.getStudentId());
        match.setTeacherId(request.getTeacherId());
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
        
        return createMatch(request);
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
