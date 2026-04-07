package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Student;
import org.apache.ibatis.annotations.Mapper;

/**
 * 学生 Mapper
 */
@Mapper
public interface StudentRepository extends BaseMapper<Student> {
}
