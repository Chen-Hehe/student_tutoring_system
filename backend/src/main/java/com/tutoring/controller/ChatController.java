package com.tutoring.controller;

import com.tutoring.dto.ChatMessage;
import com.tutoring.dto.Conversation;
import com.tutoring.dto.Result;
import com.tutoring.entity.ChatRecord;
import com.tutoring.service.ChatRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 聊天控制器
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatRecordService chatRecordService;
    
    /**
     * 发送消息
     *
     * @param chatMessage 消息内容
     * @return 发送结果
     */
    @PostMapping("/send")
    public Result<ChatRecord> sendMessage(@Valid @RequestBody ChatMessage chatMessage) {
        try {
            ChatRecord record = chatRecordService.sendMessage(chatMessage);
            return Result.success("发送成功", record);
        } catch (Exception e) {
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
     * @param currentUserId 当前用户 ID
     * @return 对话列表
     */
    @GetMapping("/conversations")
    public Result<List<Conversation>> getConversations(@RequestHeader("X-User-Id") Long currentUserId) {
        try {
            List<Conversation> conversations = chatRecordService.getConversations(currentUserId);
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
