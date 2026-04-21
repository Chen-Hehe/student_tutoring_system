package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.tutoring.entity.Announcement;
import com.tutoring.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 公告服务类
 */
@Service
public class AnnouncementService extends ServiceImpl<AnnouncementRepository, Announcement> {

    /**
     * 获取公告列表
     * @param keyword 关键词（可选）
     * @param status 状态（可选）
     * @return 公告列表
     */
    public List<Announcement> listAnnouncements(String keyword, String status) {
        LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Announcement::getDeleted, 0);
        if (status != null && !status.isEmpty()) {
            wrapper.eq(Announcement::getStatus, status);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Announcement::getTitle, keyword)
                    .or()
                    .like(Announcement::getContent, keyword));
        }
        wrapper.orderByDesc(Announcement::getPublishDate);
        return this.list(wrapper);
    }

    /**
     * 创建公告
     * @param announcement 公告信息
     * @return 是否成功
     */
    public boolean createAnnouncement(Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setPublishDate(LocalDateTime.now());
        if (announcement.getStatus() == null) {
            announcement.setStatus("published");
        }
        return this.save(announcement);
    }

    /**
     * 更新公告
     * @param announcement 公告信息
     * @return 是否成功
     */
    public boolean updateAnnouncement(Announcement announcement) {
        announcement.setUpdatedAt(LocalDateTime.now());
        return this.updateById(announcement);
    }

    /**
     * 删除公告
     * @param id 公告ID
     * @return 是否成功
     */
    public boolean deleteAnnouncement(Long id) {
        Announcement announcement = this.getById(id);
        if (announcement != null) {
            announcement.setDeleted(1);
            return this.updateById(announcement);
        }
        return false;
    }
}