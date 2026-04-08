package com.tutoring.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 匹配响应 DTO
 */
@Data
public class MatchResponse {
    
    /**
     * 匹配 ID
     */
    private Long id;
    
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
     * 学生学习需求
     */
    private String studentLearningNeeds;
    
    /**
     * 教师 ID
     */
    private Long teacherId;
    
    /**
     * 教师姓名
     */
    private String teacherName;
    
    /**
     * 教师科目
     */
    private String subject;
    
    /**
     * 请求发起方（student/teacher）
     */
    private String requesterType;
    
    /**
     * 状态 (0:待确认，1:待家长确认，2:已匹配，3:已拒绝)
     */
    private Integer status;
    
    /**
     * 请求消息
     */
    private String requestMessage;
    
    /**
     * 学生确认 (0:未操作，1:已同意，2:已拒绝)
     */
    private Integer studentConfirm;
    
    /**
     * 家长确认 (0:未操作，1:已同意，2:已拒绝)
     */
    private Integer parentConfirm;
    
    /**
     * 教师确认 (0:未操作，1:已同意，2:已拒绝)
     */
    private Integer teacherConfirm;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
