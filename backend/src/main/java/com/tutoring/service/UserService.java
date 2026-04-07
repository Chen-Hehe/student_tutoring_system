package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.LoginRequest;
import com.tutoring.dto.RegisterRequest;
import com.tutoring.dto.UserInfo;
import com.tutoring.entity.User;
import com.tutoring.repository.UserRepository;
import com.tutoring.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * 用户服务类
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * 用户登录
     *
     * @param request 登录请求
     * @return 用户信息和 Token
     */
    public Map<String, Object> login(LoginRequest request) {
        // 查询用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        wrapper.eq(User::getDeleted, 0);
        
        User user = userRepository.selectOne(wrapper);
        
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 验证角色（如果指定了角色）
        if (request.getRole() != null && !request.getRole().equals(user.getRole())) {
            throw new RuntimeException("角色不匹配");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 生成 Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        
        // 构建用户信息
        UserInfo userInfo = convertToUserInfo(user);
        
        return Map.of(
            "token", token,
            "user", userInfo
        );
    }
    
    /**
     * 用户注册
     *
     * @param request 注册请求
     * @return 用户信息
     */
    @Transactional(rollbackFor = Exception.class)
    public UserInfo register(RegisterRequest request) {
        // 检查用户名是否已存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        wrapper.eq(User::getDeleted, 0);
        
        User existingUser = userRepository.selectOne(wrapper);
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 验证角色合法性
        if (request.getRole() < 1 || request.getRole() > 4) {
            throw new RuntimeException("无效的角色");
        }
        
        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setQq(request.getQq());
        user.setWechat(request.getWechat());
        
        userRepository.insert(user);
        
        return convertToUserInfo(user);
    }
    
    /**
     * 根据 ID 获取用户信息
     *
     * @param userId 用户 ID
     * @return 用户信息
     */
    public UserInfo getUserById(Long userId) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return convertToUserInfo(user);
    }
    
    /**
     * 根据 Token 获取用户信息
     *
     * @param token JWT Token
     * @return 用户信息
     */
    public UserInfo getUserByToken(String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        return getUserById(userId);
    }
    
    /**
     * 将 User 实体转换为 UserInfo DTO
     *
     * @param user 用户实体
     * @return 用户信息 DTO
     */
    private UserInfo convertToUserInfo(User user) {
        UserInfo userInfo = new UserInfo();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setRole(user.getRole());
        userInfo.setRoleName(UserInfo.getRoleName(user.getRole()));
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setPhone(user.getPhone());
        userInfo.setGender(user.getGender());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setQq(user.getQq());
        userInfo.setWechat(user.getWechat());
        userInfo.setCreatedAt(user.getCreatedAt());
        return userInfo;
    }
    
    /**
     * 获取用户列表（带角色过滤）
     *
     * @param role 角色筛选（可选，1=教师，2=学生，3=家长，4=管理员）
     * @return 用户列表
     */
    public java.util.List<UserInfo> listUsers(Integer role) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getDeleted, 0);
        if (role != null) {
            wrapper.eq(User::getRole, role);
        }
        
        java.util.List<User> users = userRepository.selectList(wrapper);
        return users.stream()
                .map(this::convertToUserInfo)
                .toList();
    }
}
