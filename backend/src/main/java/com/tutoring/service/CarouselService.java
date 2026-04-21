package com.tutoring.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.tutoring.entity.Carousel;
import com.tutoring.repository.CarouselRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 轮播图服务类
 */
@Service
public class CarouselService {

    @Autowired
    private CarouselRepository carouselRepository;

    /**
     * 获取轮播图列表
     * @param status 状态（可选）
     * @return 轮播图列表
     */
    public List<Carousel> listCarousels(Integer status) {
        LambdaQueryWrapper<Carousel> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Carousel::getDeleted, 0);
        if (status != null) {
            wrapper.eq(Carousel::getStatus, status);
        }
        wrapper.orderByAsc(Carousel::getSort);
        return carouselRepository.selectList(wrapper);
    }

    /**
     * 获取轮播图详情
     * @param id 轮播图ID
     * @return 轮播图详情
     */
    public Carousel getCarouselById(Long id) {
        return carouselRepository.selectById(id);
    }

    /**
     * 创建轮播图
     * @param carousel 轮播图信息
     * @return 创建结果
     */
    public boolean createCarousel(Carousel carousel) {
        return carouselRepository.insert(carousel) > 0;
    }

    /**
     * 更新轮播图
     * @param carousel 轮播图信息
     * @return 更新结果
     */
    public boolean updateCarousel(Carousel carousel) {
        return carouselRepository.updateById(carousel) > 0;
    }

    /**
     * 删除轮播图
     * @param id 轮播图ID
     * @return 删除结果
     */
    public boolean deleteCarousel(Long id) {
        Carousel carousel = new Carousel();
        carousel.setId(id);
        carousel.setDeleted(1);
        return carouselRepository.updateById(carousel) > 0;
    }
}
