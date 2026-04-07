package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Teacher;
import org.apache.ibatis.annotations.Mapper;

/**
 * 教师 Mapper
 */
@Mapper
public interface TeacherRepository extends BaseMapper<Teacher> {
}
