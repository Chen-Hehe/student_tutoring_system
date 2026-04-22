package com.tutoring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.dto.Result;
import com.tutoring.entity.Announcement;
import com.tutoring.entity.LearningMaterial;
import com.tutoring.entity.LearningResource;
import com.tutoring.entity.User;
import com.tutoring.repository.AnnouncementRepository;
import com.tutoring.repository.LearningMaterialRepository;
import com.tutoring.repository.LearningResourceRepository;
import com.tutoring.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LearningResourceRepository learningResourceRepository;
    
    @Autowired
    private LearningMaterialRepository learningMaterialRepository;
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getStatistics() {
        try {
            System.out.println("获取统计数据...");
            System.out.println("userRepository: " + userRepository);
            long teacherCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 1).eq(User::getDeleted, 0));
            System.out.println("教师数量: " + teacherCount);
            long studentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 2).eq(User::getDeleted, 0));
            System.out.println("学生数量: " + studentCount);
            long parentCount = userRepository.selectCount(new LambdaQueryWrapper<User>().eq(User::getRole, 3).eq(User::getDeleted, 0));
            System.out.println("家长数量: " + parentCount);
            long chatCount = 0;
            
            Map<String, Object> data = new HashMap<>();
            data.put("teacherCount", teacherCount);
            data.put("studentCount", studentCount);
            data.put("parentCount", parentCount);
            data.put("chatCount", chatCount);
            
            System.out.println("统计数据: " + data);
            return Result.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取统计失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/users")
    public Result<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String role) {
        try {
            int offset = (page - 1) * size;
            
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getDeleted, 0);
            
            if (role != null && !role.isEmpty()) {
                Integer roleNum = convertRoleToNumber(role);
                if (roleNum != null) {
                    wrapper.eq(User::getRole, roleNum);
                }
            }
            
            long total = userRepository.selectCount(wrapper);
            
            wrapper.orderByDesc(User::getCreatedAt);
            wrapper.last("LIMIT " + offset + ", " + size);
            List<User> users = userRepository.selectList(wrapper);
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("name", user.getName());
                userInfo.put("role", getRoleName(user.getRole()));
                userInfo.put("status", user.getDeleted() == 0 ? "活跃" : "禁用");
                return userInfo;
            }).collect(Collectors.toList());
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", userList);
            data.put("total", total);
            data.put("page", page);
            data.put("size", size);
            
            return Result.success(data);
        } catch (Exception e) {
            return Result.error(500, "获取用户列表失败: " + e.getMessage());
        }
    }
    
    private Integer convertRoleToNumber(String role) {
        if (role == null) {
            return null;
        }
        switch (role.toLowerCase()) {
            case "admin":
                return 1;
            case "teacher":
                return 2;
            case "student":
                return 3;
            case "parent":
                return 4;
            default:
                return null;
        }
    }
    
    private String getRoleName(Integer role) {
        if (role == null) {
            return "未知";
        }
        switch (role) {
            case 1:
                return "teacher";
            case 2:
                return "student";
            case 3:
                return "parent";
            case 4:
                return "admin";
            default:
                return "未知";
        }
    }
    
    @PostMapping("/users/edit")
    public Result<Boolean> editUser(@RequestBody Map<String, Object> userData) {
        try {
            Long id = ((Number) userData.get("id")).longValue();
            String name = (String) userData.get("name");
            String roleStr = (String) userData.get("role");
            
            User user = userRepository.selectById(id);
            if (user == null) {
                return Result.error(404, "用户不存在");
            }
            
            if (name != null && !name.isEmpty()) {
                user.setName(name);
            }
            
            if (roleStr != null && !roleStr.isEmpty()) {
                Integer roleNum = convertRoleToNumber(roleStr);
                if (roleNum != null) {
                    user.setRole(roleNum);
                }
            }
            
            userRepository.updateById(user);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "编辑用户失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/users/disable")
    public Result<Boolean> disableUser(@RequestParam Long id) {
        try {
            User user = userRepository.selectById(id);
            if (user == null) {
                return Result.error(404, "用户不存在");
            }
            
            user.setDeleted(user.getDeleted() == 0 ? 1 : 0);
            userRepository.updateById(user);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "禁用用户失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取教学资源列表
     *
     * @param keyword 关键词
     * @param type 资源类型
     * @param uploaderId 上传者ID
     * @return 资源列表
     */
    @GetMapping("/content/resources")
    public Result<List<Map<String, Object>>> getResources(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long uploaderId) {
        try {
            LambdaQueryWrapper<LearningResource> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(LearningResource::getDeleted, 0);
            
            if (keyword != null && !keyword.isEmpty()) {
                wrapper.like(LearningResource::getTitle, keyword);
            }
            
            if (type != null && !type.isEmpty()) {
                wrapper.eq(LearningResource::getType, type);
            }
            
            if (uploaderId != null) {
                wrapper.eq(LearningResource::getUploaderId, uploaderId);
            }
            
            List<LearningResource> resources = learningResourceRepository.selectList(wrapper);
            
            List<Map<String, Object>> resourceList = resources.stream().map(resource -> {
                Map<String, Object> resourceInfo = new HashMap<>();
                resourceInfo.put("id", resource.getId());
                resourceInfo.put("title", resource.getTitle());
                resourceInfo.put("type", resource.getType());
                resourceInfo.put("uploaderId", resource.getUploaderId());
                resourceInfo.put("createdAt", resource.getCreatedAt());
                resourceInfo.put("downloadCount", 0); // 暂时返回0，实际应该从数据库获取
                return resourceInfo;
            }).collect(Collectors.toList());
            
            return Result.success(resourceList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取教学资源失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取学习资料列表
     *
     * @param keyword 关键词
     * @param subject 学科
     * @return 学习资料列表
     */
    @GetMapping("/content/learning-materials")
    public Result<List<Map<String, Object>>> getLearningMaterials(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String subject) {
        try {
            LambdaQueryWrapper<LearningMaterial> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(LearningMaterial::getDeleted, 0);
            
            if (keyword != null && !keyword.isEmpty()) {
                wrapper.like(LearningMaterial::getTitle, keyword);
            }
            
            if (subject != null && !subject.isEmpty()) {
                wrapper.eq(LearningMaterial::getSubject, subject);
            }
            
            List<LearningMaterial> materials = learningMaterialRepository.selectList(wrapper);
            
            List<Map<String, Object>> materialList = materials.stream().map(material -> {
                Map<String, Object> materialInfo = new HashMap<>();
                materialInfo.put("id", material.getId());
                materialInfo.put("title", material.getTitle());
                materialInfo.put("subject", material.getSubject());
                materialInfo.put("grade", material.getGrade());
                materialInfo.put("type", material.getType());
                materialInfo.put("viewCount", material.getViewCount());
                materialInfo.put("downloadCount", material.getDownloadCount());
                materialInfo.put("uploaderId", material.getUploaderId());
                materialInfo.put("createdAt", material.getCreatedAt());
                return materialInfo;
            }).collect(Collectors.toList());
            
            return Result.success(materialList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取学习资料失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取公告列表
     *
     * @param keyword 关键词
     * @param status 状态
     * @return 公告列表
     */
    @GetMapping("/content/announcements")
    public Result<List<Map<String, Object>>> getAnnouncements(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        try {
            LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Announcement::getDeleted, 0);
            
            if (keyword != null && !keyword.isEmpty()) {
                wrapper.like(Announcement::getTitle, keyword);
            }
            
            if (status != null && !status.isEmpty()) {
                wrapper.eq(Announcement::getStatus, status);
            }
            
            List<Announcement> announcements = announcementRepository.selectList(wrapper);
            
            List<Map<String, Object>> announcementList = announcements.stream().map(announcement -> {
                Map<String, Object> announcementInfo = new HashMap<>();
                announcementInfo.put("id", announcement.getId());
                announcementInfo.put("title", announcement.getTitle());
                announcementInfo.put("content", announcement.getContent());
                announcementInfo.put("authorId", announcement.getAuthorId());
                announcementInfo.put("publishDate", announcement.getPublishDate());
                announcementInfo.put("status", announcement.getStatus());
                announcementInfo.put("viewCount", announcement.getViewCount());
                return announcementInfo;
            }).collect(Collectors.toList());
            
            return Result.success(announcementList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取公告列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 编辑教学资源
     *
     * @param resourceData 资源数据
     * @return 操作结果
     */
    @PostMapping("/content/resources/edit")
    public Result<Boolean> editResource(@RequestBody Map<String, Object> resourceData) {
        try {
            Long id = ((Number) resourceData.get("id")).longValue();
            String title = (String) resourceData.get("title");
            String type = (String) resourceData.get("type");
            String description = (String) resourceData.get("description");
            
            LearningResource resource = learningResourceRepository.selectById(id);
            if (resource == null) {
                return Result.error(404, "教学资源不存在");
            }
            
            if (title != null && !title.isEmpty()) {
                resource.setTitle(title);
            }
            
            if (type != null && !type.isEmpty()) {
                resource.setType(type);
            }
            
            if (description != null) {
                resource.setDescription(description);
            }
            
            learningResourceRepository.updateById(resource);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "编辑教学资源失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除教学资源
     *
     * @param id 资源ID
     * @return 操作结果
     */
    @PostMapping("/content/resources/delete")
    public Result<Boolean> deleteResource(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            
            LearningResource resource = learningResourceRepository.selectById(id);
            if (resource == null) {
                return Result.error(404, "教学资源不存在");
            }
            
            resource.setDeleted(1);
            learningResourceRepository.updateById(resource);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "删除教学资源失败: " + e.getMessage());
        }
    }
    
    /**
     * 编辑学习资料
     *
     * @param materialData 资料数据
     * @return 操作结果
     */
    @PostMapping("/content/learning-materials/edit")
    public Result<Boolean> editLearningMaterial(@RequestBody Map<String, Object> materialData) {
        try {
            Long id = ((Number) materialData.get("id")).longValue();
            String title = (String) materialData.get("title");
            String subject = (String) materialData.get("subject");
            String grade = (String) materialData.get("grade");
            String type = (String) materialData.get("type");
            
            LearningMaterial material = learningMaterialRepository.selectById(id);
            if (material == null) {
                return Result.error(404, "学习资料不存在");
            }
            
            if (title != null && !title.isEmpty()) {
                material.setTitle(title);
            }
            
            if (subject != null && !subject.isEmpty()) {
                material.setSubject(subject);
            }
            
            if (grade != null && !grade.isEmpty()) {
                material.setGrade(grade);
            }
            
            if (type != null && !type.isEmpty()) {
                material.setType(type);
            }
            
            learningMaterialRepository.updateById(material);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "编辑学习资料失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除学习资料
     *
     * @param id 资料ID
     * @return 操作结果
     */
    @PostMapping("/content/learning-materials/delete")
    public Result<Boolean> deleteLearningMaterial(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            
            LearningMaterial material = learningMaterialRepository.selectById(id);
            if (material == null) {
                return Result.error(404, "学习资料不存在");
            }
            
            material.setDeleted(1);
            learningMaterialRepository.updateById(material);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "删除学习资料失败: " + e.getMessage());
        }
    }
    
    /**
     * 编辑公告
     *
     * @param announcementData 公告数据
     * @return 操作结果
     */
    @PostMapping("/content/announcements/edit")
    public Result<Boolean> editAnnouncement(@RequestBody Map<String, Object> announcementData) {
        try {
            Long id = ((Number) announcementData.get("id")).longValue();
            String title = (String) announcementData.get("title");
            String content = (String) announcementData.get("content");
            String status = (String) announcementData.get("status");
            
            Announcement announcement = announcementRepository.selectById(id);
            if (announcement == null) {
                return Result.error(404, "公告不存在");
            }
            
            if (title != null && !title.isEmpty()) {
                announcement.setTitle(title);
            }
            
            if (content != null) {
                announcement.setContent(content);
            }
            
            if (status != null && !status.isEmpty()) {
                announcement.setStatus(status);
            }
            
            announcementRepository.updateById(announcement);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "编辑公告失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除公告
     *
     * @param id 公告ID
     * @return 操作结果
     */
    @PostMapping("/content/announcements/delete")
    public Result<Boolean> deleteAnnouncement(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            
            Announcement announcement = announcementRepository.selectById(id);
            if (announcement == null) {
                return Result.error(404, "公告不存在");
            }
            
            announcement.setDeleted(1);
            announcementRepository.updateById(announcement);
            return Result.success(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "删除公告失败: " + e.getMessage());
        }
    }
}
