package com.tutoring.config;

import com.tutoring.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

/**
 * Redis 消息监听器配置
 */
@Configuration
@RequiredArgsConstructor
public class RedisListenerConfig {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        
        // 添加消息监听器
        MessageListenerAdapter listenerAdapter = new MessageListenerAdapter(
            chatWebSocketHandler, "onRedisMessage"
        );
        container.addMessageListener(listenerAdapter, new PatternTopic("chat:user:*"));
        
        return container;
    }
}
