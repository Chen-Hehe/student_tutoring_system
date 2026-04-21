package com.tutoring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.Result;
import com.tutoring.entity.User;
import com.tutoring.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getStatistics() {
        try {
            System.out.println("获取统计数据...");
            System.out.println("userRepository: " + userRepository);
            long teacherCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 1).eq(User::getDeleted, 0));
            System.out.println("教师数量: " + teacherCount);
            long studentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 2).eq(User::getDeleted, 0));
            System.out.println("学生数量: " + studentCount);
            long parentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 3).eq(User::getDeleted, 0));
            System.out.println("家长数量: " + parentCount);
            long chatCount = 0;
            
            Map<String, Object> data = new HashMap<>();
            data.put("teacherCount", teacherCount);
            data.put("studentCount", studentCount);
            data.put("parentCount", parentCount);
            data.put("chatCount", chatCount);
            
            System.out.println("统计数据: " + data);
            return Result.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取统计失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/users")
    public Result<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String role) {
        try {
            int offset = (page - 1) * size;
            
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getDeleted, 0);
            
            if (role != null && !role.isEmpty()) {
                Integer roleNum = convertRoleToNumber(role);
                if (roleNum != null) {
                    wrapper.eq(User::getRole, roleNum);
                }
            }
            
            long total = userRepository.selectCount(wrapper);
            
            wrapper.orderByDesc(User::getCreatedAt);
            wrapper.last("LIMIT " + offset + ", " + size);
            List<User> users = userRepository.selectList(wrapper);
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("name", user.getName());
                userInfo.put("role", getRoleName(user.getRole()));
                userInfo.put("status", user.getDeleted() == 0 ? "活跃" : "禁用");
                return userInfo;
            }).collect(Collectors.toList());
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", userList);
            data.put("total", total);
            data.put("page", page);
            data.put("size", size);
            
            return Result.success(data);
        } catch (Exception e) {
            return Result.error(500, "获取用户列表失败: " + e.getMessage());
        }
    }
    
    private Integer convertRoleToNumber(String role) {
        if (role == null) {
            return null;
        }
        switch (role.toLowerCase()) {
            case "admin":
                return 4;
            case "teacher":
                return 1;
            case "student":
                return 2;
            case "parent":
                return 3;
            default:
                return null;
        }
    }
    
    private String getRoleName(Integer role) {
        if (role == null) {
            return "未知";
        }
        switch (role) {
            case 1:
                return "teacher";
            case 2:
                return "student";
            case 3:
                return "parent";
            case 4:
                return "admin";
            default:
                return "未知";
        }
    }
    
    @PostMapping("/users/edit")
    public Result<Boolean> editUser(@RequestBody Map<String, Object> userData) {
        try {
            // 处理不同类型的id参数
            Long id;
            Object idObj = userData.get("id");
            if (idObj instanceof Number) {
                id = ((Number) idObj).longValue();
            } else if (idObj instanceof String) {
                id = Long.parseLong((String) idObj);
            } else {
                return Result.error(400, "无效的用户ID");
            }
            
            String name = (String) userData.get("name");
            String roleStr = (String) userData.get("role");
            
            System.out.println("编辑用户 - ID: " + id);
            System.out.println("编辑用户 - 姓名: " + name);
            System.out.println("编辑用户 - 角色: " + roleStr);
            
            User user = userRepository.selectById(id);
            if (user == null) {
                System.out.println("用户不存在: " + id);
                return Result.error(404, "用户不存在");
            }
            
            System.out.println("原始用户信息 - 姓名: " + user.getName());
            
            if (name != null && !name.isEmpty()) {
                user.setName(name);
                System.out.println("更新后的用户信息 - 姓名: " + user.getName());
            }
            
            if (roleStr != null && !roleStr.isEmpty()) {
                Integer roleNum = convertRoleToNumber(roleStr);
                if (roleNum != null) {
                    user.setRole(roleNum);
                    System.out.println("更新后的用户信息 - 角色: " + user.getRole());
                }
            }
            
            int result = userRepository.updateById(user);
            System.out.println("更新结果: " + result);
            
            // 验证更新结果
            User updatedUser = userRepository.selectById(id);
            System.out.println("数据库中的用户信息 - 姓名: " + updatedUser.getName());
            
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "编辑用户失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/users/disable")
    public Result<Boolean> disableUser(@RequestParam Long id) {
        try {
            User user = userRepository.selectById(id);
            if (user == null) {
                return Result.error(404, "用户不存在");
            }
            
            user.setDeleted(user.getDeleted() == 0 ? 1 : 0);
            userRepository.updateById(user);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "禁用用户失败: " + e.getMessage());
        }
    }
}
