-- 补充测试数据脚本
-- 为已创建的账号添加教师详情、学生详情和家长 - 学生关系
-- 执行时间：2026-04-02

USE tutoring;

-- 首先获取用户 ID（根据实际创建的 ID 调整）
-- 教师 ID
SET @teacher_zhang_id = (SELECT id FROM users WHERE username = 'teacher_zhang');
SET @teacher_li_id = (SELECT id FROM users WHERE username = 'teacher_li');
SET @teacher_wang_id = (SELECT id FROM users WHERE username = 'teacher_wang');

-- 学生 ID
SET @student_ming_id = (SELECT id FROM users WHERE username = 'student_ming');
SET @student_hua_id = (SELECT id FROM users WHERE username = 'student_hua');
SET @student_gang_id = (SELECT id FROM users WHERE username = 'student_gang');
SET @student_fang_id = (SELECT id FROM users WHERE username = 'student_fang');
SET @student_jun_id = (SELECT id FROM users WHERE username = 'student_jun');

-- 家长 ID
SET @parent_chen_id = (SELECT id FROM users WHERE username = 'parent_chen');
SET @parent_liu_id = (SELECT id FROM users WHERE username = 'parent_liu');
SET @parent_zhao_id = (SELECT id FROM users WHERE username = 'parent_zhao');

-- ========================================
-- 1. 插入教师详情
-- ========================================

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES 
(100001, @teacher_zhang_id, '数学', '北京大学数学系硕士', '15 年高中数学教学经验，擅长高考冲刺辅导', '代数、几何、微积分', '周一至周五晚上，周末全天', 0),
(100002, @teacher_li_id, '英语', '上海外国语大学英语系博士', '12 年英语教学经验，雅思托福资深讲师', '英语口语、写作、考试辅导', '周二至周六下午', 0),
(100003, @teacher_wang_id, '语文', '北京师范大学中文系硕士', '18 年语文教学经验，专注作文和阅读理解', '古诗文、现代文阅读、作文', '周一、三、五晚上，周日全天', 0);

-- ========================================
-- 2. 插入学生详情
-- ========================================

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES 
(200001, @student_ming_id, 15, '初三', '北京市第一中学', '北京市海淀区中关村小区 1 栋', '需要加强数学和英语学习', '性格开朗，学习积极', 0),
(200002, @student_hua_id, 14, '初二', '上海市实验中学', '上海市浦东新区世纪小区 2 栋', '需要提高英语口语和写作能力', '性格内向，需要鼓励', 0),
(200003, @student_gang_id, 16, '高一', '广州市育才中学', '广州市天河区天河小区 3 栋', '需要语文作文辅导和数学提高', '活泼好动，注意力需要集中', 0),
(200004, @student_fang_id, 13, '初一', '深圳市南山外国语学校', '深圳市南山区科技园小区 4 栋', '全科辅导，特别是英语基础', '文静乖巧，学习认真', 0),
(200005, @student_jun_id, 15, '初三', '杭州市第二中学', '杭州市西湖区文一路小区 5 栋', '需要数学和物理竞赛辅导', '聪明好学，有竞赛天赋', 0);

-- ========================================
-- 3. 插入家长详情
-- ========================================

INSERT INTO parents (id, user_id, deleted)
VALUES 
(300001, @parent_chen_id, 0),
(300002, @parent_liu_id, 0),
(300003, @parent_zhao_id, 0);

-- ========================================
-- 4. 插入家长 - 学生关系
-- ========================================

SET @parent_chen_rel_id = (SELECT id FROM parents WHERE user_id = @parent_chen_id);
SET @parent_liu_rel_id = (SELECT id FROM parents WHERE user_id = @parent_liu_id);
SET @parent_zhao_rel_id = (SELECT id FROM parents WHERE user_id = @parent_zhao_id);

SET @student_ming_rel_id = (SELECT id FROM students WHERE user_id = @student_ming_id);
SET @student_hua_rel_id = (SELECT id FROM students WHERE user_id = @student_hua_id);
SET @student_gang_rel_id = (SELECT id FROM students WHERE user_id = @student_gang_id);
SET @student_fang_rel_id = (SELECT id FROM students WHERE user_id = @student_fang_id);
SET @student_jun_rel_id = (SELECT id FROM students WHERE user_id = @student_jun_id);

INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES 
(400001, @parent_chen_rel_id, @student_ming_rel_id, '父子', NOW(), 0),
(400002, @parent_liu_rel_id, @student_hua_rel_id, '母子', NOW(), 0),
(400003, @parent_liu_rel_id, @student_fang_rel_id, '母女', NOW(), 0),
(400004, @parent_zhao_rel_id, @student_gang_rel_id, '父子', NOW(), 0),
(400005, @parent_zhao_rel_id, @student_jun_rel_id, '父子', NOW(), 0);

-- ========================================
-- 5. 验证数据
-- ========================================

SELECT '=== 教师列表 ===' AS '';
SELECT u.username, u.name, t.subject, t.education, t.experience
FROM users u
JOIN teachers t ON u.id = t.user_id
WHERE u.username LIKE 'teacher_%';

SELECT '' AS '';
SELECT '=== 学生列表 ===' AS '';
SELECT u.username, u.name, s.age, s.grade, s.school, s.learning_needs
FROM users u
JOIN students s ON u.id = s.user_id
WHERE u.username LIKE 'student_%';

SELECT '' AS '';
SELECT '=== 家长列表 ===' AS '';
SELECT u.username, u.name, p.id AS parent_id
FROM users u
JOIN parents p ON u.id = p.user_id
WHERE u.username LIKE 'parent_%';

SELECT '' AS '';
SELECT '=== 家长 - 学生关系 ===' AS '';
SELECT pu.username AS parent_username, pu.name AS parent_name, 
       psr.relationship,
       su.username AS student_username, su.name AS student_name
FROM parent_student_relations psr
JOIN parents p ON psr.parent_id = p.id
JOIN students s ON psr.student_id = s.id
JOIN users pu ON p.user_id = pu.id
JOIN users su ON s.user_id = su.id;
