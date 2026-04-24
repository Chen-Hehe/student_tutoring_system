package com.tutoring.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.LearningReport;

@Mapper
public interface LearningReportRepository extends BaseMapper<LearningReport> {
    
    @Select("SELECT * FROM learning_reports WHERE student_id = #{studentId} AND deleted = 0 ORDER BY created_at DESC LIMIT 1")
    LearningReport findLatestByStudentId(@Param("studentId") Long studentId);
    
    @Select("SELECT * FROM learning_reports WHERE student_id = #{studentId} AND deleted = 0 ORDER BY created_at DESC")
    List<LearningReport> findByStudentId(@Param("studentId") Long studentId);
}