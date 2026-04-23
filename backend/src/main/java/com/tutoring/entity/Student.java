package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

/**
 * 学生表
 */
@Data
@TableName("students")
public class Student {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 关联用户表
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 年龄
     */
    private Integer age;
    
    /**
     * 年级
     */
    private String grade;
    
    /**
     * 学校
     */
    private String school;
    
    /**
     * 地址
     */
    private String address;
    
    /**
     * 学习需求
     */
    private String learningNeeds;
    
    /**
     * 心理状态
     */
    private String psychologicalStatus;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
