package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.AiMatch;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * AI 匹配推荐 Repository
 */
@Mapper
public interface AiMatchRepository extends BaseMapper<AiMatch> {
    
    /**
     * 根据教师 ID 查询 AI 推荐
     */
    @Select("SELECT * FROM ai_matches WHERE teacher_id = #{teacherId} AND deleted = 0 ORDER BY match_score DESC")
    List<AiMatch> selectByTeacherId(@Param("teacherId") Long teacherId);
    
    /**
     * 根据学生 ID 查询 AI 推荐
     */
    @Select("SELECT * FROM ai_matches WHERE student_id = #{studentId} AND deleted = 0 ORDER BY match_score DESC")
    List<AiMatch> selectByStudentId(@Param("studentId") Long studentId);
    
    /**
     * 检查是否存在匹配记录
     */
    @Select("SELECT COUNT(*) FROM ai_matches WHERE teacher_id = #{teacherId} AND student_id = #{studentId} AND deleted = 0")
    long exists(@Param("teacherId") Long teacherId, @Param("studentId") Long studentId);
}
