package com.tutoring.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 匹配请求 DTO
 */
@Data
public class MatchRequest {
    
    /**
     * 学生 ID
     */
    @NotNull(message = "学生 ID 不能为空")
    private Long studentId;
    
    /**
     * 教师 ID
     */
    @NotNull(message = "教师 ID 不能为空")
    private Long teacherId;
    
    /**
     * 请求发起方（student/teacher）
     */
    @NotBlank(message = "请求发起方不能为空")
    private String requesterType;
    
    /**
     * 请求消息
     */
    private String requestMessage;
    
    /**
     * 科目
     */
    private String subject;
}
