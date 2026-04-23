package com.tutoring.controller;

import com.tutoring.dto.Result;
import com.tutoring.entity.PsychologicalAssessment;
import com.tutoring.entity.PsychologicalAssessmentDetail;
import com.tutoring.service.PsychologicalAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/psychological")
public class PsychologicalAssessmentController {
    
    @Autowired
    private PsychologicalAssessmentService psychologicalAssessmentService;
    
    @GetMapping("/assessments/student/{studentId}")
    public Result<List<PsychologicalAssessment>> getAssessmentsByStudentId(@PathVariable Long studentId) {
        try {
            List<PsychologicalAssessment> assessments = psychologicalAssessmentService.getAssessmentsByStudentId(studentId);
            return Result.success(assessments);
        } catch (Exception e) {
            return Result.error(500, "获取评估列表失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/assessments/student/{studentId}/type/{assessType}")
    public Result<List<PsychologicalAssessment>> getAssessmentsByStudentIdAndType(
            @PathVariable Long studentId, @PathVariable String assessType) {
        try {
            List<PsychologicalAssessment> assessments = psychologicalAssessmentService.getAssessmentsByStudentIdAndType(studentId, assessType);
            return Result.success(assessments);
        } catch (Exception e) {
            return Result.error(500, "获取评估列表失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/assessments/latest/{studentId}")
    public Result<PsychologicalAssessment> getLatestAssessmentByStudentId(@PathVariable Long studentId) {
        try {
            PsychologicalAssessment assessment = psychologicalAssessmentService.getLatestAssessmentByStudentId(studentId);
            if (assessment == null) {
                return Result.error(404, "暂无评估数据");
            }
            return Result.success(assessment);
        } catch (Exception e) {
            return Result.error(500, "获取评估数据失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/assessments")
    public Result<PsychologicalAssessment> createAssessment(@RequestBody PsychologicalAssessment assessment) {
        try {
            PsychologicalAssessment created = psychologicalAssessmentService.createAssessment(assessment);
            return Result.success(created);
        } catch (Exception e) {
            return Result.error(500, "创建评估失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/assessment-details")
    public Result<PsychologicalAssessmentDetail> createAssessmentDetail(@RequestBody PsychologicalAssessmentDetail detail) {
        try {
            PsychologicalAssessmentDetail created = psychologicalAssessmentService.createAssessmentDetail(detail);
            return Result.success(created);
        } catch (Exception e) {
            return Result.error(500, "创建评估详情失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/assessment-details/{assessmentId}")
    public Result<List<PsychologicalAssessmentDetail>> getAssessmentDetails(@PathVariable Long assessmentId) {
        try {
            List<PsychologicalAssessmentDetail> details = psychologicalAssessmentService.getAssessmentDetails(assessmentId);
            return Result.success(details);
        } catch (Exception e) {
            return Result.error(500, "获取评估详情失败: " + e.getMessage());
        }
    }
}
