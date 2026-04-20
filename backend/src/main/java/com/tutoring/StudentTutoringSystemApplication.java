package com.tutoring;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 乡村助学平台后端应用
 */
@SpringBootApplication
@MapperScan({"com.tutoring.repository", "com.tutoring.mapper"})
public class StudentTutoringSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentTutoringSystemApplication.class, args);
    }
}
