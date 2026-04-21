package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository extends BaseMapper<User> {
}

