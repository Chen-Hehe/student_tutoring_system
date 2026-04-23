package com.tutoring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @GetMapping("/statistics")
    public Map<String, Object> getMatchStatistics() {
        // simple-backend 是演示/联调用的轻量后端：这里返回管理员看板需要的字段结构
        int totalMatches = 12;
        int successfulMatches = 7;
        int pendingMatches = 4;
        int rejectedMatches = 1;

        String successRate = "0.00%";
        if (totalMatches > 0) {
            BigDecimal rate = BigDecimal.valueOf(successfulMatches)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalMatches), 2, RoundingMode.HALF_UP);
            successRate = rate.toPlainString() + "%";
        }

        Map<String, Object> data = new HashMap<>();
        data.put("totalMatches", totalMatches);
        data.put("successfulMatches", successfulMatches);
        data.put("pendingMatches", pendingMatches);
        data.put("rejectedMatches", rejectedMatches);
        data.put("successRate", successRate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }
}

