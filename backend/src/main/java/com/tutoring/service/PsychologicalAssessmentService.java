package com.tutoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tutoring.entity.PsychologicalAssessment;
import com.tutoring.entity.PsychologicalAssessmentDetail;
import com.tutoring.mapper.PsychologicalAssessmentDetailMapper;
import com.tutoring.mapper.PsychologicalAssessmentMapper;

@Service
public class PsychologicalAssessmentService {
    
    @Autowired
    private PsychologicalAssessmentMapper psychologicalAssessmentMapper;
    
    @Autowired
    private PsychologicalAssessmentDetailMapper psychologicalAssessmentDetailMapper;
    
    public List<PsychologicalAssessment> getAssessmentsByStudentId(Long studentId) {
        return psychologicalAssessmentMapper.findByStudentId(studentId);
    }
    
    public List<PsychologicalAssessment> getAssessmentsByStudentIdAndType(Long studentId, String assessType) {
        return psychologicalAssessmentMapper.findByStudentIdAndType(studentId, assessType);
    }
    
    public PsychologicalAssessment getLatestAssessmentByStudentId(Long studentId) {
        return psychologicalAssessmentMapper.findLatestByStudentId(studentId);
    }
    
    public PsychologicalAssessment createAssessment(PsychologicalAssessment assessment) {
        assessment.setDeleted(0);
        assessment.setCreatedAt(new java.util.Date());
        psychologicalAssessmentMapper.insert(assessment);
        return assessment;
    }
    
    public PsychologicalAssessmentDetail createAssessmentDetail(PsychologicalAssessmentDetail detail) {
        detail.setDeleted(0);
        detail.setCreatedAt(new java.util.Date());
        detail.setUpdatedAt(new java.util.Date());
        psychologicalAssessmentDetailMapper.insert(detail);
        return detail;
    }
    
    public List<PsychologicalAssessmentDetail> getAssessmentDetails(Long assessmentId) {
        return psychologicalAssessmentDetailMapper.findByAssessmentId(assessmentId);
    }
}
