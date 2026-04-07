package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.TeacherStudentMatch;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 师生匹配 Mapper
 */
@Mapper
public interface TeacherStudentMatchRepository extends BaseMapper<TeacherStudentMatch> {
    
    /**
     * 查询教师的匹配列表
     *
     * @param teacherId 教师 ID
     * @return 匹配列表
     */
    List<TeacherStudentMatch> selectByTeacherId(@Param("teacherId") Long teacherId);
    
    /**
     * 查询学生的匹配列表
     *
     * @param studentId 学生 ID
     * @return 匹配列表
     */
    List<TeacherStudentMatch> selectByStudentId(@Param("studentId") Long studentId);
    
    /**
     * 查询待处理的匹配（教师维度）
     *
     * @param teacherId 教师 ID
     * @return 匹配列表
     */
    List<TeacherStudentMatch> selectPendingByTeacherId(@Param("teacherId") Long teacherId);
    
    /**
     * 查询待处理的匹配（学生维度）
     *
     * @param studentId 学生 ID
     * @return 匹配列表
     */
    List<TeacherStudentMatch> selectPendingByStudentId(@Param("studentId") Long studentId);
}
