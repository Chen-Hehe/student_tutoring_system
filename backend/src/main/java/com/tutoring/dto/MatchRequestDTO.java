package com.tutoring.dto;

import com.tutoring.entity.TeacherStudentMatch;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MatchRequestDTO {
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

    public MatchRequestDTO(TeacherStudentMatch match, String studentName, String grade, String teacherName, String subject) {
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
}
