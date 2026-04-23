package com.tutoring.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.entity.LearningResource;
import com.tutoring.repository.LearningResourceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 学习资源服务类
 */
@Slf4j
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
        try {
            log.info("【DEBUG】Service 获取资源列表 - category={}, type={}", category, type);
            LambdaQueryWrapper<LearningResource> wrapper = new LambdaQueryWrapper<>();
            // 不再过滤 deleted 字段，因为我们现在使用物理删除
            wrapper.orderByDesc(LearningResource::getCreatedAt);
            if (category != null && !category.isEmpty()) {
                wrapper.eq(LearningResource::getCategory, category);
            }
            if (type != null && !type.isEmpty()) {
                wrapper.eq(LearningResource::getType, type);
            }
            List<LearningResource> result = learningResourceRepository.selectList(wrapper);
            log.info("【DEBUG】Service 查询成功，共 {} 条", result.size());
            return result;
        } catch (Exception e) {
            log.error("【DEBUG】Service 查询失败", e);
            throw e;
        }
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
     * 删除资源（物理删除）
     * @param id 资源 ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        learningResourceRepository.deleteById(id);
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
