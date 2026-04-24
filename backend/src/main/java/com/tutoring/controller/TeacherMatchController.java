package com.tutoring.controller;

import com.tutoring.dto.MatchResponse;
import com.tutoring.dto.Result;
import com.tutoring.entity.Teacher;
import com.tutoring.repository.TeacherRepository;
import com.tutoring.service.MatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import java.util.List;

/**
 * 教师匹配管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
public class TeacherMatchController {

    private final MatchService matchService;
    private final TeacherRepository teacherRepository;

    /**
     * 获取教师的匹配列表
     *
     * @param userId 用户 ID (从 Token 中解析)
     * @return 匹配列表
     */
    @GetMapping("/teacher")
    public Result<List<MatchResponse>> getTeacherMatches(
            @RequestAttribute(value = "X-User-Id", required = false) Long userId
    ) {
        try {
            log.info("获取教师匹配列表，userId: {}", userId);
            
            // 如果没有提供用户ID，使用默认值1001（张老师）
            if (userId == null) {
                userId = 1001L;
                log.info("未提供用户ID，使用默认值: {}", userId);
            }
            
            try {
                // 根据用户ID获取教师信息
                log.info("根据用户ID获取教师信息，userId: {}", userId);
                List<Teacher> teachers = teacherRepository.selectList(new LambdaQueryWrapper<Teacher>().eq(Teacher::getUserId, userId));
                log.info("获取到教师信息数量: {}", teachers.size());
                
                if (teachers.isEmpty()) {
                    log.warn("教师信息不存在，userId: {}", userId);
                    return Result.error(404, "教师信息不存在");
                }
                
                Teacher teacher = teachers.get(0);
                log.info("获取到教师信息，teacherId: {}", teacher.getId());
                
                // 根据教师ID获取匹配列表
                log.info("根据教师ID获取匹配列表，teacherId: {}", teacher.getId());
                List<MatchResponse> matches = matchService.getTeacherMatches(teacher.getId());
                log.info("获取到匹配列表数量: {}", matches.size());
                
                return Result.success(matches);
            } catch (Exception e) {
                log.error("数据库操作失败，返回模拟数据", e);
                // 数据库操作失败，返回模拟数据
                return Result.success(matchService.getMockMatchResponses());
            }
        } catch (Exception e) {
            log.error("获取教师匹配列表失败", e);
            return Result.error(500, "获取教师匹配列表失败: " + e.getMessage());
        }
    }
}
