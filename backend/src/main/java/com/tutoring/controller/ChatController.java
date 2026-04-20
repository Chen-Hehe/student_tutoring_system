package com.tutoring.controller;

import com.tutoring.dto.ChatMessage;
import com.tutoring.dto.Conversation;
import com.tutoring.dto.Result;
import com.tutoring.entity.ChatRecord;
import com.tutoring.service.ChatRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 聊天控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatRecordService chatRecordService;
    
    /**
     * 发送消息（HTTP 接口 - 负责落库与触发推送）
     *
     * @param chatMessage 消息内容（必须包含：receiverId, message, type）
     * @return 发送结果（包含真实数据库 ID 和 timestamp）
     */
    @PostMapping("/send")
    public Result<ChatRecord> sendMessage(
            @Valid @RequestBody ChatMessage chatMessage,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        try {
            log.info("【DEBUG】ChatController 收到请求 - chatMessage.senderId={}, chatMessage.receiverId={}, Header.X-User-Id={}", 
                chatMessage.getSenderId(), chatMessage.getReceiverId(), currentUserId);
            
            // 从 Header 获取发送者 ID（如果未设置）
            if (chatMessage.getSenderId() == null && currentUserId != null) {
                log.info("【DEBUG】从 Header 设置 senderId={}", currentUserId);
                chatMessage.setSenderId(currentUserId);
            }
            
            log.info("【DEBUG】最终 senderId={}, receiverId={}", chatMessage.getSenderId(), chatMessage.getReceiverId());
            
            // 调用核心方法：保存并推送
            ChatRecord record = chatRecordService.saveAndPushMessage(chatMessage);
            return Result.success("发送成功", record);
        } catch (Exception e) {
            log.error("发送消息失败", e);
            return Result.error(500, "发送失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取与指定用户的聊天记录
     *
     * @param userId 目标用户 ID
     * @return 聊天记录列表
     */
    @GetMapping("/history/{userId}")
    public Result<List<ChatMessage>> getChatHistory(
            @PathVariable Long userId,
            @RequestHeader("X-User-Id") Long currentUserId) {
        try {
            List<ChatMessage> messages = chatRecordService.getChatHistory(currentUserId, userId);
            return Result.success(messages);
        } catch (Exception e) {
            return Result.error(500, "获取聊天记录失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取所有对话列表
     *
     * @param currentUserId 当前用户 ID（支持从 Header 或查询参数获取）
     * @return 对话列表
     */
    @GetMapping("/conversations")
    public Result<List<Conversation>> getConversations(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @RequestParam(value = "userId", required = false) Long userIdFromParam) {
        try {
            // 优先从 Header 获取，如果没有则从查询参数获取
            Long finalUserId = currentUserId != null ? currentUserId : userIdFromParam;
            if (finalUserId == null) {
                return Result.error(400, "缺少用户 ID 参数");
            }
            List<Conversation> conversations = chatRecordService.getConversations(finalUserId);
            return Result.success(conversations);
        } catch (Exception e) {
            return Result.error(500, "获取对话列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 标记消息为已读
     *
     * @param senderId 消息发送者 ID
     * @return 操作结果
     */
    @PostMapping("/read/{senderId}")
    public Result<Void> markAsRead(
            @PathVariable Long senderId,
            @RequestHeader("X-User-Id") Long currentUserId) {
        try {
            chatRecordService.markAsRead(currentUserId, senderId);
            return Result.success();
        } catch (Exception e) {
            return Result.error(500, "标记已读失败：" + e.getMessage());
        }
    }
}
