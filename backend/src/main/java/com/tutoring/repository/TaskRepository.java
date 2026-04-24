package com.tutoring.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Task;

@Mapper
public interface TaskRepository extends BaseMapper<Task> {
    
    @Select("SELECT * FROM tasks WHERE student_id = #{studentId}")
    List<Task> findByStudentId(@Param("studentId") Long studentId);
}