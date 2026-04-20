package com.tutoring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 聊天消息 DTO
 */
@Data
public class ChatMessage {
    
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
     * 消息类型 (1:文字，2:图片，3:语音)
     */
    private Integer type;
    
    /**
     * 心跳类型 (用于 WebSocket 心跳检测)
     */
    private String ping;
    
    /**
     * 文件 URL (图片或语音)
     */
    private String fileUrl;
    
    /**
     * 时间戳
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    /**
     * 消息 ID (用于已读回执等)
     */
    private Long messageId;
    
    /**
     * 发送者头像
     */
    private String senderAvatar;
    
    /**
     * 发送者姓名
     */
    private String senderName;
    
    /**
     * 已读状态
     */
    private Boolean isRead;
}
