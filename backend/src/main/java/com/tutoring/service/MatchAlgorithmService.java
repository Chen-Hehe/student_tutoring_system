package com.tutoring.service;

import com.tutoring.entity.Student;
import com.tutoring.entity.Teacher;
import com.tutoring.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 匹配算法服务 - 多维度评分
 */
@Slf4j
@Service
public class MatchAlgorithmService {
    
    // 算法版本
    public static final String ALGORITHM_VERSION = "v1.0.0";
    
    // 默认权重配置
    private Map<String, Double> weights = new HashMap<>();
    
    public MatchAlgorithmService() {
        // 初始化默认权重
        weights.put("subjectMatch", 0.30);      // 科目匹配权重 30%
        weights.put("gradeMatch", 0.25);        // 年级匹配权重 25%
        weights.put("experienceMatch", 0.20);   // 经验匹配权重 20%
        weights.put("availabilityMatch", 0.15); // 时间匹配权重 15%
        weights.put("locationMatch", 0.10);     // 地理位置权重 10%
    }
    
    /**
     * 计算师生匹配分数
     *
     * @param teacher 教师信息
     * @param student 学生信息
     * @param teacherUser 教师用户信息
     * @param studentUser 学生用户信息
     * @return 匹配结果
     */
    public MatchScoreResult calculateMatchScore(Teacher teacher, Student student, 
                                                 User teacherUser, User studentUser) {
        log.info("计算匹配分数：教师={}, 学生={}", 
            teacherUser != null ? teacherUser.getName() : "unknown",
            studentUser != null ? studentUser.getName() : "unknown");
        
        MatchScoreResult result = new MatchScoreResult();
        result.setTeacherId(teacher.getId());
        result.setStudentId(student.getId());
        result.setAlgorithmVersion(ALGORITHM_VERSION);
        
        // 1. 科目匹配 (30 分)
        double subjectScore = calculateSubjectMatch(teacher, student);
        result.addScore("subjectMatch", subjectScore, weights.get("subjectMatch"));
        
        // 2. 年级匹配 (25 分)
        double gradeScore = calculateGradeMatch(teacher, student);
        result.addScore("gradeMatch", gradeScore, weights.get("gradeMatch"));
        
        // 3. 经验匹配 (20 分)
        double experienceScore = calculateExperienceMatch(teacher, student);
        result.addScore("experienceMatch", experienceScore, weights.get("experienceMatch"));
        
        // 4. 时间匹配 (15 分)
        double availabilityScore = calculateAvailabilityMatch(teacher, student);
        result.addScore("availabilityMatch", availabilityScore, weights.get("availabilityMatch"));
        
        // 5. 地理位置匹配 (10 分)
        double locationScore = calculateLocationMatch(teacher, student, teacherUser, studentUser);
        result.addScore("locationMatch", locationScore, weights.get("locationMatch"));
        
        // 计算总分
        result.calculateTotalScore();
        
        // 生成匹配原因
        result.generateReasons();
        
        log.info("匹配分数结果：总分={}, 详情={}", result.getTotalScore(), result.getDetailScores());
        
        return result;
    }
    
    /**
     * 科目匹配 (0-100)
     */
    private double calculateSubjectMatch(Teacher teacher, Student student) {
        if (teacher == null || student == null) {
            return 0;
        }
        
        String subject = teacher.getSubject();
        String learningNeeds = student.getLearningNeeds();
        
        if (subject == null || learningNeeds == null) {
            return 50; // 默认中等分数
        }
        
        // 完全匹配
        if (learningNeeds.contains(subject)) {
            return 100;
        }
        
        // 部分匹配（如数学 vs 理科）
        if (isRelatedSubject(subject, learningNeeds)) {
            return 70;
        }
        
        return 30;
    }
    
    /**
     * 年级匹配 (0-100)
     */
    private double calculateGradeMatch(Teacher teacher, Student student) {
        if (teacher == null || student == null) {
            return 0;
        }
        
        String grade = student.getGrade();
        String experience = teacher.getExperience();
        
        if (grade == null || experience == null) {
            return 50;
        }
        
        // 教师经验包含学生年级
        if (experience.contains(grade)) {
            return 100;
        }
        
        // 检查是否教过相近年级
        if (hasNearbyGrade(experience, grade)) {
            return 70;
        }
        
        return 40;
    }
    
    /**
     * 经验匹配 (0-100)
     */
    private double calculateExperienceMatch(Teacher teacher, Student student) {
        if (teacher == null) {
            return 0;
        }
        
        String experience = teacher.getExperience();
        if (experience == null) {
            return 50;
        }
        
        // 根据教龄评分
        if (experience.contains("年")) {
            try {
                String[] parts = experience.split("年");
                if (parts.length > 0) {
                    int years = Integer.parseInt(parts[0].replaceAll("[^0-9]", ""));
                    if (years >= 10) {
                        return 100;
                    } else if (years >= 5) {
                        return 80;
                    } else if (years >= 3) {
                        return 60;
                    } else {
                        return 50;
                    }
                }
            } catch (Exception e) {
                log.warn("解析教龄失败：{}", experience);
            }
        }
        
        return 60;
    }
    
