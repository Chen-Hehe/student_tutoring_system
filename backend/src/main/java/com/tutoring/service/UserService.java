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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> login(LoginRequest request) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
                .eq(User::getUsername, request.getUsername())
                .eq(User::getDeleted, 0);

        // 如果前端传了 role，就也一起校验（避免同名不同角色登录错账号）
        if (request.getRole() != null) {
            wrapper.eq(User::getRole, request.getRole());
        }

        User user = userRepository.selectOne(wrapper);
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", toUserInfo(user));
        return data;
    }

    @Transactional(rollbackFor = Exception.class)
    public UserInfo register(RegisterRequest request) {
        if (request.getRole() == null) {
            throw new RuntimeException("角色不能为空");
        }

        Long existing = userRepository.selectCount(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, request.getUsername()));
        if (existing != null && existing > 0) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setQq(request.getQq());
        user.setWechat(request.getWechat());
        user.setAvatar(null);
        user.setDeleted(0);
        user.setCreatedAt(LocalDateTime.now());

        int inserted = userRepository.insert(user);
        if (inserted <= 0) {
            throw new RuntimeException("注册失败");
        }
        return toUserInfo(user);
    }

    public UserInfo getUserById(Long userId) {
        User user = userRepository.selectById(userId);
        if (user == null || user.getDeleted() != null && user.getDeleted() != 0) {
            throw new RuntimeException("用户不存在");
        }
        return toUserInfo(user);
    }

    public List<UserInfo> listUsers(Integer role) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>().eq(User::getDeleted, 0);
        if (role != null) {
            wrapper.eq(User::getRole, role);
        }
        return userRepository.selectList(wrapper).stream().map(this::toUserInfo).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public UserInfo updateUser(Long userId, UserInfo userInfo) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (userInfo.getUsername() != null) user.setUsername(userInfo.getUsername());
        if (userInfo.getRole() != null) user.setRole(userInfo.getRole());
        if (userInfo.getName() != null) user.setName(userInfo.getName());
        if (userInfo.getEmail() != null) user.setEmail(userInfo.getEmail());
        if (userInfo.getPhone() != null) user.setPhone(userInfo.getPhone());
        if (userInfo.getGender() != null) user.setGender(userInfo.getGender());
        if (userInfo.getAvatar() != null) user.setAvatar(userInfo.getAvatar());
        if (userInfo.getQq() != null) user.setQq(userInfo.getQq());
        if (userInfo.getWechat() != null) user.setWechat(userInfo.getWechat());

        userRepository.updateById(user);
        return toUserInfo(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public void toggleUserStatus(Long userId, Boolean disabled) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 这里沿用旧逻辑：deleted=1 视为禁用
        user.setDeleted(Boolean.TRUE.equals(disabled) ? 1 : 0);
        userRepository.updateById(user);
    }

    private UserInfo toUserInfo(User user) {
        UserInfo info = new UserInfo();
        info.setId(user.getId());
        info.setUsername(user.getUsername());
        info.setRole(user.getRole());
        info.setRoleName(UserInfo.getRoleName(user.getRole()));
        info.setName(user.getName());
        info.setEmail(user.getEmail());
        info.setPhone(user.getPhone());
        info.setGender(user.getGender());
        info.setAvatar(user.getAvatar());
        info.setQq(user.getQq());
        info.setWechat(user.getWechat());
        info.setCreatedAt(user.getCreatedAt());
        return info;
    }
}

