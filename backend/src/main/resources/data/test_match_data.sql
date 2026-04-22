-- ============================================
-- 师生匹配系统 - 测试数据生成脚本
-- 用于测试匹配数据统计功能
-- 
-- 状态码说明：
-- 0 - 待确认
-- 1 - 待家长确认
-- 2 - 已匹配（成功）
-- 3 - 已拒绝
-- ============================================

-- 1. 插入测试用户（如果还没有）
INSERT INTO users (id, username, password, name, role, status, created_at, updated_at) VALUES
(2041436600118394881, 'teacher_zhang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '张老师', 1, 'active', NOW(), NOW()),
(2041436600118394882, 'teacher_wang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '王老师', 1, 'active', NOW(), NOW()),
(2041436600118394883, 'teacher_li', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '李老师', 1, 'active', NOW(), NOW()),
(2041436613062017026, 'student_ming', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '小明', 2, 'active', NOW(), NOW()),
(2041436613062017027, 'student_hong', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '小红', 2, 'active', NOW(), NOW()),
(2041436613062017028, 'student_gang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '小刚', 2, 'active', NOW(), NOW()),
(2041436613062017029, 'student_fang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '小芳', 2, 'active', NOW(), NOW()),
(2041436613062017030, 'student_qiang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '小强', 2, 'active', NOW(), NOW()),
(2041436623062017031, 'parent_zhang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '张家长', 3, 'active', NOW(), NOW()),
(2041436623062017032, 'parent_wang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iDJ6fV6sY6p9kZKxL5jZ5Z5Z5Z5Z', '王家长', 3, 'active', NOW(), NOW());

-- 2. 插入测试教师信息
INSERT INTO teacher (id, user_id, subject, experience, introduction, status, created_at, updated_at) VALUES
(2041436700118394881, 2041436600118394881, '数学', '10 年', '资深数学教师，擅长初中数学教学', 1, NOW(), NOW()),
(2041436700118394882, 2041436600118394882, '英语', '8 年', '英语专业八级，有丰富的教学经验', 1, NOW(), NOW()),
(2041436700118394883, 2041436600118394883, '物理', '12 年', '物理特级教师，培养学生的科学思维', 1, NOW(), NOW());

-- 3. 插入测试学生信息
INSERT INTO student (id, user_id, grade, school, learning_needs, status, created_at, updated_at) VALUES
(2041436713062017026, 2041436613062017026, '初一', '希望中学', '数学', 1, NOW(), NOW()),
(2041436713062017027, 2041436613062017027, '初二', '光明中学', '英语', 1, NOW(), NOW()),
(2041436713062017028, 2041436613062017028, '初三', '希望中学', '物理', 1, NOW(), NOW()),
(2041436713062017029, 2041436613062017029, '初一', '实验中学', '数学', 1, NOW(), NOW()),
(2041436713062017030, 2041436613062017030, '初二', '光明中学', '英语', 1, NOW(), NOW());

-- 4. 插入师生匹配记录（各种状态）

-- 状态 2：已匹配（成功）- 5 条
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted) VALUES
(2041436800000000001, 2041436713062017026, 2041436700118394881, 'student', 2, '希望提高数学成绩', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 0),
(2041436800000000002, 2041436713062017027, 2041436700118394882, 'student', 2, '想提高英语口语能力', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),
(2041436800000000003, 2041436713062017028, 2041436700118394883, 'teacher', 2, '你的物理成绩需要提高', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0),
(2041436800000000004, 2041436713062017029, 2041436700118394881, 'teacher', 2, '数学基础很重要，我来帮你', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),
(2041436800000000005, 2041436713062017030, 2041436700118394882, 'student', 2, '英语学习很有趣', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0);

-- 状态 0：待确认 - 3 条
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted) VALUES
(2041436800000000006, 2041436713062017026, 2041436700118394882, 'student', 0, '想同时提高英语', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),
(2041436800000000007, 2041436713062017027, 2041436700118394881, 'teacher', 0, '你的数学也需要加强', 0, 1, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),
(2041436800000000008, 2041436713062017028, 2041436700118394882, 'student', 0, '对英语也感兴趣', 1, 0, 0, NOW(), NOW(), 0);

-- 状态 1：待家长确认 - 2 条
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted) VALUES
(2041436800000000009, 2041436713062017029, 2041436700118394883, 'teacher', 1, '物理实验很有趣', 1, 1, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),
(2041436800000000010, 2041436713062017030, 2041436700118394883, 'student', 1, '想学习物理知识', 1, 1, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 0);

-- 状态 3：已拒绝 - 2 条
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted) VALUES
(2041436800000000011, 2041436713062017026, 2041436700118394883, 'teacher', 3, '物理基础训练', 2, 1, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),
(2041436800000000012, 2041436713062017027, 2041436700118394883, 'student', 3, '想学物理', 1, 2, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0);

-- ============================================
-- 数据统计预期结果：
-- ============================================
-- 总匹配数 (totalMatches): 12
-- 已匹配成功 (successfulMatches, status=2): 5
-- 待确认 (pendingMatches, status=0 或 1): 5 (3 条 status=0 + 2 条 status=1)
-- 已拒绝 (rejectedMatches, status=3): 2
-- 成功率 (successRate): 5/12 * 100% = 41.67%
--
-- 按教师统计（teacher_id = 2041436700118394881，张老师）：
--   totalMatches: 3
--   successfulMatches: 2
--   pendingMatches: 1
--   rejectedMatches: 0
--   successRate: 66.67%
--
-- 按学生统计（student_id = 2041436713062017026，小明）：
--   totalMatches: 3
--   successfulMatches: 1
--   pendingMatches: 1
--   rejectedMatches: 1
--   successRate: 33.33%
-- ============================================

-- 验证查询
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;

-- 按教师统计验证
SELECT 
    teacher_id,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY teacher_id;

-- 按学生统计验证
SELECT 
    student_id,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY student_id;
