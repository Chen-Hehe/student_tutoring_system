package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

/**
 * 家长表
 */
@Data
@TableName("parents")
public class Parent {
    
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
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
