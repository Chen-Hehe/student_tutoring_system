package com.tutoring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.PsychologicalStatus;

public interface PsychologicalStatusMapper extends BaseMapper<PsychologicalStatus> {
    
    PsychologicalStatus findLatestByStudentId(Long studentId);
}
