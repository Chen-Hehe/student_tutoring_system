package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * AI 匹配记录表
 */
@Data
@TableName("ai_matches")
public class AIMatch {
    
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
     * 匹配分数
     */
    private Double matchScore;
    
    /**
     * 匹配原因
     */
    private String matchReason;
    
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
