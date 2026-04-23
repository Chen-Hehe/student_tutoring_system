-- ============================================
-- 师生匹配系统 - 完整测试数据初始化脚本
-- 作用：添加管理员账号和补充测试数据
-- ============================================

-- 1. 添加管理员账号（密码：123456，BCrypt 加密）
-- 使用与现有用户相同的密码哈希
INSERT INTO users (id, username, password, role, name, email, phone, gender, created_at, updated_at, deleted) VALUES
(4001, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, '系统管理员', 'admin@tutoring.com', '13800000000', 1, NOW(), NOW(), 0);

-- 验证管理员已添加
SELECT '=== 管理员账号已添加 ===' AS result;
SELECT id, username, name, role FROM users WHERE role = 4;

-- 2. 补充 students 表数据（如果还没有）
-- 检查 students 表是否有数据
INSERT IGNORE INTO students (id, user_id, grade, school, learning_needs, created_at, updated_at, deleted) VALUES
(3001, 2001, '初一', '希望中学', '数学', NOW(), NOW(), 0),
(3002, 2002, '初二', '光明中学', '英语', NOW(), NOW(), 0),
(3003, 2003, '初三', '实验中学', '语文', NOW(), NOW(), 0),
(3004, 2004, '初一', '育才中学', '科学', NOW(), NOW(), 0),
(3005, 2005, '初二', '希望中学', '化学', NOW(), NOW(), 0);

-- 3. 补充 teachers 表数据（如果还没有）
-- 检查 teachers 表是否有数据
INSERT IGNORE INTO teachers (id, user_id, subject, education, experience, specialties, availability, created_at, updated_at, deleted) VALUES
(2001, 1001, '数学', '北京大学数学系硕士', '15 年高中数学教学经验，擅长高考冲刺辅导', '代数、几何、微积分', '周一至周五晚上，周末全天', NOW(), NOW(), 0),
(2002, 1002, '英语', '上海外国语大学英语系博士', '12 年英语教学经验，雅思托福资深讲师', '英语口语、写作、考试辅导', '周二至周六下午', NOW(), NOW(), 0),
(2003, 1003, '语文', '北京师范大学中文系硕士', '18 年语文教学经验，专注作文和阅读理解', '古诗文、现代文阅读、作文', '周一、三、五晚上，周日全天', NOW(), NOW(), 0);

-- 4. 验证数据
SELECT '=== 数据验证 ===' AS result;

-- 用户统计
SELECT '用户统计:' AS info;
SELECT role, 
       CASE role 
           WHEN 1 THEN '教师'
           WHEN 2 THEN '学生'
           WHEN 3 THEN '家长'
           WHEN 4 THEN '管理员'
           ELSE '未知'
       END AS role_name,
       COUNT(*) AS count
FROM users WHERE deleted = 0 GROUP BY role;

-- 教师统计
SELECT '教师统计:' AS info;
SELECT COUNT(*) AS total_teachers FROM teachers WHERE deleted = 0;

-- 学生统计
SELECT '学生统计:' AS info;
SELECT COUNT(*) AS total_students FROM students WHERE deleted = 0;

-- 匹配统计
SELECT '匹配统计:' AS info;
SELECT 
    COUNT(*) AS total_matches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successful,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejected,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS success_rate
FROM teacher_student_matches WHERE deleted = 0;

-- 5. 完成提示
SELECT '========================================' AS '';
SELECT '  测试数据初始化完成！' AS '';
SELECT '========================================' AS '';
SELECT '' AS '', '账号信息：' AS info;
SELECT '' AS '', '管理员：admin / 123456' AS credentials;
SELECT '' AS '', '教师：teacher_zhang / 123456' AS credentials;
SELECT '' AS '', '学生：student_ming / 123456' AS credentials;
SELECT '========================================' AS '';
