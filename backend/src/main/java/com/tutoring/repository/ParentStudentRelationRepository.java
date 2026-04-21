package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.ParentStudentRelation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ParentStudentRelationRepository extends BaseMapper<ParentStudentRelation> {
}
