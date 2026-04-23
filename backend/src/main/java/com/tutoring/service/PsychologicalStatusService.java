package com.tutoring.service;

import com.tutoring.entity.PsychologicalStatus;
import com.tutoring.mapper.PsychologicalStatusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PsychologicalStatusService {
    
    @Autowired
    private PsychologicalStatusMapper psychologicalStatusMapper;
    
    public PsychologicalStatus getLatestStatusByStudentId(Long studentId) {
        return psychologicalStatusMapper.findLatestByStudentId(studentId);
    }
    
    public PsychologicalStatus createStatus(PsychologicalStatus status) {
        status.setDeleted(0);
        status.setCreatedAt(new java.util.Date());
        status.setUpdatedAt(new java.util.Date());
        psychologicalStatusMapper.insert(status);
        return status;
    }
}
