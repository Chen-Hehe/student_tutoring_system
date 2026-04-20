package com.tutoring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.TeacherCommunication;

import java.util.List;

/**
 * 教师沟通记录Mapper接口
 */
public interface TeacherCommunicationMapper extends BaseMapper<TeacherCommunication> {
    
    /**
     * 根据家长ID和教师ID查询沟通记录
     * @param parentId 家长ID
     * @param teacherId 教师ID
     * @return 沟通记录列表
     */
    List<TeacherCommunication> findByParentIdAndTeacherId(Long parentId, Long teacherId);
    
    /**
     * 根据家长ID查询所有沟通的教师ID列表
     * @param parentId 家长ID
     * @return 教师ID列表
     */
    List<Long> findTeacherIdsByParentId(Long parentId);
}
