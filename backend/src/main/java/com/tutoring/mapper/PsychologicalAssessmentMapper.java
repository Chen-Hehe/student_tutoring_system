package com.tutoring.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalAssessment;

public interface PsychologicalAssessmentMapper extends BaseMapper<PsychologicalAssessment> {
    
    List<PsychologicalAssessment> findByStudentId(Long studentId);
    
    List<PsychologicalAssessment> findByStudentIdAndType(Long studentId, String assessType);
    
    PsychologicalAssessment findLatestByStudentId(Long studentId);
}
