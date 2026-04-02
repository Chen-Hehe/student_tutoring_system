package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.ChatRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 聊天记录数据访问层
 */
@Mapper
public interface ChatRecordRepository extends BaseMapper<ChatRecord> {
    
    /**
     * 获取两个用户之间的聊天记录
     *
     * @param userId1 用户 ID 1
     * @param userId2 用户 ID 2
     * @return 聊天记录列表
     */
    List<ChatRecord> selectChatHistory(
        @Param("userId1") Long userId1,
        @Param("userId2") Long userId2
    );
    
    /**
     * 获取用户的所有对话对象
     *
     * @param userId 用户 ID
     * @return 对话对象列表
     */
    List<Long> selectConversationPartners(@Param("userId") Long userId);
    
    /**
     * 获取用户最后一条消息的时间
     *
     * @param userId1 用户 ID 1
     * @param userId2 用户 ID 2
     * @return 最后一条消息时间
     */
    java.time.LocalDateTime selectLastMessageTime(
        @Param("userId1") Long userId1,
        @Param("userId2") Long userId2
    );
}
