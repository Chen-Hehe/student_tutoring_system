package com.tutoring.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tutoring.dto.ChatMessage;
import com.tutoring.entity.ChatRecord;
import com.tutoring.service.ChatRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
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
     * Redis 模板
     */
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 聊天服务
     */
    private final ChatRecordService chatRecordService;
    
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
            
            // 订阅该用户的 Redis 频道
            subscribeUserChannel(userId);
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Long userId = getUserIdFromSession(session);
        if (userId == null) {
            log.warn("收到未认证用户的消息");
            return;
        }
        
        log.info("=== WebSocket 收到用户 {} 的消息：{}", userId, message.getPayload());
        
        try {
            // 先尝试解析为 Map，检查是否是心跳消息
            Map<String, Object> rawMessage = objectMapper.readValue(message.getPayload(), Map.class);
            
            // 处理心跳消息（检查 "ping" 字段或 type="ping"）
            if ("ping".equals(rawMessage.get("ping")) || "ping".equals(rawMessage.get("type"))) {
                log.debug("收到用户 {} 的心跳消息", userId);
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("type", "pong"))));
                return;
            }
            
            // 解析为 ChatMessage 对象
            ChatMessage chatMessage = objectMapper.readValue(message.getPayload(), ChatMessage.class);
            log.debug("解析后的消息对象：receiverId={}, message={}, type={}", 
                chatMessage.getReceiverId(), chatMessage.getMessage(), chatMessage.getType());
            
            // 验证必填字段
            if (chatMessage.getReceiverId() == null) {
                throw new IllegalArgumentException("缺少 receiverId 参数");
            }
            if (chatMessage.getMessage() == null || chatMessage.getMessage().trim().isEmpty()) {
                throw new IllegalArgumentException("消息内容不能为空");
            }
            
            // 设置默认类型（如果未指定）
            if (chatMessage.getType() == null) {
                chatMessage.setType(1); // 默认为文字消息
            }
            
            chatMessage.setSenderId(userId);
            log.info("设置 senderId={}，准备保存到数据库", userId);
            
            // 保存消息到数据库
            ChatRecord savedRecord = chatRecordService.sendMessage(chatMessage);
            log.info("消息已保存到数据库，recordId={}", savedRecord.getId());
            
            // 通过 Redis 发布消息（支持多节点）
            publishMessage(chatMessage);
            
            // 直接发送给在线的接收者
            sendToUser(chatMessage.getReceiverId(), chatMessage);
            log.info("消息处理完成，已发送给接收者 {}", chatMessage.getReceiverId());
            
        } catch (IllegalArgumentException e) {
            log.error("消息参数错误", e);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                Map.of("type", "error", "message", "消息格式错误：" + e.getMessage())
            )));
        } catch (Exception e) {
            log.error("处理消息失败", e);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                Map.of("type", "error", "message", "消息发送失败：" + e.getMessage())
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
     * 发送消息给指定用户
     */
    public void sendToUser(Long userId, ChatMessage chatMessage) throws IOException {
        WebSocketSession session = ONLINE_USERS.get(userId);
        if (session != null && session.isOpen()) {
            String json = objectMapper.writeValueAsString(chatMessage);
            session.sendMessage(new TextMessage(json));
            log.debug("消息已发送给用户 {}", userId);
        } else {
            log.debug("用户 {} 不在线，消息将通过 Redis 推送", userId);
        }
    }
    
    /**
     * 通过 Redis 发布消息（支持多节点部署）
     */
    private void publishMessage(ChatMessage chatMessage) {
        String channel = REDIS_CHANNEL_PREFIX + chatMessage.getReceiverId();
        try {
            redisTemplate.convertAndSend(channel, objectMapper.writeValueAsString(chatMessage));
            log.debug("消息已发布到 Redis 频道：{}", channel);
        } catch (Exception e) {
            log.error("发布消息到 Redis 失败", e);
        }
    }
    
    /**
     * 订阅用户的 Redis 频道
     */
    private void subscribeUserChannel(Long userId) {
        // 注意：实际的 Redis 订阅需要在应用启动时由专门的监听器处理
        // 这里只是标记需要订阅
        log.debug("准备订阅用户 {} 的 Redis 频道", userId);
    }
    
    /**
     * 从 Redis 接收消息并推送给在线用户（由 Redis 消息监听器调用）
     */
    public void onRedisMessage(String channel, String message) {
        try {
            ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
            Long userId = chatMessage.getReceiverId();
            
            // 提取频道中的用户 ID
            String channelId = channel.replace(REDIS_CHANNEL_PREFIX, "");
            try {
                userId = Long.parseLong(channelId);
            } catch (NumberFormatException e) {
                log.error("解析频道用户 ID 失败：{}", channelId, e);
                return;
            }
            
            sendToUser(userId, chatMessage);
        } catch (Exception e) {
            log.error("处理 Redis 消息失败", e);
        }
    }
}
