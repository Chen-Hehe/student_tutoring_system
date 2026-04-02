package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.ChatMessage;
import com.tutoring.dto.Conversation;
import com.tutoring.entity.ChatRecord;
import com.tutoring.entity.User;
import com.tutoring.repository.ChatRecordRepository;
import com.tutoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 聊天记录服务类
 */
@Service
@RequiredArgsConstructor
public class ChatRecordService {
    
    private final ChatRecordRepository chatRecordRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 发送消息
     *
     * @param chatMessage 消息内容
     * @return 保存后的聊天记录
     */
    @Transactional(rollbackFor = Exception.class)
    public ChatRecord sendMessage(ChatMessage chatMessage) {
        ChatRecord record = new ChatRecord();
        record.setSenderId(chatMessage.getSenderId());
        record.setReceiverId(chatMessage.getReceiverId());
        record.setMessage(chatMessage.getMessage());
        record.setType(chatMessage.getType());
        record.setFileUrl(chatMessage.getFileUrl());
        record.setIsRead(false);
        record.setSentAt(LocalDateTime.now());
        
        chatRecordRepository.insert(record);
        
        // 清除 Redis 缓存
        clearCache(chatMessage.getSenderId(), chatMessage.getReceiverId());
        
        return record;
    }
    
    /**
     * 获取与指定用户的聊天记录
     *
     * @param currentUserId 当前用户 ID
     * @param targetUserId  目标用户 ID
     * @return 聊天记录列表
     */
    public List<ChatMessage> getChatHistory(Long currentUserId, Long targetUserId) {
        String cacheKey = "chat:history:" + currentUserId + ":" + targetUserId;
        
        // 尝试从 Redis 缓存获取
        List<ChatMessage> cached = (List<ChatMessage>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        List<ChatRecord> records = chatRecordRepository.selectChatHistory(currentUserId, targetUserId);
        List<ChatMessage> messages = new ArrayList<>();
        
        for (ChatRecord record : records) {
            ChatMessage message = convertToChatMessage(record);
            messages.add(message);
        }
        
        // 缓存 5 分钟
        redisTemplate.opsForValue().set(cacheKey, messages, 5, TimeUnit.MINUTES);
        
        return messages;
    }
    
    /**
     * 获取所有对话列表
     *
     * @param userId 用户 ID
     * @return 对话列表
     */
    public List<Conversation> getConversations(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }
        
        List<Long> partnerIds = chatRecordRepository.selectConversationPartners(userId);
        if (partnerIds == null || partnerIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 去重
        List<Long> uniquePartnerIds = partnerIds.stream().distinct().toList();
        List<Conversation> conversations = new ArrayList<>();
        
        for (Long partnerId : uniquePartnerIds) {
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
            LocalDateTime lastTime = chatRecordRepository.selectLastMessageTime(userId, partnerId);
            if (lastTime != null) {
                conversation.setLastMessageTime(lastTime);
                
                // 计算未读消息数
                LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(ChatRecord::getSenderId, partnerId)
                       .eq(ChatRecord::getReceiverId, userId)
                       .eq(ChatRecord::getIsRead, false)
                       .eq(ChatRecord::getDeleted, 0);
                long unreadCount = chatRecordRepository.selectCount(wrapper);
                conversation.setUnreadCount((int) unreadCount);
                
                // 获取最后一条消息内容
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
     * 标记消息为已读
     *
     * @param currentUserId 当前用户 ID
     * @param senderId      消息发送者 ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void markAsRead(Long currentUserId, Long senderId) {
        LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatRecord::getSenderId, senderId)
               .eq(ChatRecord::getReceiverId, currentUserId)
               .eq(ChatRecord::getIsRead, false)
               .eq(ChatRecord::getDeleted, 0);
        
        List<ChatRecord> records = chatRecordRepository.selectList(wrapper);
        for (ChatRecord record : records) {
            record.setIsRead(true);
            chatRecordRepository.updateById(record);
        }
        
        clearCache(currentUserId, senderId);
    }
    
    /**
     * 将 ChatRecord 转换为 ChatMessage
     *
     * @param record 聊天记录
     * @return 消息 DTO
     */
    private ChatMessage convertToChatMessage(ChatRecord record) {
        ChatMessage message = new ChatMessage();
        message.setMessageId(record.getId());
        message.setSenderId(record.getSenderId());
        message.setReceiverId(record.getReceiverId());
        message.setMessage(record.getMessage());
        message.setType(record.getType());
        message.setFileUrl(record.getFileUrl());
        message.setTimestamp(record.getSentAt());
        message.setIsRead(record.getIsRead());
        
        // 获取发送者信息
        User sender = userRepository.selectById(record.getSenderId());
        if (sender != null) {
            message.setSenderName(sender.getName());
            message.setSenderAvatar(sender.getAvatar());
        }
        
        return message;
    }
    
    /**
     * 清除缓存
     *
     * @param userId1 用户 ID 1
     * @param userId2 用户 ID 2
     */
    private void clearCache(Long userId1, Long userId2) {
        String key1 = "chat:history:" + userId1 + ":" + userId2;
        String key2 = "chat:history:" + userId2 + ":" + userId1;
        redisTemplate.delete(key1);
        redisTemplate.delete(key2);
    }
}
