package com.tutoring.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.LearningProgress;

@Mapper
public interface LearningProgressRepository extends BaseMapper<LearningProgress> {
    
    @Select("SELECT * FROM learning_progress WHERE report_id = #{reportId} AND deleted = 0")
    List<LearningProgress> findByReportId(@Param("reportId") Long reportId);
}