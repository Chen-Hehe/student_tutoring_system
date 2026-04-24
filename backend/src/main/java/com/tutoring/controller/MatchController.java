package com.tutoring.controller;

import com.tutoring.dto.MatchRequest;
import com.tutoring.dto.MatchResponse;
import com.tutoring.dto.AIRecommendationResponse;
import com.tutoring.dto.MatchStatisticsDTO;
import com.tutoring.dto.Result;
import com.tutoring.service.MatchService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 匹配管理控制器
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    
    private final MatchService matchService;
    
    /**
     * 获取教师的匹配列表（通过路径参数）
     *
     * @param userId 用户 ID
     * @return 匹配列表
     */
    @GetMapping("/teacher/{userId}")
    public Result<List<MatchResponse>> getTeacherMatches(@PathVariable Long userId) {
        try {
            List<MatchResponse> matches = matchService.getTeacherMatches(userId);
            return Result.success(matches);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取教师的匹配列表（通过查询参数）
     *
     * @param userId 用户 ID
     * @return 匹配列表
     */
    @GetMapping("/teacher")
    public Result<List<MatchResponse>> getTeacherMatches(@RequestParam(required = false) Long userId) {
        try {
            if (userId == null) {
                return Result.error(400, "用户ID不能为空");
            }
            List<MatchResponse> matches = matchService.getTeacherMatches(userId);
            return Result.success(matches);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取学生的匹配列表
     *
     * @param studentId 学生 ID
     * @return 匹配列表
     */
    @GetMapping("/student/{studentId}")
    public Result<List<MatchResponse>> getStudentMatches(@PathVariable Long studentId) {
        try {
            List<MatchResponse> matches = matchService.getStudentMatches(studentId);
            return Result.success(matches);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 创建匹配请求
     *
     * @param request 匹配请求
     * @return 匹配结果
     */
    @PostMapping
    public Result<MatchResponse> createMatch(@Valid @RequestBody MatchRequest request) {
        try {
            MatchResponse match = matchService.createMatch(request);
            return Result.success("匹配请求已创建", match);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 发送辅导邀请（教师主动发起）
     *
     * @param body 请求体 {teacherId, studentId, message}
     * @return 匹配结果
     */
    @PostMapping("/invite")
    public Result<MatchResponse> sendInvitation(@RequestBody Map<String, Object> body) {
        try {
            Long teacherId = Long.valueOf(body.get("teacherId").toString());
            Long studentId = Long.valueOf(body.get("studentId").toString());
            String message = body.get("message") != null ? body.get("message").toString() : "";
            
            MatchResponse match = matchService.sendInvitation(teacherId, studentId, message);
            return Result.success("辅导邀请已发送", match);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 接受匹配请求
     *
     * @param matchId 匹配 ID
     * @param body 请求体 {userId, userType}
     * @return 匹配结果
     */
    @PostMapping("/{matchId}/accept")
    public Result<MatchResponse> acceptMatch(
            @PathVariable Long matchId,
            @RequestBody Map<String, Object> body
    ) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            String userType = body.get("userType").toString();
            
            MatchResponse match = matchService.acceptMatch(matchId, userId, userType);
            return Result.success("已接受匹配", match);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 拒绝匹配请求
     *
     * @param matchId 匹配 ID
     * @param body 请求体 {userId, userType}
     * @return 匹配结果
     */
    @PostMapping("/{matchId}/reject")
    public Result<MatchResponse> rejectMatch(
            @PathVariable Long matchId,
            @RequestBody Map<String, Object> body
    ) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            String userType = body.get("userType").toString();
            
            MatchResponse match = matchService.rejectMatch(matchId, userId, userType);
            return Result.success("已拒绝匹配", match);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 更新匹配状态
     *
     * @param matchId 匹配 ID
     * @param body 请求体 {studentConfirm, teacherConfirm, parentConfirm}
     * @return 匹配结果
     */
    @PutMapping("/{matchId}/status")
    public Result<MatchResponse> updateMatchStatus(
            @PathVariable Long matchId,
            @RequestBody Map<String, Object> body
    ) {
        try {
            // 这里可以根据需要实现更复杂的状态更新逻辑
            // 目前主要通过 accept/reject 接口来更新状态
            MatchResponse match = matchService.getTeacherMatches((Long) body.get("teacherId"))
                    .stream()
                    .filter(m -> m.getId().equals(matchId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("匹配记录不存在"));
            
            return Result.success(match);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 获取匹配详情
     *
     * @param matchId 匹配 ID
     * @return 匹配详情
     */
    @GetMapping("/{matchId}")
    public Result<MatchResponse> getMatchDetail(@PathVariable Long matchId) {
        try {
            // 这里可以添加一个 getDetail 方法到 Service
            // 暂时返回错误
            return Result.error(501, "暂未实现");
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取 AI 推荐的学生列表（教师视角）
     *
     * @param userId 用户 ID
     * @return 推荐学生列表
     */
    @GetMapping("/recommendations/teacher/{userId}")
    public Result<List<AIRecommendationResponse>> getTeacherRecommendations(@PathVariable Long userId) {
        try {
            List<AIRecommendationResponse> recommendations = matchService.getTeacherRecommendations(userId);
            return Result.success(recommendations);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取 AI 推荐的教师列表（学生视角）
     *
     * @param studentId 学生 ID
     * @return 推荐教师列表
     */
    @GetMapping("/recommendations/student/{studentId}")
    public Result<List<AIRecommendationResponse>> getStudentRecommendations(@PathVariable Long studentId) {
        try {
            // TODO: 实现学生视角的推荐
            return Result.success(java.util.Collections.emptyList());
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取匹配统计数据
     * 支持全局统计（Admin 视角）或按用户筛选（教师/学生视角）
     *
     * @param teacherId 教师 ID（可选，教师视角）
     * @param studentId 学生 ID（可选，学生视角）
     * @return 统计数据
     */
    @GetMapping("/statistics")
    public Result<MatchStatisticsDTO> getMatchStatistics(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Long studentId
    ) {
        try {
            MatchStatisticsDTO statistics = matchService.getMatchStatistics(teacherId, studentId);
            return Result.success(statistics);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
}
