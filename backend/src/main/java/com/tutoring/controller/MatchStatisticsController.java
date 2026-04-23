package com.tutoring.controller;

import com.tutoring.dto.MatchStatisticsDTO;
import com.tutoring.dto.Result;
import com.tutoring.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 匹配统计接口（为避免 Maven 编译排除 MatchController，单独提供统计端点）
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchStatisticsController {

    private final MatchService matchService;

    @GetMapping("/statistics")
    public Result<MatchStatisticsDTO> getMatchStatistics(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Long studentId
    ) {
        MatchStatisticsDTO statistics = matchService.getMatchStatistics(teacherId, studentId);
        return Result.success(statistics);
    }
}

