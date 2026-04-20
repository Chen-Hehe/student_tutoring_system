package com.tutoring.config;

import com.tutoring.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 消息监听器配置
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisListenerConfig {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            RedisTemplate<String, Object> redisTemplate) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        
        // 创建消息监听器适配器，指定处理方法
        MessageListenerAdapter listenerAdapter = new MessageListenerAdapter();
        listenerAdapter.setDelegate(chatWebSocketHandler);
        listenerAdapter.setDefaultListenerMethod("onRedisMessage");
        
        // 订阅所有 chat:user:* 频道
        container.addMessageListener(listenerAdapter, new PatternTopic(\"chat:user:*\"));
        
        log.info(\"【Redis 监听器】已订阅频道: chat:user:*\");
        
        // 测试 Redis 连接
        try {\n            redisTemplate.convertAndSend(\"chat:test\", \"test message\");\n            log.info(\"【Redis 测试】发送测试消息成功\");\n        } catch (Exception e) {\n            log.error(\"【Redis 测试】发送测试消息失败\", e);\n        }\n        \n        return container;\n    }\n}\n