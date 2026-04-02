package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

/**
 * 教师表
 */
@Data
@TableName("teachers")
public class Teacher {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 关联用户表
     */
    private Long userId;
    
    /**
     * 教授科目
     */
    private String subject;
    
    /**
     * 教育背景
     */
    private String education;
    
    /**
     * 教学经验
     */
    private String experience;
    
    /**
     * 专长
     */
    private String specialties;
    
    /**
     * 可用时间
     */
    private String availability;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
