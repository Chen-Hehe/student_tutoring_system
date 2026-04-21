package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    @TableField("password_hash")
    private String passwordHash;

    private Integer role;

    private String name;
    private String email;
    private String phone;
    private Integer gender;
    private String avatar;
    private String qq;
    private String wechat;

    @TableField("created_at")
    private LocalDateTime createdAt;

    private Integer deleted;
}

