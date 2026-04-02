package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 家长学生关联表
 */
@Data
@TableName("parent_student_relations")
public class ParentStudentRelation {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 家长 ID
     */
    private Long parentId;
    
    /**
     * 学生 ID
     */
    private Long studentId;
    
    /**
     * 关系（如：父亲、母亲、爷爷等）
     */
    private String relationship;
    
    /**
     * 绑定时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
