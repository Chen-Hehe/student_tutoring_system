package com.tutoring.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户信息 DTO
 */
@Data
public class UserInfo {
    
    /**
     * 用户 ID
     */
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 角色 (1:教师，2:学生，3:家长，4:管理员)
     */
    private Integer role;
    
    /**
     * 角色名称
     */
    private String roleName;
    
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
     * 头像
     */
    private String avatar;
    
    /**
     * QQ 号
     */
    private String qq;
    
    /**
     * 微信
     */
    private String wechat;
    
    /**
     * 学生 ID (仅学生角色)
     */
    private Long studentId;
    
    /**
     * 教师 ID (仅教师角色)
     */
    private Long teacherId;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 获取角色名称
     */
    public static String getRoleName(Integer role) {
        if (role == null) return "未知";
        return switch (role) {
            case 1 -> "教师";
            case 2 -> "学生";
            case 3 -> "家长";
            case 4 -> "管理员";
            default -> "未知";
        };
    }
}
