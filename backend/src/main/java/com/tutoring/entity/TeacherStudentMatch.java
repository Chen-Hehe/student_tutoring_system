package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 师生匹配表
 */
@Data
@TableName("teacher_student_matches")
public class TeacherStudentMatch {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 学生 ID
     */
    private Long studentId;
    
    /**
     * 教师 ID
     */
    private Long teacherId;
    
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
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
