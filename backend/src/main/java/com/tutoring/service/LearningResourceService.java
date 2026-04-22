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

    /**
     * 获取教学资源列表
     * @param category 分类（可选）
     * @param type 资源类型（可选）
     * @return 资源列表
     */
    public List<LearningResource> getList(String category, String type) {
        LambdaQueryWrapper<LearningResource> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LearningResource::getDeleted, 0)
               .orderByDesc(LearningResource::getCreatedAt);
        if (category != null && !category.isEmpty()) {
            wrapper.eq(LearningResource::getCategory, category);
        }
        if (type != null && !type.isEmpty()) {
            wrapper.eq(LearningResource::getType, type);
        }
        return learningResourceRepository.selectList(wrapper);
    }
    
    /**
     * 根据 ID 获取资源
     * @param id 资源 ID
     * @return 资源信息
     */
    public LearningResource getById(Long id) {
        return learningResourceRepository.selectById(id);
    }
    
    /**
     * 保存资源
     * @param resource 资源信息
     */
    @Transactional(rollbackFor = Exception.class)
    public void save(LearningResource resource) {
        learningResourceRepository.insert(resource);
    }
    
    /**
     * 更新资源
     * @param resource 资源信息
     */
    @Transactional(rollbackFor = Exception.class)
    public void update(LearningResource resource) {
        learningResourceRepository.updateById(resource);
    }
    
    /**
     * 删除资源（软删除）
     * @param id 资源 ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        LearningResource resource = new LearningResource();
        resource.setId(id);
        resource.setDeleted(1);
        learningResourceRepository.updateById(resource);
    }
    
    /**
     * 增加下载次数
     * @param id 资源 ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void incrementDownloadCount(Long id) {
        LearningResource resource = learningResourceRepository.selectById(id);
        if (resource != null) {
            Integer newCount = (resource.getDownloadCount() != null ? resource.getDownloadCount() : 0) + 1;
            resource.setDownloadCount(newCount);
            learningResourceRepository.updateById(resource);
        }
    }
}
