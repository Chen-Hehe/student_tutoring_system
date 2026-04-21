package com.tutoring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, Object> data = new HashMap<>();
        data.put("teacherCount", 3);
        data.put("studentCount", 5);
        data.put("parentCount", 3);
        data.put("chatCount", 0);
        
        response.put("data", data);
        return response;
    }
    
    @GetMapping("/users")
    public Map<String, Object> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String role) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        List<Map<String, Object>> users = new ArrayList<>();
        
        // 管理员
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", 1);
        admin.put("username", "admin");
        admin.put("name", "管理员");
        admin.put("role", "admin");
        admin.put("status", "活跃");
        users.add(admin);
        
        // 教师
        Map<String, Object> teacher1 = new HashMap<>();
        teacher1.put("id", 101);
        teacher1.put("username", "teacher_zhang");
        teacher1.put("name", "张老师");
        teacher1.put("role", "teacher");
        teacher1.put("status", "活跃");
        users.add(teacher1);
        
        Map<String, Object> teacher2 = new HashMap<>();
        teacher2.put("id", 102);
        teacher2.put("username", "teacher_li");
        teacher2.put("name", "李老师");
        teacher2.put("role", "teacher");
        teacher2.put("status", "活跃");
        users.add(teacher2);
        
        Map<String, Object> teacher3 = new HashMap<>();
        teacher3.put("id", 103);
        teacher3.put("username", "teacher_wang");
        teacher3.put("name", "王老师");
        teacher3.put("role", "teacher");
        teacher3.put("status", "活跃");
        users.add(teacher3);
        
        // 学生
        Map<String, Object> student1 = new HashMap<>();
        student1.put("id", 201);
        student1.put("username", "student_hu");
        student1.put("name", "小红");
        student1.put("role", "student");
        student1.put("status", "活跃");
        users.add(student1);
        
        Map<String, Object> student2 = new HashMap<>();
        student2.put("id", 202);
        student2.put("username", "student_gao");
        student2.put("name", "小高");
        student2.put("role", "student");
        student2.put("status", "活跃");
        users.add(student2);
        
        Map<String, Object> student3 = new HashMap<>();
        student3.put("id", 203);
        student3.put("username", "student_chen");
        student3.put("name", "小陈");
        student3.put("role", "student");
        student3.put("status", "活跃");
        users.add(student3);
        
        // 家长
        Map<String, Object> parent1 = new HashMap<>();
        parent1.put("id", 301);
        parent1.put("username", "parent_chen");
        parent1.put("name", "王家长");
        parent1.put("role", "parent");
        parent1.put("status", "活跃");
        users.add(parent1);
        
        Map<String, Object> parent2 = new HashMap<>();
        parent2.put("id", 302);
        parent2.put("username", "parent_li");
        parent2.put("name", "李家长");
        parent2.put("role", "parent");
        parent2.put("status", "活跃");
        users.add(parent2);
        
        Map<String, Object> parent3 = new HashMap<>();
        parent3.put("id", 303);
        parent3.put("username", "parent_wang");
        parent3.put("name", "王家长");
        parent3.put("role", "parent");
        parent3.put("status", "活跃");
        users.add(parent3);
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", users);
        data.put("total", users.size());
        data.put("page", page);
        data.put("size", size);
        
        response.put("data", data);
        return response;
    }
}
