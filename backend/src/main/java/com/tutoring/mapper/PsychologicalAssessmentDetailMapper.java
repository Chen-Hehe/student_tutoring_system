package com.tutoring.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalAssessmentDetail;

public interface PsychologicalAssessmentDetailMapper extends BaseMapper<PsychologicalAssessmentDetail> {
    
    List<PsychologicalAssessmentDetail> findByAssessmentId(Long assessmentId);
}
