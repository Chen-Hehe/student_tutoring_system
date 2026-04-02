package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 学习资源表
 */
@Data
@TableName("learning_resources")
public class LearningResource {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 类型（文档/视频/音频）
     */
    private String type;
    
    /**
     * 资源链接
     */
    private String url;
    
    /**
     * 上传者 ID
     */
    private Long uploaderId;
    
    /**
     * 分类
     */
    private String category;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
}
