package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TaskRepository extends BaseMapper<Task> {
    
    @Select("SELECT * FROM tasks WHERE student_id = #{studentId}")
    List<Task> findByStudentId(@Param("studentId") Long studentId);
}