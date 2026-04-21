package com.tutoring.dto;

import com.tutoring.entity.TeacherStudentMatch;

import java.time.LocalDateTime;

public class SimpleMatchRequestDTO {
    private Long id;
    private Long studentId;
    private Long teacherId;
    private String studentName;
    private String grade;
    private String teacherName;
    private String subject;
    private Integer status;
    private String requestMessage;
    private LocalDateTime createdAt;

    public SimpleMatchRequestDTO(TeacherStudentMatch match, String studentName, String grade, String teacherName, String subject) {
        this.id = match.getId();
        this.studentId = match.getStudentId();
        this.teacherId = match.getTeacherId();
        this.studentName = studentName;
        this.grade = grade;
        this.teacherName = teacherName;
        this.subject = subject;
        this.status = match.getStatus();
        this.requestMessage = match.getRequestMessage();
        this.createdAt = match.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
