package com.tutoring.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * 学习资料实体类
 */
@Data
@TableName("learning_materials")
public class LearningMaterial {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String description;

    private String subject;

    private String grade;

    private String type;

    private String url;

    private Long uploaderId;

    private Integer viewCount;

    private Integer downloadCount;

    private String tags;

    private LocalDateTime createdAt;

    private Integer deleted;
}