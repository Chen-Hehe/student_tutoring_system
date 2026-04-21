package com.tutoring.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.Result;
import com.tutoring.entity.User;
import com.tutoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class SimpleAdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getStatistics() {
        try {
            long totalUsers = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getDeleted, 0));
            long adminCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 1).eq(User::getDeleted, 0));
            long teacherCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 2).eq(User::getDeleted, 0));
            long studentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 3).eq(User::getDeleted, 0));
            long parentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 4).eq(User::getDeleted, 0));
            
            Map<String, Object> data = new HashMap<>();
            data.put("teacherCount", teacherCount);
            data.put("studentCount", studentCount);
            data.put("parentCount", parentCount);
            data.put("chatCount", 0);
            
            return Result.success(data);
        } catch (Exception e) {
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
                return 1;
            case "teacher":
                return 2;
            case "student":
                return 3;
            case "parent":
                return 4;
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
                return "admin";
            case 2:
                return "teacher";
            case 3:
                return "student";
            case 4:
                return "parent";
            default:
                return "未知";
        }
    }
}
