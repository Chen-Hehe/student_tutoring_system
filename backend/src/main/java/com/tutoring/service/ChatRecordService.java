package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.ChatMessage;
import com.tutoring.dto.Conversation;
import com.tutoring.entity.ChatRecord;
import com.tutoring.entity.User;
import com.tutoring.handler.ChatWebSocketHandler;
import com.tutoring.repository.ChatRecordRepository;
import com.tutoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * 聊天记录服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRecordService {
    
    private static final String REDIS_CHANNEL_PREFIX = "chat:user:";
    
    private final ChatRecordRepository chatRecordRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChatWebSocketHandler chatWebSocketHandler;
    
    /**
     * 发送消息并推送给接收者（HTTP 接口使用）
     *
     * @param chatMessage 消息内容（包含 senderId, receiverId, message, type）
     * @return 保存后的聊天记录（包含真实 ID 和 timestamp）
     */
    @Transactional(rollbackFor = Exception.class)
    public ChatRecord saveAndPushMessage(ChatMessage chatMessage) {
        log.info("ChatRecordService.saveAndPushMessage - 开始保存并推送消息：senderId={}, receiverId={}, message={}",
            chatMessage.getSenderId(), chatMessage.getReceiverId(), chatMessage.getMessage());
        
        ChatRecord record = new ChatRecord();
        record.setSenderId(chatMessage.getSenderId());
        record.setReceiverId(chatMessage.getReceiverId());
        record.setMessage(chatMessage.getMessage());
        record.setType(chatMessage.getType());
        record.setFileUrl(chatMessage.getFileUrl());
        record.setIsRead(false);
        record.setSentAt(LocalDateTime.now());
        
        int insertResult = chatRecordRepository.insert(record);
        log.info("ChatRecordService.saveAndPushMessage - 数据库插入结果：affectedRows={}, recordId={}",
            insertResult, record.getId());
        
        if (insertResult == 0) {
            log.error("ChatRecordService.saveAndPushMessage - 数据库插入失败，影响行数为 0");
            throw new RuntimeException("消息保存失败");
        }
        
        clearCache(chatMessage.getSenderId(), chatMessage.getReceiverId());
        
        ChatMessage pushMessage = convertToChatMessage(record);
        log.info("【聊天推送准备】senderId={}, receiverId={}, recordId={}, pushMessage={}",
            pushMessage.getSenderId(), pushMessage.getReceiverId(), pushMessage.getMessageId(), pushMessage);
        
        try {
            chatWebSocketHandler.sendToUser(chatMessage.getReceiverId(), pushMessage);
            log.info("ChatRecordService.saveAndPushMessage - 已直接推送消息到 WebSocket，receiverId={}",
                chatMessage.getReceiverId());
        } catch (IOException e) {
            log.error("ChatRecordService.saveAndPushMessage - 直接 WebSocket 推送失败", e);
        }
        
        try {
            pushMessageToReceiver(chatMessage.getReceiverId(), pushMessage);
            log.info("ChatRecordService.saveAndPushMessage - 已推送消息到 Redis，receiverId={}",
                chatMessage.getReceiverId());
        } catch (Exception e) {
            log.error("ChatRecordService.saveAndPushMessage - 推送消息失败", e);
        }
        
        log.info("ChatRecordService.saveAndPushMessage - 消息保存并推送完成，recordId={}", record.getId());
        return record;
    }
    
    /**
     * 发送消息（旧方法，保留兼容性）
     */
    @Transactional(rollbackFor = Exception.class)
    public ChatRecord sendMessage(ChatMessage chatMessage) {
        return saveAndPushMessage(chatMessage);
    }
    
    /**
     * 通过 Redis 推送消息给接收者
     */
    private void pushMessageToReceiver(Long receiverId, ChatMessage message) {
        String channel = REDIS_CHANNEL_PREFIX + receiverId;
        log.info("【Redis 发布】channel={}, receiverId={}, messageId={}", channel, receiverId, message.getMessageId());
        redisTemplate.convertAndSend(channel, message);
    }
    
    /**
     * 获取与指定用户的聊天记录
     */
    public List<ChatMessage> getChatHistory(Long currentUserId, Long targetUserId) {
        log.info("ChatRecordService.getChatHistory - 获取聊天记录：currentUserId={}, targetUserId={}",
            currentUserId, targetUserId);
        
        String cacheKey = "chat:history:" + currentUserId + ":" + targetUserId;
        
        List<ChatMessage> cached = (List<ChatMessage>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.debug("从 Redis 缓存获取聊天记录，共 {} 条", cached.size());
            return cached;
        }
        
        List<ChatRecord> records = chatRecordRepository.selectChatHistory(currentUserId, targetUserId);
        log.info("从数据库获取聊天记录，共 {} 条", records.size());
        
        List<ChatMessage> messages = new ArrayList<>();
        for (ChatRecord record : records) {
            messages.add(convertToChatMessage(record));
        }
        
        redisTemplate.opsForValue().set(cacheKey, messages, 5, TimeUnit.MINUTES);
        log.info("聊天记录已缓存到 Redis，key={}", cacheKey);
        
        return messages;
    }
    
    /**
     * 获取所有对话列表
     */
    public List<Conversation> getConversations(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }
        
        // 获取会话伙伴列表
        List<Map<String, Object>> partnerMaps = chatRecordRepository.selectConversationPartners(userId);
        if (partnerMaps == null || partnerMaps.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 提取partnerId并去重
        List<Long> partnerIds = partnerMaps.stream()
                .map(map -> {
                    Object value = map.get("partner_id");
                    return value != null ? Long.parseLong(value.toString()) : null;
                })
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (partnerIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<Conversation> conversations = new ArrayList<>();
        
        for (Long partnerId : partnerIds) {
            if (partnerId == null) {
                continue;
            }
            
            User partner = userRepository.selectById(partnerId);
            if (partner == null || partner.getDeleted() == null || partner.getDeleted() != 0) {
                continue;
            }
            
            Conversation conversation = new Conversation();
            conversation.setUserId(partner.getId());
            conversation.setUserName(partner.getName());
            conversation.setUserAvatar(partner.getAvatar());
            conversation.setUserRole(partner.getRole());
            
            // 获取最后一条消息的时间
            String lastTimeStr = chatRecordRepository.selectLastMessageTime(userId, partnerId);
            LocalDateTime lastTime = null;
            if (lastTimeStr != null) {
                try {
                    lastTime = LocalDateTime.parse(lastTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                } catch (Exception e) {
                    log.error("解析时间失败: {}", lastTimeStr, e);
                }
            }
            if (lastTime != null) {
                conversation.setLastMessageTime(lastTime);
                
                LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(ChatRecord::getSenderId, partnerId)
                    .eq(ChatRecord::getReceiverId, userId)
                    .eq(ChatRecord::getIsRead, false)
                    .eq(ChatRecord::getDeleted, 0);
                long unreadCount = chatRecordRepository.selectCount(wrapper);
                conversation.setUnreadCount((int) unreadCount);
                
                LambdaQueryWrapper<ChatRecord> lastWrapper = new LambdaQueryWrapper<>();
                lastWrapper.eq(ChatRecord::getDeleted, 0)
                    .and(w -> w.eq(ChatRecord::getSenderId, userId)
                        .eq(ChatRecord::getReceiverId, partnerId)
                        .or()
                        .eq(ChatRecord::getSenderId, partnerId)
                        .eq(ChatRecord::getReceiverId, userId))
                    .orderByDesc(ChatRecord::getSentAt)
                    .last("LIMIT 1");
                ChatRecord lastRecord = chatRecordRepository.selectOne(lastWrapper);
                if (lastRecord != null) {
                    conversation.setLastMessage(lastRecord.getMessage());
                    conversation.setLastMessageType(lastRecord.getType());
                } else {
                    conversation.setUnreadCount(0);
                }
            } else {
                conversation.setUnreadCount(0);
            }
            
            conversations.add(conversation);
        }
        
        return conversations;
    }
    
    /**
     * 标记消息为已读，并推送已读状态给发送者
     */
    @Transactional(rollbackFor = Exception.class)
    public void markAsRead(Long currentUserId, Long senderId) {
        log.info("ChatRecordService.markAsRead - 标记已读：currentUserId={}, senderId={}", currentUserId, senderId);
        
        LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatRecord::getSenderId, senderId)
            .eq(ChatRecord::getReceiverId, currentUserId)
            .eq(ChatRecord::getIsRead, false)
            .eq(ChatRecord::getDeleted, 0);
        
        List<ChatRecord> records = chatRecordRepository.selectList(wrapper);
        if (records.isEmpty()) {
            log.debug("没有需要标记为已读的消息");
            return;
        }
        
        for (ChatRecord record : records) {
            record.setIsRead(true);
            chatRecordRepository.updateById(record);
        }
        
        log.info("ChatRecordService.markAsRead - 已标记 {} 条消息为已读", records.size());
        
        clearCache(currentUserId, senderId);
        
        // 推送已读状态给发送者
        pushReadStatusToSender(senderId, currentUserId, records.size());
    }
    
    /**
     * 推送已读状态给发送者
     */
    private void pushReadStatusToSender(Long senderId, Long readerId, int unreadCount) {
        try {
            Map<String, Object> readStatus = Map.of(
                "type", "read",
                "readerId", readerId,
                "senderId", senderId,
                "unreadCount", 0,
                "timestamp", System.currentTimeMillis()
            );
            
            log.info("【推送已读状态】senderId={}, readerId={}, unreadCount={}", senderId, readerId, unreadCount);
            chatWebSocketHandler.sendToUser(senderId, readStatus);
        } catch (IOException e) {
            log.error("推送已读状态失败", e);
        }
    }
        
        clearCache(currentUserId, senderId);
    }
    
    /**
     * 将 ChatRecord 转换为 ChatMessage
     */
    private ChatMessage convertToChatMessage(ChatRecord record) {
        ChatMessage message = new ChatMessage();
        message.setMessageId(record.getId());
        message.setSenderId(record.getSenderId());
        message.setReceiverId(record.getReceiverId());
        message.setMessage(record.getMessage());
        message.setType(record.getType());
        message.setFileUrl(record.getFileUrl());
        message.setIsRead(record.getIsRead());
        message.setTimestamp(record.getSentAt());
        return message;
    }
    
    /**
     * 清除缓存
     */
    private void clearCache(Long userId1, Long userId2) {
        String key1 = "chat:history:" + userId1 + ":" + userId2;
        String key2 = "chat:history:" + userId2 + ":" + userId1;
        redisTemplate.delete(key1);
        redisTemplate.delete(key2);
    }
}
