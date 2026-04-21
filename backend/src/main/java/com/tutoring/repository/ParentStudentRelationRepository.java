package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.ParentStudentRelation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ParentStudentRelationRepository extends BaseMapper<ParentStudentRelation> {
    
    /**
     * 根据家长ID查询关联关系
     *
     * @param parentId 家长ID
     * @return 关联关系列表
     */
    List<ParentStudentRelation> findByParentId(@Param("parentId") Long parentId);
    
    /**
     * 根据家长ID和学生ID查询关联关系
     *
     * @param parentId 家长ID
     * @param studentId 学生ID
     * @return 关联关系
     */
    ParentStudentRelation findByParentIdAndStudentId(@Param("parentId") Long parentId, @Param("studentId") Long studentId);
    
    /**
     * 根据家长ID列表和状态查询关联关系
     *
     * @param parentIds 家长ID列表
     * @param status 状态
     * @return 关联关系列表
     */
    List<ParentStudentRelation> findByParentIdInAndStatus(@Param("parentIds") List<Long> parentIds, @Param("status") int status);
}
