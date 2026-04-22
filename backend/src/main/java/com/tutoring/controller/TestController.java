package com.tutoring.controller;

import com.tutoring.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 生成密码哈希
     */
    @GetMapping("/hash")
    public Result<Map<String, String>> hashPassword(@RequestParam String password) {
        String hashedPassword = passwordEncoder.encode(password);
        return Result.success(Map.of(
                "password", password,
                "hashedPassword", hashedPassword
        ));
    }

    /**
     * 验证密码
     */
    @GetMapping("/verify")
    public Result<Map<String, Boolean>> verifyPassword(
            @RequestParam String password,
            @RequestParam String hashedPassword) {
        boolean matched = passwordEncoder.matches(password, hashedPassword);
        return Result.success(Map.of("matched", matched));
    }
}
