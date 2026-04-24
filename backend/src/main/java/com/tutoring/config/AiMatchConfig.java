package com.tutoring.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * AI 匹配配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai.match")
public class AiMatchConfig {
    
    /**
     * 通义千问 API Key
     */
    private String apiKey;
    
    /**
     * 模型名称
     */
    private String model = "qwen-plus";
    
    /**
     * 请求超时时间 (秒)
     */
    private Integer timeout = 30;
    
    /**
     * 最大重试次数
     */
    private Integer maxRetries = 3;
    
    /**
     * 是否启用 AI 匹配
     */
    private Boolean enabled = true;
    
    /**
     * 混合匹配权重 - AI 评分占比 (0-1)
     * 规则匹配权重 = 1 - aiWeight
     */
    private Double aiWeight = 0.6;
    
    /**
     * 最低推荐分数阈值
     */
    private Double minScore = 60.0;
    
    /**
     * 每日最大调用次数
     */
    private Integer dailyLimit = 1000;
}
