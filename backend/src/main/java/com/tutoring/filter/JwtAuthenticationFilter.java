package com.tutoring.filter;

import com.tutoring.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 认证过滤器
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // 获取 Token
        String token = resolveToken(request);
        
        // 验证 Token
        if (StringUtils.hasText(token)) {
            try {
                if (jwtUtil.validateToken(token)) {
                    // 从 Token 中获取用户信息
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    String username = jwtUtil.getUsernameFromToken(token);
                    Integer role = jwtUtil.getRoleFromToken(token);
                    
                    // 设置用户信息到请求属性，供控制器使用
                    request.setAttribute("X-User-Id", userId);
                    request.setAttribute("X-Username", username);
                    request.setAttribute("X-Role", role);
                    
                    // 设置 Spring Security 上下文
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            username, 
                            null, 
                            Collections.emptyList()
                        );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Throwable e) {
                // 忽略无效的token
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * 从请求中解析 Token
     *
     * @param request HTTP 请求
     * @return JWT Token
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        return null;
    }
}
