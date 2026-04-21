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
import java.util.concurrent.ConcurrentHashMap;

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
        // 从 URL 参数或 Session 属性中获取用户 ID
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            ONLINE_USERS.put(userId, session);
            log.info("用户 {} 已连接 WebSocket，当前在线人数：{}", userId, ONLINE_USERS.size());
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
            // 解析消息
            Map<String, Object> rawMessage = objectMapper.readValue(message.getPayload(), Map.class);
            
            // 只处理心跳消息（ping/pong）
            if ("ping".equals(rawMessage.get("ping")) || "ping".equals(rawMessage.get("type"))) {
                log.debug("收到用户 {} 的心跳消息，回复 pong", userId);
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("type", "pong"))));
                return;
            }
            
            // 不再处理业务聊天消息 - 所有消息发送必须走 HTTP REST API
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
            log.info("用户 {} 已断开 WebSocket 连接，当前在线人数：{}", userId, ONLINE_USERS.size());
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        Long userId = getUserIdFromSession(session);
        log.error("用户 {} WebSocket 传输错误", userId, exception);
    }
    
    /**
     * 从 Session 中获取用户 ID
     */
    private Long getUserIdFromSession(WebSocketSession session) {
        // 尝试从 URL 参数获取
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
        
        // 尝试从 Session 属性获取（通过拦截器设置）
        Object userIdObj = session.getAttributes().get("userId");
        if (userIdObj != null) {
            return Long.parseLong(userIdObj.toString());
        }
        
        return null;
    }
    
    /**
     * 发送消息给指定用户（由 Redis 消息监听器调用）
     */
    public void sendToUser(Long userId, Object message) throws IOException {
        WebSocketSession session = ONLINE_USERS.get(userId);
        if (session != null && session.isOpen()) {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
            log.debug("消息已推送给用户 {}", userId);
        } else {
            log.debug("用户 {} 不在线，无法推送", userId);
        }
    }
    
    /**
     * 订阅用户的 Redis 频道（由 RedisListenerConfig 处理）
     */
    private void subscribeUserChannel(Long userId) {
        log.debug("用户 {} 已连接，等待 Redis 消息推送", userId);
    }
    
    /**
     * 从 Redis 接收消息并推送给在线用户（由 RedisListenerConfig 调用）
     * WebSocket 仅用于接收推送，不处理发送
     */
    public void onRedisMessage(byte[] messageBytes, String channel) {
        try {
            String message = new String(messageBytes);
            log.info("【Redis 收到消息】channel={}, message={}", channel, message);
            
            // 提取频道中的用户 ID
            String channelId = channel.replace(REDIS_CHANNEL_PREFIX, "");
            Long userId = Long.parseLong(channelId);
            
            // 直接推送原始消息
            sendToUser(userId, message);
            log.info("【WebSocket 推送】已推送给用户 {}", userId);
        } catch (Exception e) {
            log.error("处理 Redis 消息失败：channel={}, message={}", channel, messageBytes, e);
        }
    }
}
