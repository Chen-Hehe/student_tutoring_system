package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.GradeRecord;

import java.util.List;

public interface GradeRecordRepository extends BaseMapper<GradeRecord> {
    List<GradeRecord> findByReportId(Long reportId);
}
