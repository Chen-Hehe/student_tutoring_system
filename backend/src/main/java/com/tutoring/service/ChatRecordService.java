package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
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
     * 将 ChatRecord 转换为 ChatMessage（公开方法供 Controller 使用）
     */
    public ChatMessage convertToChatMessagePublic(ChatRecord record) {
        return convertToChatMessage(record);
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
     * 标记消息为已读
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
        
        // 推送已读状态给发送者（实时同步关键）
        // 注意：即使没有未读消息，也要推送（可能是重复标记或实时同步）
        ChatMessage readNotification = new ChatMessage();
        readNotification.setType(0); // 0 表示已读通知
        readNotification.setReaderId(currentUserId); // 已读者 ID
        readNotification.setSenderId(senderId); // 原消息发送者 ID
        readNotification.setReceiverId(senderId);
        
        log.info("ChatRecordService.markAsRead - 准备推送已读状态：readerId={}, senderId={}, 更新消息数={}",
            currentUserId, senderId, records.size());
        
        // 1. 直接 WebSocket 推送
        try {
            chatWebSocketHandler.sendToUser(senderId, readNotification);
            log.info("ChatRecordService.markAsRead - WebSocket 推送成功给 senderId={}", senderId);
        } catch (IOException e) {
            log.warn("ChatRecordService.markAsRead - WebSocket 推送失败（用户可能不在线）", e);
        }
        
        // 2. Redis 推送（备用通道）
        try {
            pushMessageToReceiver(senderId, readNotification);
            log.info("ChatRecordService.markAsRead - Redis 推送成功");
        } catch (Exception e) {
            log.error("ChatRecordService.markAsRead - Redis 推送失败", e);
        }
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
        // 撤回相关字段
        message.setIsRecalled(record.getRecalledAt() != null);
        message.setRecalledAt(record.getRecalledAt());
        message.setRecalledBy(record.getRecalledBy());
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
    
    /**
     * 撤回消息
     *
     * @param messageId 消息 ID
     * @param operatorId 操作者 ID（必须是发送者）
     * @return 撤回后的聊天记录
     */
    @Transactional(rollbackFor = Exception.class)
    public ChatRecord recallMessage(Long messageId, Long operatorId) {
        log.info("ChatRecordService.recallMessage - 开始撤回消息：messageId={}, operatorId={}",
            messageId, operatorId);
        
        // 查询消息（使用 LambdaQueryWrapper 忽略逻辑删除，因为 @TableLogic 会过滤掉 deleted!=0 的记录）
        LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatRecord::getId, messageId);
        // 注意：@TableLogic 会自动添加 deleted=0 条件，这是期望行为
        // 如果消息被逻辑删除了，说明它不应该被撤回
        ChatRecord record = chatRecordRepository.selectOne(wrapper);
        
        log.info("ChatRecordService.recallMessage - 查询结果：record={}, senderId={}, recalledAt={}, deleted={}",
            record != null ? "存在" : "不存在",
            record != null ? record.getSenderId() : "N/A",
            record != null ? record.getRecalledAt() : "N/A",
            record != null ? record.getDeleted() : "N/A");
        
        if (record == null) {
            log.error("ChatRecordService.recallMessage - 消息不存在：messageId={}", messageId);
            throw new IllegalArgumentException("消息不存在");
        }
        
        // 检查是否是发送者本人
        if (!record.getSenderId().equals(operatorId)) {
            log.error("ChatRecordService.recallMessage - 权限不足：record.senderId={}, operatorId={}",
                record.getSenderId(), operatorId);
            throw new IllegalArgumentException("只有消息发送者才能撤回消息");
        }
        
        // 检查是否已经撤回
        if (record.getRecalledAt() != null) {
            log.warn("ChatRecordService.recallMessage - 消息已被撤回：messageId={}, recalledAt={}",
                messageId, record.getRecalledAt());
            throw new IllegalArgumentException("消息已被撤回");
        }
        
        // 检查是否可以撤回（2 分钟内）
        if (!canRecall(record)) {
            log.error("ChatRecordService.recallMessage - 超过撤回时限：sentAt={}", record.getSentAt());
            throw new IllegalArgumentException("超过撤回时限（2 分钟）");
        }
        
        // 设置撤回信息
        LocalDateTime now = LocalDateTime.now();
        record.setRecalledAt(now);
        record.setRecalledBy(operatorId);
        
        log.info("ChatRecordService.recallMessage - 准备更新数据库：recalledAt={}, recalledBy={}",
            now, operatorId);
        
        // 使用 UpdateWrapper 强制更新指定字段（避免 updateById 只更新非 null 字段的问题）
        UpdateWrapper<ChatRecord> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", messageId)
               .set("recalled_at", now)
               .set("recalled_by", operatorId);
        
        int updateResult = chatRecordRepository.update(null, updateWrapper);
        log.info("ChatRecordService.recallMessage - 更新结果：affectedRows={}", updateResult);
        
        if (updateResult == 0) {
            log.error("ChatRecordService.recallMessage - 更新失败，影响行数为 0");
            throw new RuntimeException("撤回失败");
        }
        
        // 重新查询以获取最新数据（确保后续操作使用更新后的记录）
        record.setRecalledAt(now);
        record.setRecalledBy(operatorId);
        
        // 清除缓存
        clearCache(record.getSenderId(), record.getReceiverId());
        
        // 构建撤回通知消息
        ChatMessage recallNotification = new ChatMessage();
        recallNotification.setMessageId(messageId);
        recallNotification.setType(100); // 100 表示撤回通知
        recallNotification.setSenderId(operatorId);
        recallNotification.setReceiverId(record.getReceiverId());
        recallNotification.setTimestamp(LocalDateTime.now());
        recallNotification.setRecalledAt(record.getRecalledAt());
        recallNotification.setRecalledBy(operatorId);
        recallNotification.setIsRecalled(true); // 明确设置已撤回标志
        
        // 推送撤回通知给接收者
        try {
            chatWebSocketHandler.sendToUser(record.getReceiverId(), recallNotification);
            log.info("ChatRecordService.recallMessage - 已推送撤回通知给 receiverId={}",
                record.getReceiverId());
        } catch (IOException e) {
            log.error("ChatRecordService.recallMessage - 推送撤回通知失败", e);
        }
        
        // 通过 Redis 推送
        try {
            pushMessageToReceiver(record.getReceiverId(), recallNotification);
            log.info("ChatRecordService.recallMessage - 已通过 Redis 推送撤回通知");
        } catch (Exception e) {
            log.error("ChatRecordService.recallMessage - Redis 推送失败", e);
        }
        
        log.info("ChatRecordService.recallMessage - 消息撤回成功，messageId={}", messageId);
        return record;
    }
    
    /**
     * 检查是否可以撤回消息（2 分钟内）
     *
     * @param record 聊天记录
     * @return 是否可以撤回
     */
    public boolean canRecall(ChatRecord record) {
        if (record == null || record.getSentAt() == null) {
            return false;
        }
        if (record.getRecalledAt() != null) {
            return false; // 已经撤回
        }
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(record.getSentAt(), now).toMinutes();
        return minutes <= 2; // 2 分钟内可以撤回
    }
    
    /**
     * 检查消息是否可以撤回（通过消息 ID）
     *
     * @param messageId 消息 ID
     * @return 是否可以撤回
     */
    public boolean canRecallById(Long messageId) {
        ChatRecord record = chatRecordRepository.selectById(messageId);
        return canRecall(record);
    }
    
    /**
     * 获取消息记录（忽略逻辑删除）
     *
     * @param messageId 消息 ID
     * @return 聊天记录
     */
    public ChatRecord getMessageByIdIgnoreDeleted(Long messageId) {
        // 使用原始 SQL 查询，忽略 @TableLogic 的逻辑删除条件
        LambdaQueryWrapper<ChatRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatRecord::getId, messageId);
        return chatRecordRepository.selectOne(wrapper);
    }
    
    /**
     * 获取消息记录（正常查询，受逻辑删除影响）
     *
     * @param messageId 消息 ID
     * @return 聊天记录
     */
    public ChatRecord getMessageById(Long messageId) {
        return chatRecordRepository.selectById(messageId);
    }
}
