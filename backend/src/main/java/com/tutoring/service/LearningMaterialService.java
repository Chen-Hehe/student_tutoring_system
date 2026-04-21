package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.entity.LearningMaterial;
import com.tutoring.repository.LearningMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 学习资料服务类
 */
@Service
@RequiredArgsConstructor
public class LearningMaterialService {

    private final LearningMaterialRepository learningMaterialRepository;

    /**
     * 获取学习资料列表
     * @param keyword 关键词（可选）
     * @param subject 学科（可选）
     * @return 资料列表
     */
    public List<LearningMaterial> listMaterials(String keyword, String subject) {
        LambdaQueryWrapper<LearningMaterial> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LearningMaterial::getDeleted, 0);
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(LearningMaterial::getTitle, keyword);
        }
        if (subject != null) {
            wrapper.eq(LearningMaterial::getSubject, subject);
        }
        return learningMaterialRepository.selectList(wrapper);
    }

    /**
     * 根据ID获取学习资料
     * @param id 资料ID
     * @return 学习资料
     */
    public LearningMaterial getMaterialById(Long id) {
        return learningMaterialRepository.selectById(id);
    }

    /**
     * 新增学习资料
     * @param material 学习资料
     * @return 学习资料
     */
    @Transactional(rollbackFor = Exception.class)
    public LearningMaterial addMaterial(LearningMaterial material) {
        learningMaterialRepository.insert(material);
        return material;
    }

    /**
     * 更新学习资料
     * @param material 学习资料
     * @return 学习资料
     */
    @Transactional(rollbackFor = Exception.class)
    public LearningMaterial updateMaterial(LearningMaterial material) {
        learningMaterialRepository.updateById(material);
        return material;
    }

    /**
     * 删除学习资料（软删除）
     * @param id 资料ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteMaterial(Long id) {
        LearningMaterial material = new LearningMaterial();
        material.setId(id);
        material.setDeleted(1);
        learningMaterialRepository.updateById(material);
    }

    /**
     * 增加浏览次数
     * @param id 资料ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void incrementViewCount(Long id) {
        LearningMaterial material = learningMaterialRepository.selectById(id);
        if (material != null) {
            material.setViewCount(material.getViewCount() != null ? material.getViewCount() + 1 : 1);
            learningMaterialRepository.updateById(material);
        }
    }

    /**
     * 增加下载次数
     * @param id 资料ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void incrementDownloadCount(Long id) {
        LearningMaterial material = learningMaterialRepository.selectById(id);
        if (material != null) {
            material.setDownloadCount(material.getDownloadCount() != null ? material.getDownloadCount() + 1 : 1);
            learningMaterialRepository.updateById(material);
        }
    }
}