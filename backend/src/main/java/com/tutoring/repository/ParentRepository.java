package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Parent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ParentRepository extends BaseMapper<Parent> {
}
