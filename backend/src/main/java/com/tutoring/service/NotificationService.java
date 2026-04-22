package com.tutoring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutoring.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 通知服务
 * 通过 Redis Pub/Sub 推送 WebSocket 实时通知
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    
    /**
     * Redis 频道前缀
     */
    private static final String CHANNEL_PREFIX = "chat:user:";
    
    /**
     * 向指定用户推送通知
     *
     * @param userId 用户 ID
     * @param notification 通知消息
     */
    public void sendNotification(Long userId, NotificationMessage notification) {
        try {
            String channel = CHANNEL_PREFIX + userId;
            String jsonMessage = objectMapper.writeValueAsString(notification);
            
            log.info("【推送通知】用户={}, 类型={}, 消息={}", userId, notification.getType(), notification.getMessage());
            
            redisTemplate.convertAndSend(channel, jsonMessage);
            
            log.debug("【通知已发送】频道={}, 消息={}", channel, jsonMessage);
        } catch (Exception e) {
            log.error("【推送通知失败】用户={}, 类型={}", userId, notification.getType(), e);
        }
    }
    
    /**
     * 推送匹配状态更新通知
     *
     * @param userId 用户 ID
     * @param matchId 匹配 ID
     * @param status 新状态
     * @param message 通知文本
     */
    public void sendMatchStatusUpdate(Long userId, Long matchId, Integer status, String message) {
        NotificationMessage notification = new NotificationMessage(
            "MATCH_STATUS_UPDATE",
            message,
            matchId,
            status
        );
        sendNotification(userId, notification);
    }
    
    /**
     * 推送匹配邀请通知
     *
     * @param userId 用户 ID（接收邀请的用户）
     * @param matchId 匹配 ID
     * @param senderId 发送者 ID
     * @param senderName 发送者姓名
     * @param message 邀请消息
     */
    public void sendMatchInvitation(Long userId, Long matchId, Long senderId, String senderName, String message) {
        NotificationMessage notification = new NotificationMessage(
            "MATCH_INVITATION",
            message,
            matchId,
            0
        );
        notification.setSenderId(senderId);
        notification.setSenderName(senderName);
        sendNotification(userId, notification);
    }
}
