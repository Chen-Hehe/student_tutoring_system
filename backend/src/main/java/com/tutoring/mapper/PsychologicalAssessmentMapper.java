package com.tutoring.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalAssessment;

public interface PsychologicalAssessmentMapper extends BaseMapper<PsychologicalAssessment> {
    
    List<PsychologicalAssessment> findByStudentId(Long studentId);
    
    List<PsychologicalAssessment> findByStudentIdAndType(@Param("studentId") Long studentId, @Param("assessType") String assessType);
    
    PsychologicalAssessment findLatestByStudentId(Long studentId);
}
