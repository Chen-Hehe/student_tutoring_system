package com.tutoring.controller;

import com.tutoring.entity.LearningReport;
import com.tutoring.repository.LearningReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning-reports")
public class LearningReportController {

    @Autowired
    private LearningReportRepository learningReportRepository;

    // 获取学生的学习报告
    @GetMapping("/student/{studentId}")
    public ResponseEntity<LearningReport> getLearningReportByStudentId(@PathVariable Long studentId) {
        LearningReport report = learningReportRepository.findLatestByStudentId(studentId);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }

    // 创建学习报告
    @PostMapping
    public ResponseEntity<LearningReport> createLearningReport(@RequestBody LearningReport report) {
        report.setDeleted(0);
        learningReportRepository.insert(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    // 更新学习报告
    @PutMapping("/{id}")
    public ResponseEntity<LearningReport> updateLearningReport(@PathVariable Long id, @RequestBody LearningReport report) {
        LearningReport existingReport = learningReportRepository.selectById(id);
        if (existingReport == null) {
            return ResponseEntity.notFound().build();
        }
        report.setId(id);
        learningReportRepository.updateById(report);
        return ResponseEntity.ok(report);
    }

    // 删除学习报告
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningReport(@PathVariable Long id) {
        LearningReport report = learningReportRepository.selectById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        report.setDeleted(1);
        learningReportRepository.updateById(report);
        return ResponseEntity.noContent().build();
    }
}