package com.tutoring.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tutoring.entity.ChatRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatRecordRepository extends BaseMapper<ChatRecord> {

    @Select("""
        SELECT *
        FROM chat_records
        WHERE deleted = 0
          AND (
            (sender_id = #{userId1} AND receiver_id = #{userId2})
            OR
            (sender_id = #{userId2} AND receiver_id = #{userId1})
          )
        ORDER BY sent_at ASC
        """)
    List<ChatRecord> selectChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Select("""
        SELECT
          CASE WHEN sender_id = #{userId} THEN receiver_id ELSE sender_id END AS partner_id
        FROM chat_records
        WHERE deleted = 0
          AND (sender_id = #{userId} OR receiver_id = #{userId})
        """)
    List<Map<String, Object>> selectConversationPartners(@Param("userId") Long userId);

    @Select("""
        SELECT DATE_FORMAT(MAX(sent_at), '%Y-%m-%d %H:%i:%s')
        FROM chat_records
        WHERE deleted = 0
          AND (
            (sender_id = #{userId} AND receiver_id = #{partnerId})
            OR
            (sender_id = #{partnerId} AND receiver_id = #{userId})
          )
        """)
    String selectLastMessageTime(@Param("userId") Long userId, @Param("partnerId") Long partnerId);
}

