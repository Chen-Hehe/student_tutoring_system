package com.tutoring.config;

import com.tutoring.handler.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket 配置
 */
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 注册 WebSocket 处理器
        registry.addHandler(chatWebSocketHandler, "/ws-chat")
                .setAllowedOrigins("*"); // 允许所有跨域请求
        
        // 支持 SockJS 回退
        registry.addHandler(chatWebSocketHandler, "/ws-chat/sockjs")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
