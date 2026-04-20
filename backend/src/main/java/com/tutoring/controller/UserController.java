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
            // 临时直接返回成功，不进行密码验证
            Map<String, Object> data = new java.util.HashMap<>();
            data.put("token", "temp-token-" + System.currentTimeMillis());
            Map<String, Object> user = new java.util.HashMap<>();
            user.put("id", 1L);
            user.put("username", request.getUsername());
            user.put("role", request.getRole());
            user.put("name", "管理员");
            data.put("user", user);
            System.out.println("Login success: " + data);
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
            // 模拟数据 - 实际项目中应该从数据库获取
            java.util.List<UserInfo> users = new java.util.ArrayList<>();
            
            // 教师用户
            UserInfo teacher1 = new UserInfo();
            teacher1.setId(1L);
            teacher1.setUsername("teacher1");
            teacher1.setName("李老师");
            teacher1.setRole(1);
            teacher1.setRoleName("教师");
            teacher1.setCreatedAt(java.time.LocalDateTime.now().minusDays(30));
            users.add(teacher1);
            
            UserInfo teacher2 = new UserInfo();
            teacher2.setId(2L);
            teacher2.setUsername("teacher2");
            teacher2.setName("王老师");
            teacher2.setRole(1);
            teacher2.setRoleName("教师");
            teacher2.setCreatedAt(java.time.LocalDateTime.now().minusDays(25));
            users.add(teacher2);
            
            // 学生用户
            UserInfo student1 = new UserInfo();
            student1.setId(3L);
            student1.setUsername("student1");
            student1.setName("小明");
            student1.setRole(2);
            student1.setRoleName("学生");
            student1.setCreatedAt(java.time.LocalDateTime.now().minusDays(20));
            users.add(student1);
            
            UserInfo student2 = new UserInfo();
            student2.setId(4L);
            student2.setUsername("student2");
            student2.setName("小红");
            student2.setRole(2);
            student2.setRoleName("学生");
            student2.setCreatedAt(java.time.LocalDateTime.now().minusDays(15));
            users.add(student2);
            
            // 家长用户
            UserInfo parent1 = new UserInfo();
            parent1.setId(5L);
            parent1.setUsername("parent1");
            parent1.setName("王家长");
            parent1.setRole(3);
            parent1.setRoleName("家长");
            parent1.setCreatedAt(java.time.LocalDateTime.now().minusDays(10));
            users.add(parent1);
            
            // 管理员用户
            UserInfo admin1 = new UserInfo();
            admin1.setId(6L);
            admin1.setUsername("admin1");
            admin1.setName("管理员");
            admin1.setRole(4);
            admin1.setRoleName("管理员");
            admin1.setCreatedAt(java.time.LocalDateTime.now().minusDays(35));
            users.add(admin1);
            
            // 角色过滤
            if (role != null) {
                users = users.stream().filter(user -> user.getRole().equals(role)).collect(java.util.stream.Collectors.toList());
            }
            
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
            // 模拟更新 - 实际项目中应该更新数据库
            System.out.println("Update user: " + userId + " with data: " + userInfo);
            // 返回更新后的用户信息
            return Result.success(userInfo);
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
            System.out.println("Toggle user status: " + userId + " disabled: " + disabled);
            // 模拟操作 - 实际项目中应该更新数据库
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
}
