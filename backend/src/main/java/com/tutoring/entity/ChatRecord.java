package com.tutoring.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("chat_records")
public class ChatRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("sender_id")
    private Long senderId;

    @TableField("receiver_id")
    private Long receiverId;

    private String message;

    /**
     * 消息类型 (1:文字，2:图片，3:语音)
     */
    private Integer type;

    @TableField("file_url")
    private String fileUrl;

    @TableField("is_read")
    private Boolean isRead;

    @TableField("sent_at")
    private LocalDateTime sentAt;

    private Integer deleted;
}

