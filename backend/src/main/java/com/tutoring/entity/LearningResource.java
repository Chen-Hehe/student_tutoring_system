package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 学习资源实体类
 */
@Data
@TableName("learning_resources")
public class LearningResource {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String description;

    private String type;

    private String url;

    private Long uploaderId;

    private String category;

    private LocalDateTime createdAt;

    private Integer deleted;
}