    /**
     * 时间匹配 (0-100)
     */
    private double calculateAvailabilityMatch(Teacher teacher, Student student) {
        // 简化实现：如果教师有时间安排信息，给高分
        if (teacher != null && teacher.getAvailability() != null && 
            !teacher.getAvailability().isEmpty()) {
            return 80;
        }
        return 50;
    }
    
    /**
     * 地理位置匹配 (0-100)
     */
    private double calculateLocationMatch(Teacher teacher, Student student,
                                          User teacherUser, User studentUser) {
        if (teacherUser == null || studentUser == null) {
            return 50;
        }
        
        String teacherAddr = teacherUser.getAddress();
        String studentAddr = studentUser.getAddress();
        
        if (teacherAddr == null || studentAddr == null) {
            return 50;
        }
        
        // 同一城市
        if (isSameCity(teacherAddr, studentAddr)) {
            return 100;
        }
        
        // 同一省份
        if (isSameProvince(teacherAddr, studentAddr)) {
            return 70;
        }
        
        return 40;
    }
    
    // ===== 辅助方法 =====
    
    private boolean isRelatedSubject(String subject, String needs) {
        // 简化的相关科目判断
        Map<String, String[]> relatedMap = new HashMap<>();
        relatedMap.put("数学", new String[]{"数学", "理科", "奥数"});
        relatedMap.put("语文", new String[]{"语文", "文科", "阅读", "写作"});
        relatedMap.put("英语", new String[]{"英语", "外语", "口语"});
        relatedMap.put("物理", new String[]{"物理", "理科", "科学"});
        relatedMap.put("化学", new String[]{"化学", "理科", "科学"});
        
        String[] related = relatedMap.get(subject);
        if (related != null) {
            for (String r : related) {
                if (needs.contains(r)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private boolean hasNearbyGrade(String experience, String grade) {
        // 简化的年级相近判断
        String[] gradeOrder = {"一年级", "二年级", "三年级", "四年级", "五年级", "六年级", 
                              "初一", "初二", "初三", "高一", "高二", "高三"};
        
        int gradeIndex = -1;
        for (int i = 0; i < gradeOrder.length; i++) {
            if (grade.contains(gradeOrder[i])) {
                gradeIndex = i;
                break;
            }
        }
        
        if (gradeIndex == -1) {
            return false;
        }
        
        // 检查相邻年级
        int[] nearbyIndexes = {gradeIndex - 1, gradeIndex + 1};
        for (int idx : nearbyIndexes) {
            if (idx >= 0 && idx < gradeOrder.length) {
                if (experience.contains(gradeOrder[idx])) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    private boolean isSameCity(String addr1, String addr2) {
        // 简化：检查是否包含相同的城市名
        String[] cities = {"北京", "上海", "广州", "深圳", "杭州", "南京", "武汉", "成都"};
        for (String city : cities) {
            if (addr1.contains(city) && addr2.contains(city)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean isSameProvince(String addr1, String addr2) {
        // 简化：检查是否包含相同的省份名
        String[] provinces = {"北京", "上海", "广东", "浙江", "江苏", "湖北", "四川"};
        for (String province : provinces) {
            if (addr1.contains(province) && addr2.contains(province)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 匹配分数结果类
     */
    @lombok.Data
    public static class MatchScoreResult {
        private Long teacherId;
        private Long studentId;
        private String algorithmVersion;
        private Map<String, Double> detailScores = new HashMap<>();
        private Map<String, Double> weightedScores = new HashMap<>();
        private Double totalScore = 0.0;
        private List<String> reasons = new ArrayList<>();
        
        public void addScore(String dimension, double rawScore, double weight) {
            detailScores.put(dimension, rawScore);
            weightedScores.put(dimension, rawScore * weight);
        }
        
        public void calculateTotalScore() {
            totalScore = weightedScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
            // 归一化到 0-100
            totalScore = Math.min(100, Math.max(0, totalScore));
        }
        
        public void generateReasons() {
            reasons.clear();
            
            if (detailScores.getOrDefault("subjectMatch", 0.0) >= 80) {
                reasons.add("科目匹配度高");
            }
            if (detailScores.getOrDefault("gradeMatch", 0.0) >= 80) {
                reasons.add("年级适配性好");
            }
            if (detailScores.getOrDefault("experienceMatch", 0.0) >= 80) {
                reasons.add("教师经验丰富");
            }
            if (detailScores.getOrDefault("availabilityMatch", 0.0) >= 80) {
                reasons.add("时间安排合适");
            }
            if (detailScores.getOrDefault("locationMatch", 0.0) >= 80) {
                reasons.add("地理位置便利");
            }
            
            if (reasons.isEmpty()) {
                reasons.add("基础匹配");
            }
        }
    }
}
