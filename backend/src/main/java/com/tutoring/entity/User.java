package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户表
 */
@Data
@TableName("users")
public class User {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 角色 (1:教师，2:学生，3:家长，4:管理员)
     */
    private Integer role;
    
    /**
     * 真实姓名
     */
    private String name;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 电话
     */
    private String phone;
    
    /**
     * 性别
     */
    private Integer gender;
    
    /**
     * 出生日期
     */
    private LocalDateTime birthDate;
    
    /**
     * QQ 号
     */
    private String qq;
    
    /**
     * 微信
     */
    private String wechat;
    
    /**
     * 地址
     */
    private String address;
    
    /**
     * 头像
     */
    private String avatar;
    
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
