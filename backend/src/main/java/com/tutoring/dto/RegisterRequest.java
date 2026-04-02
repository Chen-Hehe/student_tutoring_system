package com.tutoring.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 注册请求 DTO
 */
@Data
public class RegisterRequest {
    
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    private String password;
    
    /**
     * 角色 (1:教师，2:学生，3:家长，4:管理员)
     */
    @NotNull(message = "角色不能为空")
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
     * QQ 号
     */
    private String qq;
    
    /**
     * 微信
     */
    private String wechat;
}
