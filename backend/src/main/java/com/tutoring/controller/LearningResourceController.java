package com.tutoring.controller;

import com.tutoring.dto.Result;
import com.tutoring.entity.LearningResource;
import com.tutoring.service.LearningResourceService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 学习资源控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class LearningResourceController {
    
    private final LearningResourceService learningResourceService;
    
    // 文件上传根目录
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/resources/";
    
    /**
     * 获取资源列表
     */
    @GetMapping("/list")
    public Result<List<LearningResource>> getList(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false) String type) {
        try {
            List<LearningResource> resources = learningResourceService.getList(category, type);
            return Result.success(resources);
        } catch (Exception e) {
            log.error("获取资源列表失败", e);
            return Result.error(500, "获取资源列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取单个资源详情
     */
    @GetMapping("/{id}")
    public Result<LearningResource> getById(@PathVariable Long id) {
        try {
            LearningResource resource = learningResourceService.getById(id);
            if (resource == null) {
                return Result.error(404, "资源不存在");
            }
            return Result.success(resource);
        } catch (Exception e) {
            log.error("获取资源详情失败", e);
            return Result.error(500, "获取资源详情失败：" + e.getMessage());
        }
    }
    
    /**
     * 上传文件并创建资源
     */
    @PostMapping("/upload")
    public Result<LearningResource> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam("uploaderId") Long uploaderId) {
        
        try {
            log.info("【DEBUG】收到资源上传请求 - title={}, type={}, category={}, uploaderId={}", 
                title, type, category, uploaderId);
            
            // 1. 验证文件
            if (file.isEmpty()) {
                return Result.error(400, "文件不能为空");
            }
            
            // 2. 创建上传目录
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
                log.info("创建上传目录：{}", UPLOAD_DIR);
            }
            
            // 3. 生成唯一文件名
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;
            
            // 4. 保存文件
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath);
            
            log.info("文件保存成功：{}, 大小：{} bytes", fileName, file.getSize());
            
            // 5. 创建资源记录
            LearningResource resource = new LearningResource();
            resource.setTitle(title);
            resource.setDescription(description);
            resource.setType(type);
            resource.setCategory(category);
            resource.setUrl("/api/resources/download/" + fileName); // 下载路径
            resource.setUploaderId(uploaderId);
            resource.setFileName(originalFileName);
            resource.setFileSize(file.getSize());
            resource.setCreatedAt(LocalDateTime.now());
            resource.setDeleted(0);
            
            learningResourceService.save(resource);
            
            log.info("资源创建成功，id={}", resource.getId());
            
            return Result.success("上传成功", resource);
            
        } catch (IOException e) {
            log.error("文件上传失败", e);
            return Result.error(500, "文件上传失败：" + e.getMessage());
        } catch (Exception e) {
            log.error("创建资源失败", e);
            return Result.error(500, "创建资源失败：" + e.getMessage());
        }
    }
    
    /**
     * 下载文件
     */
    @GetMapping("/download/{filename}")
    public void download(@PathVariable String filename, HttpServletResponse response) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            if (!Files.exists(filePath)) {
                response.setStatus(404);
                return;
            }
            
            String contentType = Files.probeContentType(filePath);
            response.setContentType(contentType != null ? contentType : "application/octet-stream");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");
            
            Files.copy(filePath, response.getOutputStream());
            response.getOutputStream().flush();
            
            log.info("文件下载成功：{}", filename);
            
        } catch (IOException e) {
            log.error("文件下载失败", e);
        }
    }
    
    /**
     * 删除资源
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        try {
            LearningResource resource = learningResourceService.getById(id);
            if (resource == null) {
                return Result.error(404, "资源不存在");
            }
            
            // 逻辑删除
            learningResourceService.delete(id);
            
            // TODO: 物理删除文件（可选）
            // String filename = resource.getUrl().replace("/api/resources/download/", "");
            // Files.deleteIfExists(Paths.get(UPLOAD_DIR + filename));
            
            log.info("资源删除成功，id={}", id);
            
            return Result.success();
            
        } catch (Exception e) {
            log.error("删除资源失败", e);
            return Result.error(500, "删除资源失败：" + e.getMessage());
        }
    }
    
    /**
     * 增加下载次数
     */
    @PostMapping("/{id}/download")
    public Result<Void> incrementDownloadCount(@PathVariable Long id) {
        try {
            learningResourceService.incrementDownloadCount(id);
            return Result.success();
        } catch (Exception e) {
            log.error("增加下载次数失败", e);
            return Result.error(500, "增加下载次数失败：" + e.getMessage());
        }
    }
}
