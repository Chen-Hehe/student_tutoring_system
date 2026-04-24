package com.tutoring.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.GradeRecord;

@Mapper
public interface GradeRecordRepository extends BaseMapper<GradeRecord> {
    
    @Select("SELECT * FROM grade_records WHERE report_id = #{reportId} AND deleted = 0")
    List<GradeRecord> findByReportId(@Param("reportId") Long reportId);
}