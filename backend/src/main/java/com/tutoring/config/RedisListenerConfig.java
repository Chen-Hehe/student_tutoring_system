package com.tutoring.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutoring.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 消息监听器配置
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisListenerConfig {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        
        // 使用自定义的消息处理器
        RedisMessageListenerContainer.MessageListener listener = (message, pattern) -> {
            String channel = new String(message.getChannel());
            String body = new String(message.getBody());
            log.info("【Redis 原始消息】channel={}, body={}", channel, body);
            
            // 调用 WebSocket handler 处理消息
            chatWebSocketHandler.onRedisMessage(message.getBody(), channel);
        };
        
        // 订阅所有 chat:user:* 频道
        container.addMessageListener(listener, new PatternTopic("chat:user:*"));
        
        log.info("【Redis 监听器】已订阅频道: chat:user:*");
        
        return container;
    }
}
