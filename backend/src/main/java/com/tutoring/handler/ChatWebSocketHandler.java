package com.tutoring.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 聊天 WebSocket 处理器
 * 只处理心跳包，不处理业务消息发送
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {
    
    /**
     * 存储所有在线用户的 WebSocket Session
     * Key: 用户 ID, Value: WebSocketSession
     */
    private static final Map<Long, WebSocketSession> ONLINE_USERS = new ConcurrentHashMap<>();
    
    /**
     * JSON 对象映射器（使用 Spring 配置的 Bean）
     */
    private final ObjectMapper objectMapper;
    
    /**
     * Redis 频道前缀
     */
    private static final String REDIS_CHANNEL_PREFIX = "chat:user:";
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            ONLINE_USERS.put(userId, session);
            log.info("【WebSocket 建连】userId={}, sessionId={}, uri={}, onlineUsers={}",
                userId, session.getId(), session.getUri(), getOnlineUserSnapshot());
        } else {
            log.warn("【WebSocket 建连失败】无法从 session 中解析 userId, sessionId={}, uri={}", session.getId(), session.getUri());
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Long userId = getUserIdFromSession(session);
        if (userId == null) {
            log.warn("收到未认证用户的消息");
            return;
        }
        
        log.debug("=== WebSocket 收到用户 {} 的消息：{}", userId, message.getPayload());
        
        try {
            Map<String, Object> rawMessage = objectMapper.readValue(message.getPayload(), Map.class);
            
            if ("ping".equals(rawMessage.get("ping")) || "ping".equals(rawMessage.get("type"))) {
                log.debug("收到用户 {} 的心跳消息，回复 pong", userId);
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("type", "pong"))));
                return;
            }
            
            log.debug("收到非心跳消息，已忽略（消息发送请走 HTTP API）：{}", rawMessage);
            
        } catch (Exception e) {
            log.error("WebSocket 消息处理失败", e);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                Map.of("type", "error", "message", "消息处理失败：" + e.getMessage())
            )));
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            ONLINE_USERS.remove(userId);
            log.info("【WebSocket 断连】userId={}, sessionId={}, status={}, onlineUsers={}",
                userId, session.getId(), status, getOnlineUserSnapshot());
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        Long userId = getUserIdFromSession(session);
        log.error("【WebSocket 传输错误】userId={}, sessionId={}", userId, session != null ? session.getId() : null, exception);
    }
    
    /**
     * 从 Session 中获取用户 ID
     */
    private Long getUserIdFromSession(WebSocketSession session) {
        String userIdStr = session.getUri().getQuery();
        if (userIdStr != null && userIdStr.contains("userId=")) {
            String[] params = userIdStr.split("&");
            for (String param : params) {
                if (param.startsWith("userId=")) {
                    try {
                        return Long.parseLong(param.substring(7));
                    } catch (NumberFormatException e) {
                        log.error("解析用户 ID 失败", e);
                    }
                }
            }
        }
        
        Object userIdObj = session.getAttributes().get("userId");
        if (userIdObj != null) {
            return Long.parseLong(userIdObj.toString());
        }
        
        return null;
    }
    
    /**
     * 发送消息给指定用户（由服务层或 Redis 消息监听器调用）
     */
    public void sendToUser(Long userId, Object message) throws IOException {
        WebSocketSession session = ONLINE_USERS.get(userId);
        String payloadPreview;
        try {
            payloadPreview = objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            payloadPreview = String.valueOf(message);
        }

        log.info("【WebSocket 推送尝试】targetUserId={}, sessionExists={}, sessionOpen={}, onlineUsers={}, payload={}",
            userId,
            session != null,
            session != null && session.isOpen(),
            getOnlineUserSnapshot(),
            payloadPreview);

        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(payloadPreview));
            log.info("【WebSocket 推送成功】targetUserId={}, sessionId={}", userId, session.getId());
        } else {
            log.warn("【WebSocket 推送失败】targetUserId={}, 原因=session不存在或未打开, onlineUsers={}", userId, getOnlineUserSnapshot());
        }
    }
    
    /**
     * 从 Redis 接收消息并推送给在线用户（由 RedisListenerConfig 调用）
     * WebSocket 仅用于接收推送，不处理发送
     */
    public void onRedisMessage(byte[] messageBytes, String channel) {
        try {
            String message = new String(messageBytes);
            log.info("【Redis 收到消息】channel={}, message={}", channel, message);
            
            String channelId = channel.replace(REDIS_CHANNEL_PREFIX, "");
            Long userId = Long.parseLong(channelId);
            
            log.info("【Redis 转 WebSocket】channelUserId={}, onlineUsers={}", userId, getOnlineUserSnapshot());
            sendToUser(userId, message);
        } catch (Exception e) {
            log.error("处理 Redis 消息失败：channel={}, message={}", channel, messageBytes, e);
        }
    }
    
    /**
     * 发送已读状态更新给指定用户
     */
    public void sendReadStatus(Long userId, Long readerId) throws IOException {
        Map<String, Object> readStatus = Map.of(
            "type", "read",
            "readerId", readerId,
            "timestamp", System.currentTimeMillis()
        );
        log.info("【发送已读状态】userId={}, readerId={}", userId, readerId);
        sendToUser(userId, readStatus);
    }

    private Set<Long> getOnlineUserSnapshot() {
        return ONLINE_USERS.entrySet().stream()
            .filter(entry -> entry.getValue() != null && entry.getValue().isOpen())
            .map(Map.Entry::getKey)
            .collect(Collectors.toSet());
    }
}
