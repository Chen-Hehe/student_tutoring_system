package com.tutoring.dto;

import com.tutoring.entity.PsychologicalAssessmentDetail;

import java.util.List;
import java.util.Map;

/**
 * 心理状态评估DTO类
 */
public class PsychologicalStatusDTO {
    private String studentName;
    private String grade;
    private Map<String, StatusData> statuses;
    private Map<String, AssessmentData> assessments;
    private String comments;
    private String recommendations;
    
    // 内部类
    public static class StatusData {
        private String value;
        private String level;
        private int percentage;
        
        // Getter and Setter
        public String getValue() {
            return value;
        }
        
        public void setValue(String value) {
            this.value = value;
        }
        
        public String getLevel() {
            return level;
        }
        
        public void setLevel(String level) {
            this.level = level;
        }
        
        public int getPercentage() {
            return percentage;
        }
        
        public void setPercentage(int percentage) {
            this.percentage = percentage;
        }
    }
    
    public static class AssessmentData {
        private int percentage;
        private String level;
        
        // Getter and Setter
        public int getPercentage() {
            return percentage;
        }
        
        public void setPercentage(int percentage) {
            this.percentage = percentage;
        }
        
        public String getLevel() {
            return level;
        }
        
        public void setLevel(String level) {
            this.level = level;
        }
    }
    
    // Getter and Setter methods
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
    
    public Map<String, StatusData> getStatuses() {
        return statuses;
    }
    
    public void setStatuses(Map<String, StatusData> statuses) {
        this.statuses = statuses;
    }
    
    public Map<String, AssessmentData> getAssessments() {
        return assessments;
    }
    
    public void setAssessments(Map<String, AssessmentData> assessments) {
        this.assessments = assessments;
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
}
