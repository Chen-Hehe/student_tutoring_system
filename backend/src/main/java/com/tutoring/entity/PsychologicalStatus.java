package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

@TableName("psychological_statuses")
public class PsychologicalStatus {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long studentId;
    private String emotionStatus;
    private String emotionLevel;
    private Integer emotionPercentage;
    private String socialStatus;
    private String socialLevel;
    private Integer socialPercentage;
    private String stressStatus;
    private String stressLevel;
    private Integer stressPercentage;
    private String mentalStatus;
    private String mentalLevel;
    private Integer mentalPercentage;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Date createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Date updatedAt;
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
    
    public String getEmotionStatus() {
        return emotionStatus;
    }
    
    public void setEmotionStatus(String emotionStatus) {
        this.emotionStatus = emotionStatus;
    }
    
    public String getEmotionLevel() {
        return emotionLevel;
    }
    
    public void setEmotionLevel(String emotionLevel) {
        this.emotionLevel = emotionLevel;
    }
    
    public Integer getEmotionPercentage() {
        return emotionPercentage;
    }
    
    public void setEmotionPercentage(Integer emotionPercentage) {
        this.emotionPercentage = emotionPercentage;
    }
    
    public String getSocialStatus() {
        return socialStatus;
    }
    
    public void setSocialStatus(String socialStatus) {
        this.socialStatus = socialStatus;
    }
    
    public String getSocialLevel() {
        return socialLevel;
    }
    
    public void setSocialLevel(String socialLevel) {
        this.socialLevel = socialLevel;
    }
    
    public Integer getSocialPercentage() {
        return socialPercentage;
    }
    
    public void setSocialPercentage(Integer socialPercentage) {
        this.socialPercentage = socialPercentage;
    }
    
    public String getStressStatus() {
        return stressStatus;
    }
    
    public void setStressStatus(String stressStatus) {
        this.stressStatus = stressStatus;
    }
    
    public String getStressLevel() {
        return stressLevel;
    }
    
    public void setStressLevel(String stressLevel) {
        this.stressLevel = stressLevel;
    }
    
    public Integer getStressPercentage() {
        return stressPercentage;
    }
    
    public void setStressPercentage(Integer stressPercentage) {
        this.stressPercentage = stressPercentage;
    }
    
    public String getMentalStatus() {
        return mentalStatus;
    }
    
    public void setMentalStatus(String mentalStatus) {
        this.mentalStatus = mentalStatus;
    }
    
    public String getMentalLevel() {
        return mentalLevel;
    }
    
    public void setMentalLevel(String mentalLevel) {
        this.mentalLevel = mentalLevel;
    }
    
    public Integer getMentalPercentage() {
        return mentalPercentage;
    }
    
    public void setMentalPercentage(Integer mentalPercentage) {
        this.mentalPercentage = mentalPercentage;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Integer getDeleted() {
        return deleted;
    }
    
    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }
}
