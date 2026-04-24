package com.tutoring.repository;

import com.tutoring.entity.Task;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends BaseMapper<Task> {
    List<Task> findByStudentId(Long studentId);
}