package com.tutoring.controller;

import com.tutoring.entity.LearningProgress;
import com.tutoring.repository.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-progress")
public class LearningProgressController {

    @Autowired
    private LearningProgressRepository learningProgressRepository;

    // 获取报告的学习进度记录
    @GetMapping("/report/{reportId}")
    public ResponseEntity<List<LearningProgress>> getLearningProgressByReportId(@PathVariable Long reportId) {
        List<LearningProgress> progressList = learningProgressRepository.findByReportId(reportId);
        return ResponseEntity.ok(progressList);
    }

    // 创建学习进度记录
    @PostMapping
    public ResponseEntity<LearningProgress> createLearningProgress(@RequestBody LearningProgress progress) {
        progress.setDeleted(0);
        learningProgressRepository.insert(progress);
        return ResponseEntity.status(HttpStatus.CREATED).body(progress);
    }

    // 更新学习进度记录
    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateLearningProgress(@PathVariable Long id, @RequestBody LearningProgress progress) {
        LearningProgress existingProgress = learningProgressRepository.selectById(id);
        if (existingProgress == null) {
            return ResponseEntity.notFound().build();
        }
        progress.setId(id);
        learningProgressRepository.updateById(progress);
        return ResponseEntity.ok(progress);
    }

    // 删除学习进度记录
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningProgress(@PathVariable Long id) {
        LearningProgress progress = learningProgressRepository.selectById(id);
        if (progress == null) {
            return ResponseEntity.notFound().build();
        }
        progress.setDeleted(1);
        learningProgressRepository.updateById(progress);
        return ResponseEntity.noContent().build();
    }
}