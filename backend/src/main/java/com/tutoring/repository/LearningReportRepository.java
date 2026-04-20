package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.LearningReport;

import java.util.List;

public interface LearningReportRepository extends BaseMapper<LearningReport> {
    List<LearningReport> findByStudentId(Long studentId);
}
