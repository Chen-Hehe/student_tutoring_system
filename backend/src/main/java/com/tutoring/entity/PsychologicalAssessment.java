package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 心理评估表
 */
@Data
@TableName("psychological_assessments")
public class PsychologicalAssessment {
    
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
     * 评估者 ID
     */
    private Long assessorId;
    
    /**
     * 评估日期
     */
    private LocalDateTime assessmentDate;
    
    /**
     * 评估分数
     */
    private Integer score;
    
    /**
     * 评估意见
     */
    private String comments;
    
    /**
     * 建议
     */
    private String recommendations;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
