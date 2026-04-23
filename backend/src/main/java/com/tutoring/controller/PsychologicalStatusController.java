package com.tutoring.controller;

import com.tutoring.dto.Result;
import com.tutoring.entity.PsychologicalStatus;
import com.tutoring.service.PsychologicalStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/psychological")
public class PsychologicalStatusController {
    
    @Autowired
    private PsychologicalStatusService psychologicalStatusService;
    
    @GetMapping("/status/{studentId}")
    public Result<PsychologicalStatus> getLatestStatusByStudentId(@PathVariable Long studentId) {
        try {
            PsychologicalStatus status = psychologicalStatusService.getLatestStatusByStudentId(studentId);
            if (status == null) {
                return Result.error(404, "暂无心理状态数据");
            }
            return Result.success(status);
        } catch (Exception e) {
            return Result.error(500, "获取心理状态失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/status")
    public Result<PsychologicalStatus> createStatus(@RequestBody PsychologicalStatus status) {
        try {
            PsychologicalStatus created = psychologicalStatusService.createStatus(status);
            return Result.success(created);
        } catch (Exception e) {
            return Result.error(500, "创建心理状态失败: " + e.getMessage());
        }
    }
}
