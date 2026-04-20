package com.tutoring.dto;

import com.tutoring.entity.GradeRecord;
import com.tutoring.entity.LearningProgress;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LearningReportDTO {
    private Long id;
    private String studentName;
    private String grade;
    private String subjects;
    private String reportPeriod;
    private String overall;
    private String rank;
    private Map<String, Integer> grades;
    private Map<String, Integer> progress;
    private String comment;

    public LearningReportDTO(Long id, String studentName, String grade, String reportPeriod, String overall, String rank, 
                           List<GradeRecord> gradeRecords, List<LearningProgress> progressRecords, String comment) {
        this.id = id;
        this.studentName = studentName;
        this.grade = grade;
        this.reportPeriod = reportPeriod;
        this.overall = overall;
        this.rank = rank;
        this.comment = comment;
        
        // 转换成绩记录为Map
        this.grades = gradeRecords.stream()
                .collect(Collectors.toMap(GradeRecord::getSubject, GradeRecord::getGrade));
        
        // 计算平均成绩
        if (!gradeRecords.isEmpty()) {
            int sum = gradeRecords.stream().mapToInt(GradeRecord::getGrade).sum();
            int average = sum / gradeRecords.size();
            this.grades.put("平均成绩", average);
        }
        
        // 转换学习进度为Map
        this.progress = progressRecords.stream()
                .collect(Collectors.toMap(LearningProgress::getSubject, LearningProgress::getProgress));
        
        // 生成学科列表
        this.subjects = gradeRecords.stream()
                .map(GradeRecord::getSubject)
                .collect(Collectors.joining("、"));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSubjects() {
        return subjects;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public String getReportPeriod() {
        return reportPeriod;
    }

    public void setReportPeriod(String reportPeriod) {
        this.reportPeriod = reportPeriod;
    }

    public String getOverall() {
        return overall;
    }

    public void setOverall(String overall) {
        this.overall = overall;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public Map<String, Integer> getGrades() {
        return grades;
    }

    public void setGrades(Map<String, Integer> grades) {
        this.grades = grades;
    }

    public Map<String, Integer> getProgress() {
        return progress;
    }

    public void setProgress(Map<String, Integer> progress) {
        this.progress = progress;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
