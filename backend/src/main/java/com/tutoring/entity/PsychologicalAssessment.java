package com.tutoring.entity;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

@TableName("psychological_assessments")
public class PsychologicalAssessment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long studentId;
    private Long assessorId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Date assessmentDate;
    private Integer score;
    private String comments;
    private String recommendations;
    private String assessType;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Date createdAt;
    private Integer deleted;
    
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
    
    public Long getAssessorId() {
        return assessorId;
    }
    
    public void setAssessorId(Long assessorId) {
        this.assessorId = assessorId;
    }
    
    public Date getAssessmentDate() {
        return assessmentDate;
    }
    
    public void setAssessmentDate(Date assessmentDate) {
        this.assessmentDate = assessmentDate;
    }
    
    public Integer getScore() {
        return score;
    }
    
    public void setScore(Integer score) {
        this.score = score;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public String getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
    
    public String getAssessType() {
        return assessType;
    }
    
    public void setAssessType(String assessType) {
        this.assessType = assessType;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getDeleted() {
        return deleted;
    }
    
    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }
}
