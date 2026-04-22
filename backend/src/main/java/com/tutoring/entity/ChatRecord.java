package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 聊天记录表
 */
@Data
@TableName("chat_records")
public class ChatRecord {
    
    /**
     * 主键 (雪花算法)
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 发送者 ID
     */
    private Long senderId;
    
    /**
     * 接收者 ID
     */
    private Long receiverId;
    
    /**
     * 消息内容
     */
    private String message;
    
    /**
     * 类型 (1:文字，2:图片，3:语音)
     */
    private Integer type;
    
    /**
     * 存储图片或语音的 OSS 链接
     */
    @TableField("file_url")
    private String fileUrl;
    
    /**
     * 发送时间
     */
    @TableField(value = "sent_at", fill = FieldFill.INSERT)
    private LocalDateTime sentAt;
    
    /**
     * 已读状态
     */
    @TableField("is_read")
    private Boolean isRead;
    
    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer deleted;
    
    /**
     * 消息撤回时间
     */
    @TableField("recalled_at")
    private LocalDateTime recalledAt;
    
    /**
     * 撤回者 ID
     */
    @TableField("recalled_by")
    private Long recalledBy;
}
