package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.Parent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParentRepository extends BaseMapper<Parent> {
    
    /**
     * 根据用户ID查询家长信息
     *
     * @param userId 用户ID
     * @return 家长信息
     */
    Parent findByUserId(@Param("userId") Long userId);
}
