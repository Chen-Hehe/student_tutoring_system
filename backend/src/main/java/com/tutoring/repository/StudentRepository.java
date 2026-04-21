package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Student;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentRepository extends BaseMapper<Student> {
}
