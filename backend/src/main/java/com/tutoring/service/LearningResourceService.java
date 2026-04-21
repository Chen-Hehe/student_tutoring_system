package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.entity.LearningResource;
import com.tutoring.repository.LearningResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 学习资源服务类
 */
@Service
@RequiredArgsConstructor
public class LearningResourceService {

    private final LearningResourceRepository learningResourceRepository;
    private final UserService userService;

    /**
     * 获取教学资源列表
     * @param keyword 关键词（可选）
     * @param type 资源类型（可选）
     * @param uploaderId 上传者ID（可选）
     * @return 资源列表
     */
    public List<LearningResource> listResources(String keyword, String type, Long uploaderId) {
        LambdaQueryWrapper<LearningResource> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LearningResource::getDeleted, 0);
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(LearningResource::getTitle, keyword);
        }
        if (type != null) {
            wrapper.eq(LearningResource::getType, type);
        }
        if (uploaderId != null) {
            wrapper.eq(LearningResource::getUploaderId, uploaderId);
        }
        return learningResourceRepository.selectList(wrapper);
    }

    /**
     * 根据ID获取资源
     * @param id 资源ID
     * @return 资源信息
     */
    public LearningResource getResourceById(Long id) {
        return learningResourceRepository.selectById(id);
    }

    /**
     * 保存资源
     * @param resource 资源信息
     * @return 保存后的资源
     */
    @Transactional(rollbackFor = Exception.class)
    public LearningResource saveResource(LearningResource resource) {
        learningResourceRepository.insert(resource);
        return resource;
    }

    /**
     * 更新资源
     * @param resource 资源信息
     * @return 更新后的资源
     */
    @Transactional(rollbackFor = Exception.class)
    public LearningResource updateResource(LearningResource resource) {
        learningResourceRepository.updateById(resource);
        return resource;
    }

    /**
     * 删除资源（软删除）
     * @param id 资源ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteResource(Long id) {
        LearningResource resource = new LearningResource();
        resource.setId(id);
        resource.setDeleted(1);
        learningResourceRepository.updateById(resource);
    }
}
