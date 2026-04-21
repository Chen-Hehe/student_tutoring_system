package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.ChatRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatRecordRepository extends BaseMapper<ChatRecord> {
    
    /**
     * 查询聊天历史记录
     *
     * @param userId1 用户ID1
     * @param userId2 用户ID2
     * @return 聊天记录列表
     */
    List<ChatRecord> selectChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    /**
     * 查询会话伙伴列表
     *
     * @param userId 用户ID
     * @return 会话伙伴列表
     */
    List<Map<String, Object>> selectConversationPartners(@Param("userId") Long userId);
    
    /**
     * 查询最后一条消息的时间
     *
     * @param userId1 用户ID1
     * @param userId2 用户ID2
     * @return 最后一条消息的时间
     */
    String selectLastMessageTime(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
