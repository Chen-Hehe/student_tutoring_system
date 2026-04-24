package com.tutoring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 配置
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // 启用路径匹配，确保 API 路由正确识别
        configurer.setUseTrailingSlashMatch(false);
        configurer.setUseRegisteredSuffixPatternMatch(true);
    }
}
