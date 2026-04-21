package com.tutoring.dto;

import com.tutoring.entity.Student;

/**
 * 学生信息DTO，包含学生基本信息和姓名
 */
public class StudentInfoDTO {
    private Long id;
    private Long userId;
    private String name; // 学生姓名
    private Integer age;
    private String grade;
    private String school;
    private String address;
    private String learningNeeds;
    private String subject; // 辅导科目，从learningNeeds提取
    private String psychologicalStatus;
    private Integer deleted;

    // 构造方法，从Student和User创建
    public StudentInfoDTO(Student student, String name) {
        this.id = student.getId();
        this.userId = student.getUserId();
        this.name = name;
        this.age = student.getAge();
        this.grade = student.getGrade();
        this.school = student.getSchool();
        this.address = student.getAddress();
        this.learningNeeds = student.getLearningNeeds();
        // 从learningNeeds中提取subject字段
        this.subject = extractSubject(student.getLearningNeeds());
        this.psychologicalStatus = student.getPsychologicalStatus();
        this.deleted = student.getDeleted();
    }
    
    // 从learningNeeds中提取subject字段
    private String extractSubject(String learningNeeds) {
        if (learningNeeds == null || learningNeeds.isEmpty()) {
            return "未设置";
        }
        // 简单处理，提取需要辅导的科目，忽略空格
        String normalized = learningNeeds.replaceAll("\\s+", "");
        if (normalized.contains("数学")) {
            return "数学";
        } else if (normalized.contains("语文")) {
            return "语文";
        } else if (normalized.contains("英语")) {
            return "英语";
        } else {
            return "未设置";
        }
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLearningNeeds() {
        return learningNeeds;
    }

    public void setLearningNeeds(String learningNeeds) {
        this.learningNeeds = learningNeeds;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPsychologicalStatus() {
        return psychologicalStatus;
    }

    public void setPsychologicalStatus(String psychologicalStatus) {
        this.psychologicalStatus = psychologicalStatus;
    }

    public Integer getDeleted() {
        return deleted;
    }

    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }
}