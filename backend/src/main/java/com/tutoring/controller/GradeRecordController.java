package com.tutoring.controller;

import com.tutoring.entity.GradeRecord;
import com.tutoring.repository.GradeRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grade-records")
public class GradeRecordController {

    @Autowired
    private GradeRecordRepository gradeRecordRepository;

    // 获取报告的成绩记录
    @GetMapping("/report/{reportId}")
    public ResponseEntity<List<GradeRecord>> getGradeRecordsByReportId(@PathVariable Long reportId) {
        List<GradeRecord> records = gradeRecordRepository.findByReportId(reportId);
        return ResponseEntity.ok(records);
    }

    // 创建成绩记录
    @PostMapping
    public ResponseEntity<GradeRecord> createGradeRecord(@RequestBody GradeRecord record) {
        record.setDeleted(0);
        gradeRecordRepository.insert(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }

    // 更新成绩记录
    @PutMapping("/{id}")
    public ResponseEntity<GradeRecord> updateGradeRecord(@PathVariable Long id, @RequestBody GradeRecord record) {
        GradeRecord existingRecord = gradeRecordRepository.selectById(id);
        if (existingRecord == null) {
            return ResponseEntity.notFound().build();
        }
        record.setId(id);
        gradeRecordRepository.updateById(record);
        return ResponseEntity.ok(record);
    }

    // 删除成绩记录
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradeRecord(@PathVariable Long id) {
        GradeRecord record = gradeRecordRepository.selectById(id);
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        record.setDeleted(1);
        gradeRecordRepository.updateById(record);
        return ResponseEntity.noContent().build();
    }
}