package com.tutoring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalAssessmentDetail;

import java.util.List;

/**
 * 心理状态评估详细数据Mapper接口
 */
public interface PsychologicalAssessmentDetailMapper extends BaseMapper<PsychologicalAssessmentDetail> {
    
    /**
     * 根据评估ID查询详细评估数据
     * @param assessmentId 评估ID
     * @return 详细评估数据列表
     */
    List<PsychologicalAssessmentDetail> findByAssessmentId(Long assessmentId);
}
