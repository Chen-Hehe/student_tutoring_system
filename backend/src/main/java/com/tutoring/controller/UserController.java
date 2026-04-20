package com.tutoring.controller;

import com.tutoring.dto.LoginRequest;
import com.tutoring.dto.RegisterRequest;
import com.tutoring.dto.Result;
import com.tutoring.dto.UserInfo;
import com.tutoring.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 用户登录
     *
     * @param request 登录请求
     * @return 登录结果
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("Login request: " + request);
            // 调用真实的登录服务逻辑，生成合法的 JWT Token
            Map<String, Object> data = userService.login(request);
            System.out.println("Login success for user: " + request.getUsername());
            return Result.success("登录成功", data);
        } catch (RuntimeException e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 用户注册
     *
     * @param request 注册请求
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<UserInfo> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserInfo userInfo = userService.register(request);
            return Result.success("注册成功", userInfo);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }
    
    /**
     * 获取当前用户信息
     *
     * @param userId 用户 ID (从 Token 中解析)
     * @return 用户信息
     */
    @GetMapping("/info")
    public Result<UserInfo> getUserInfo(@RequestHeader("X-User-Id") Long userId) {
        try {
            UserInfo userInfo = userService.getUserById(userId);
            return Result.success(userInfo);
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }
    
    /**
     * 获取用户列表（带角色过滤）
     *
     * @param role 角色筛选（可选，1=教师，2=学生，3=家长，4=管理员）
     * @return 用户列表
     */
    @GetMapping("/users/list")
    public Result<java.util.List<UserInfo>> listUsers(@RequestParam(required = false) Integer role) {
        try {
            java.util.List<UserInfo> users = userService.listUsers(role);
            return Result.success(users);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }

    /**
     * 更新用户信息
     *
     * @param userId 用户ID
     * @param userInfo 用户信息
     * @return 更新结果
     */
    @PutMapping("/users/{userId}")
    public Result<UserInfo> updateUser(@PathVariable Long userId, @RequestBody UserInfo userInfo) {
        try {
            UserInfo updatedUser = userService.updateUser(userId, userInfo);
            return Result.success(updatedUser);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }

    /**
     * 禁用/启用用户
     *
     * @param userId 用户ID
     * @param request 禁用请求
     * @return 操作结果
     */
    @PutMapping("/users/{userId}/status")
    public Result<Void> toggleUserStatus(@PathVariable Long userId, @RequestBody java.util.Map<String, Boolean> request) {
        try {
            Boolean disabled = request.get("disabled");
            userService.toggleUserStatus(userId, disabled);
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
}
