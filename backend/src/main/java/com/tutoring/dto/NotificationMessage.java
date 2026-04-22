package com.tutoring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * WebSocket 通知消息 DTO
 * 用于推送匹配状态变更等实时通知
 */
@Data
public class NotificationMessage {
    
    /**
     * 通知类型
     * - MATCH_STATUS_UPDATE: 匹配状态更新
     * - MATCH_INVITATION: 收到匹配邀请
     * - MATCH_ACCEPTED: 匹配被接受
     * - MATCH_REJECTED: 匹配被拒绝
     */
    private String type;
    
    /**
     * 通知文本内容
     */
    private String message;
    
    /**
     * 匹配记录 ID
     */
    private Long matchId;
    
    /**
     * 匹配状态 (0:待确认，1:待家长确认，2:已匹配，3:已拒绝)
     */
    private Integer status;
    
    /**
     * 发起通知的用户 ID（可选）
     */
    private Long senderId;
    
    /**
     * 发起通知的用户姓名（可选）
     */
    private String senderName;
    
    /**
     * 时间戳
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime timestamp;
    
    /**
     * 额外数据（可选，如匹配详情）
     */
    private Object data;
    
    public NotificationMessage() {
        this.timestamp = LocalDateTime.now();
    }
    
    public NotificationMessage(String type, String message, Long matchId, Integer status) {
        this();
        this.type = type;
        this.message = message;
        this.matchId = matchId;
        this.status = status;
    }
}
