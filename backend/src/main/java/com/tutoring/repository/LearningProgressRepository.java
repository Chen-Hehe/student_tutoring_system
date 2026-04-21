package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.LearningProgress;

import java.util.List;

public interface LearningProgressRepository extends BaseMapper<LearningProgress> {
    List<LearningProgress> findByReportId(Long reportId);
}
