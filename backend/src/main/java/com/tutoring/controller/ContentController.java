package com.tutoring.controller;

import com.tutoring.dto.Result;
import com.tutoring.entity.LearningMaterial;
import com.tutoring.entity.LearningResource;
import com.tutoring.service.LearningMaterialService;
import com.tutoring.service.LearningResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 内容管理控制器
 */
@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
public class ContentController {

    private final LearningResourceService learningResourceService;
    private final LearningMaterialService learningMaterialService;

    /**
     * 获取教学资源列表
     * @param keyword 关键词（可选）
     * @param type 资源类型（可选）
     * @param uploaderId 上传者ID（可选）
     * @return 资源列表
     */
    @GetMapping("/resources")
    public Result<List<LearningResource>> getResources(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long uploaderId) {
        try {
            List<LearningResource> resources = learningResourceService.listResources(keyword, type, uploaderId);
            return Result.success(resources);
        } catch (Exception e) {
            return Result.error(500, "获取资源列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取资源详情
     * @param id 资源ID
     * @return 资源详情
     */
    @GetMapping("/resources/{id}")
    public Result<LearningResource> getResourceById(@PathVariable Long id) {
        try {
            LearningResource resource = learningResourceService.getResourceById(id);
            return Result.success(resource);
        } catch (Exception e) {
            return Result.error(500, "获取资源详情失败: " + e.getMessage());
        }
    }

    /**
     * 新增资源
     * @param resource 资源信息
     * @return 新增的资源
     */
    @PostMapping("/resources")
    public Result<LearningResource> addResource(@RequestBody LearningResource resource) {
        try {
            LearningResource savedResource = learningResourceService.saveResource(resource);
            return Result.success(savedResource);
        } catch (Exception e) {
            return Result.error(500, "新增资源失败: " + e.getMessage());
        }
    }

    /**
     * 更新资源
     * @param id 资源ID
     * @param resource 资源信息
     * @return 更新后的资源
     */
    @PutMapping("/resources/{id}")
    public Result<LearningResource> updateResource(@PathVariable Long id, @RequestBody LearningResource resource) {
        try {
            resource.setId(id);
            LearningResource updatedResource = learningResourceService.updateResource(resource);
            return Result.success(updatedResource);
        } catch (Exception e) {
            return Result.error(500, "更新资源失败: " + e.getMessage());
        }
    }

    /**
     * 删除资源
     * @param id 资源ID
     * @return 操作结果
     */
    @DeleteMapping("/resources/{id}")
    public Result<Void> deleteResource(@PathVariable Long id) {
        try {
            learningResourceService.deleteResource(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(500, "删除资源失败: " + e.getMessage());
        }
    }

    /**
     * 获取学习资料列表
     * @param keyword 关键词（可选）
     * @param subject 学科（可选）
     * @return 资料列表
     */
    @GetMapping("/learning-materials")
    public Result<List<LearningMaterial>> getLearningMaterials(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String subject) {
        try {
            List<LearningMaterial> materials = learningMaterialService.listMaterials(keyword, subject);
            return Result.success(materials);
        } catch (Exception e) {
            return Result.error(500, "获取学习资料失败: " + e.getMessage());
        }
    }

    /**
     * 获取学习资料详情
     * @param id 资料ID
     * @return 资料详情
     */
    @GetMapping("/learning-materials/{id}")
    public Result<LearningMaterial> getLearningMaterialById(@PathVariable Long id) {
        try {
            LearningMaterial material = learningMaterialService.getMaterialById(id);
            return Result.success(material);
        } catch (Exception e) {
            return Result.error(500, "获取学习资料详情失败: " + e.getMessage());
        }
    }

    /**
     * 新增学习资料
     * @param material 学习资料
     * @return 新增的学习资料
     */
    @PostMapping("/learning-materials")
    public Result<LearningMaterial> addLearningMaterial(@RequestBody LearningMaterial material) {
        try {
            LearningMaterial savedMaterial = learningMaterialService.addMaterial(material);
            return Result.success(savedMaterial);
        } catch (Exception e) {
            return Result.error(500, "新增学习资料失败: " + e.getMessage());
        }
    }

    /**
     * 更新学习资料
     * @param id 资料ID
     * @param material 学习资料
     * @return 更新后的学习资料
     */
    @PutMapping("/learning-materials/{id}")
    public Result<LearningMaterial> updateLearningMaterial(@PathVariable Long id, @RequestBody LearningMaterial material) {
        try {
            material.setId(id);
            LearningMaterial updatedMaterial = learningMaterialService.updateMaterial(material);
            return Result.success(updatedMaterial);
        } catch (Exception e) {
            return Result.error(500, "更新学习资料失败: " + e.getMessage());
        }
    }

    /**
     * 删除学习资料
     * @param id 资料ID
     * @return 操作结果
     */
    @DeleteMapping("/learning-materials/{id}")
    public Result<Void> deleteLearningMaterial(@PathVariable Long id) {
        try {
            learningMaterialService.deleteMaterial(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(500, "删除学习资料失败: " + e.getMessage());
        }
    }
}
