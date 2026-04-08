package com.tutoring.dto;

import lombok.Data;

/**
 * AI 推荐响应 DTO
 */
@Data
public class AIRecommendationResponse {
    
    /**
     * 学生 ID
     */
    private Long studentId;
    
    /**
     * 学生姓名
     */
    private String studentName;
    
    /**
     * 学生年级
     */
    private String studentGrade;
    
    /**
     * 学生学校
     */
    private String studentSchool;
    
    /**
     * 学习需求
     */
    private String learningNeeds;
    
    /**
     * 科目
     */
    private String subject;
    
    /**
     * 匹配分数 (0-100)
     */
    private Double matchScore;
    
    /**
     * 匹配原因
     */
    private String matchReason;
}
