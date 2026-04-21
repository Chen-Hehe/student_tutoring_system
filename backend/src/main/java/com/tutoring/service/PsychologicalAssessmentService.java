package com.tutoring.service;

import com.tutoring.entity.PsychologicalAssessment;
import com.tutoring.entity.PsychologicalAssessmentDetail;
import com.tutoring.mapper.PsychologicalAssessmentMapper;
import com.tutoring.mapper.PsychologicalAssessmentDetailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 心理状态评估服务类
 */
@Service
public class PsychologicalAssessmentService {
    
    @Autowired
    private PsychologicalAssessmentMapper psychologicalAssessmentMapper;
    
    @Autowired
    private PsychologicalAssessmentDetailMapper psychologicalAssessmentDetailMapper;
    
    /**
     * 根据学生ID获取最新的心理状态评估
     * @param studentId 学生ID
     * @return 心理状态评估对象
     */
    public PsychologicalAssessment getLatestByStudentId(Long studentId) {
        return psychologicalAssessmentMapper.findLatestByStudentId(studentId);
    }
    
    /**
     * 根据评估ID获取详细评估数据
     * @param assessmentId 评估ID
     * @return 详细评估数据列表
     */
    public List<PsychologicalAssessmentDetail> getDetailsByAssessmentId(Long assessmentId) {
        return psychologicalAssessmentDetailMapper.findByAssessmentId(assessmentId);
    }
}
