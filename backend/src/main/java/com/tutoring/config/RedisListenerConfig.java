package com.tutoring.config;

import com.tutoring.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * Redis 消息监听器配置
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisListenerConfig {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        
        // 创建消息监听器适配器
        MessageListenerAdapter listenerAdapter = new MessageListenerAdapter(chatWebSocketHandler, "onRedisMessage");
        
        // 设置序列化器（与 RedisTemplate 一致）
        listenerAdapter.setSerializer(redisTemplate.getValueSerializer());
        
        // 订阅所有 chat:user:* 频道
        container.addMessageListener(listenerAdapter, new PatternTopic("chat:user:*"));
        
        log.info("【Redis 监听器】已订阅频道: chat:user:*");
        
        return container;
    }
}
