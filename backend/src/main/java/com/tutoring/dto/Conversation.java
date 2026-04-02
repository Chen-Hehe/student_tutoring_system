package com.tutoring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 对话列表 DTO
 */
@Data
public class Conversation {
    
    /**
     * 对话对象 ID
     */
    private Long userId;
    
    /**
     * 对话对象姓名
     */
    private String userName;
    
    /**
     * 对话对象头像
     */
    private String userAvatar;
    
    /**
     * 对话对象角色
     */
    private Integer userRole;
    
    /**
     * 最后一条消息内容
     */
    private String lastMessage;
    
    /**
     * 最后一条消息类型
     */
    private Integer lastMessageType;
    
    /**
     * 最后一条消息时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastMessageTime;
    
    /**
     * 未读消息数
     */
    private Integer unreadCount;
}
