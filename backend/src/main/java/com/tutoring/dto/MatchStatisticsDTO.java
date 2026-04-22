package com.tutoring.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 匹配统计数据 DTO
 */
@Data
public class MatchStatisticsDTO {
    
    /**
     * 总匹配数
     */
    private Long totalMatches;
    
    /**
     * 已匹配/成功数 (status=2)
     */
    private Long successfulMatches;
    
    /**
     * 待确认数 (status=0 或 1)
     */
    private Long pendingMatches;
    
    /**
     * 已拒绝数 (status=3)
     */
    private Long rejectedMatches;
    
    /**
     * 成功率 (百分比，保留 2 位小数)
     */
    private String successRate;
    
    /**
     * 教师 ID（可选，用于按教师筛选）
     */
    private Long teacherId;
    
    /**
     * 学生 ID（可选，用于按学生筛选）
     */
    private Long studentId;
    
    /**
     * 计算成功率
     */
    public void calculateSuccessRate() {
        if (totalMatches == null || totalMatches == 0) {
            this.successRate = "0.00%";
            return;
        }
        
        if (successfulMatches == null || successfulMatches == 0) {
            this.successRate = "0.00%";
            return;
        }
        
        BigDecimal rate = BigDecimal.valueOf(successfulMatches)
                .divide(BigDecimal.valueOf(totalMatches), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        
        this.successRate = rate.setScale(2, BigDecimal.ROUND_HALF_UP) + "%";
    }
}
