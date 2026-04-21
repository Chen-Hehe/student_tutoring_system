package com.tutoring.service;

import com.tutoring.entity.TeacherCommunication;
import com.tutoring.mapper.TeacherCommunicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 教师沟通服务类
 */
@Service
public class TeacherCommunicationService {
    
    @Autowired
    private TeacherCommunicationMapper teacherCommunicationMapper;
    
    /**
     * 根据家长ID和教师ID查询沟通记录
     * @param parentId 家长ID
     * @param teacherId 教师ID
     * @return 沟通记录列表
     */
    public List<TeacherCommunication> getCommunicationsByParentAndTeacher(Long parentId, Long teacherId) {
        Map<String, Object> params = new java.util.HashMap<>();
        params.put("parentId", parentId);
        params.put("teacherId", teacherId);
        return teacherCommunicationMapper.findByParentIdAndTeacherId(parentId, teacherId);
    }
    
    /**
     * 根据家长ID查询所有沟通的教师ID列表
     * @param parentId 家长ID
     * @return 教师ID列表
     */
    public List<Long> getTeacherIdsByParentId(Long parentId) {
        return teacherCommunicationMapper.findTeacherIdsByParentId(parentId);
    }
    
    /**
     * 保存新的沟通记录
     * @param communication 沟通记录对象
     * @return 保存结果
     */
    public boolean saveCommunication(TeacherCommunication communication) {
        return teacherCommunicationMapper.insert(communication) > 0;
    }
}
