package com.tutoring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalAssessment;

import java.util.List;

/**
 * 心理状态评估Mapper接口
 */
public interface PsychologicalAssessmentMapper extends BaseMapper<PsychologicalAssessment> {
    
    /**
     * 根据学生ID查询最新的心理状态评估
     * @param studentId 学生ID
     * @return 心理状态评估对象
     */
    PsychologicalAssessment findLatestByStudentId(Long studentId);
}
