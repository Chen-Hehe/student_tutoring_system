-- 修正版测试数据导入脚本
-- 所有账号密码均为：Test1234! (BCrypt 加密后的哈希值)

USE tutoring;

-- BCrypt 哈希值 (密码：Test1234!)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- ========================================
-- 1. 创建教师账号 (3 个)
-- ========================================

-- 教师 1: 张老师 (数学)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (1001, 'teacher_zhang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '张明华', 'zhang_math@example.com', '13800138001', 1, '1985-06-15 00:00:00', '123456001', 'zhang_math', '北京市海淀区中关村大街 1 号', NULL, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2001, 1001, '数学', '北京大学数学系硕士', '15 年高中数学教学经验，擅长高考冲刺辅导', '代数、几何、微积分', '周一至周五晚上，周末全天', 0);

-- 教师 2: 李老师 (英语)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (1002, 'teacher_li', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '李雅文', 'li_english@example.com', '13800138002', 0, '1988-03-22 00:00:00', '123456002', 'li_english', '上海市浦东新区世纪大道 100 号', NULL, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2002, 1002, '英语', '上海外国语大学英语系博士', '12 年英语教学经验，雅思托福资深讲师', '英语口语、写作、考试辅导', '周二至周六下午', 0);

-- 教师 3: 王老师 (语文)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (1003, 'teacher_wang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '王晓文', 'wang_chinese@example.com', '13800138003', 1, '1982-09-10 00:00:00', '123456003', 'wang_chinese', '广州市天河区天河路 200 号', NULL, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2003, 1003, '语文', '北京师范大学中文系硕士', '18 年语文教学经验，专注作文和阅读理解', '古诗文、现代文阅读、作文', '周一、三、五晚上，周日全天', 0);

-- ========================================
-- 2. 创建学生账号 (5 个)
-- ========================================

-- 学生 1: 小明
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (2001, 'student_ming', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '陈明', 'ming_student@example.com', '13900139001', 1, '2010-05-20 00:00:00', '234567001', 'ming_student', '北京市海淀区中关村小区 1 栋', NULL, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3001, 2001, 15, '初三', '北京市第一中学', '北京市海淀区中关村小区 1 栋', '需要加强数学和英语学习', '性格开朗，学习积极', 0);

-- 学生 2: 小华
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (2002, 'student_hua', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '李华', 'hua_student@example.com', '13900139002', 0, '2011-08-15 00:00:00', '234567002', 'hua_student', '上海市浦东新区世纪小区 2 栋', NULL, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3002, 2002, 14, '初二', '上海市实验中学', '上海市浦东新区世纪小区 2 栋', '需要提高英语口语和写作能力', '性格内向，需要鼓励', 0);

-- 学生 3: 小刚
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (2003, 'student_gang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '王刚', 'gang_student@example.com', '13900139003', 1, '2009-12-05 00:00:00', '234567003', 'gang_student', '广州市天河区天河小区 3 栋', NULL, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3003, 2003, 16, '高一', '广州市育才中学', '广州市天河区天河小区 3 栋', '需要语文作文辅导和数学提高', '活泼好动，注意力需要集中', 0);

-- 学生 4: 小芳
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (2004, 'student_fang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '刘芳', 'fang_student@example.com', '13900139004', 0, '2012-02-28 00:00:00', '234567004', 'fang_student', '深圳市南山区科技园小区 4 栋', NULL, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3004, 2004, 13, '初一', '深圳市南山外国语学校', '深圳市南山区科技园小区 4 栋', '全科辅导，特别是英语基础', '文静乖巧，学习认真', 0);

-- 学生 5: 小军
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (2005, 'student_jun', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '赵军', 'jun_student@example.com', '13900139005', 1, '2010-11-11 00:00:00', '234567005', 'jun_student', '杭州市西湖区文一路小区 5 栋', NULL, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3005, 2005, 15, '初三', '杭州市第二中学', '杭州市西湖区文一路小区 5 栋', '需要数学和物理竞赛辅导', '聪明好学，有竞赛天赋', 0);

-- ========================================
-- 3. 创建家长账号 (3 个)
-- ========================================

-- 家长 1: 陈爸爸 (学生 1 小明的父亲)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (3001, 'parent_chen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '陈建国', 'chen_parent@example.com', '13700137001', 1, '1978-04-10 00:00:00', '345678001', 'chen_parent', '北京市海淀区中关村小区 1 栋', NULL, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4001, 3001, 0);

-- 家长 2: 刘妈妈 (学生 2 小华和学生 4 小芳的母亲)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (3002, 'parent_liu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '刘美丽', 'liu_parent@example.com', '13700137002', 0, '1980-07-25 00:00:00', '345678002', 'liu_parent', '上海市浦东新区世纪小区 2 栋', NULL, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4002, 3002, 0);

-- 家长 3: 赵爸爸 (学生 3 小刚和学生 5 小军的父亲)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, avatar, created_at, deleted)
VALUES (3003, 'parent_zhao', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '赵志强', 'zhao_parent@example.com', '13700137003', 1, '1976-11-30 00:00:00', '345678003', 'zhao_parent', '广州市天河区天河小区 3 栋', NULL, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4003, 3003, 0);

-- ========================================
-- 4. 创建家长学生关联关系
-- ========================================

-- 陈爸爸 -> 小明 (父子)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5001, 4001, 3001, '父子', NOW(), 0);

-- 刘妈妈 -> 小华 (母子)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5002, 4002, 3002, '母子', NOW(), 0);

-- 刘妈妈 -> 小芳 (母女)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5003, 4002, 3004, '母女', NOW(), 0);

-- 赵爸爸 -> 小刚 (父子)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5004, 4003, 3003, '父子', NOW(), 0);

-- 赵爸爸 -> 小军 (父子)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5005, 4003, 3005, '父子', NOW(), 0);

-- ========================================
-- 5. 创建测试聊天记录 (用于聊天功能测试)
-- ========================================

-- 小明 (2001) 发给 张老师 (1001) 的消息
INSERT INTO chat_records (id, sender_id, receiver_id, message, type, file_url, sent_at, is_read, deleted)
VALUES 
(9001, 2001, 1001, '张老师好！我是小明，我想请教一下数学题。', 1, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 0),
(9002, 1001, 2001, '你好小明！什么问题？发给我看看。', 1, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 0),
(9003, 2001, 1001, '就是这道二次函数的题目，我不太理解。', 1, NULL, DATE_SUB(NOW(), INTERVAL 23 HOUR), 1, 0),
(9004, 1001, 2001, '好的，这题的关键是找到顶点坐标。你先说说你的思路。', 1, NULL, DATE_SUB(NOW(), INTERVAL 23 HOUR), 1, 0),
(9005, 2001, 1001, '我觉得应该用配方法，但是配方后不知道怎么继续。', 1, NULL, DATE_SUB(NOW(), INTERVAL 22 HOUR), 0, 0);

-- 小华 (2002) 发给 李老师 (1002) 的消息
INSERT INTO chat_records (id, sender_id, receiver_id, message, type, file_url, sent_at, is_read, deleted)
VALUES 
(9006, 2002, 1002, '李老师，我想练习英语口语，有什么建议吗？', 1, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1, 0),
(9007, 1002, 1002, '很好的想法！建议每天坚持朗读，可以找一些英文材料。', 1, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1, 0),
(9008, 2002, 1002, '谢谢老师！我会努力的。', 1, NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0, 0);

-- 小刚 (2003) 发给 王老师 (1003) 的消息
INSERT INTO chat_records (id, sender_id, receiver_id, message, type, file_url, sent_at, is_read, deleted)
VALUES 
(9009, 2003, 1003, '王老师，作文怎么写好开头啊？', 1, NULL, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 0, 0);

-- ========================================
-- 验证数据
-- ========================================

SELECT '===== 用户账号 =====' AS '';
SELECT 
    u.id,
    u.username,
    CASE u.role 
        WHEN 1 THEN '教师'
        WHEN 2 THEN '学生'
        WHEN 3 THEN '家长'
        WHEN 4 THEN '管理员'
    END AS role_name,
    u.name,
    u.email
FROM users u
WHERE u.id >= 1001 AND u.id <= 3003
ORDER BY u.role, u.id;

SELECT '' AS '';
SELECT '===== 聊天记录 =====' AS '';
SELECT 
    cr.id,
    cr.sender_id,
    cr.receiver_id,
    LEFT(cr.message, 50) AS message_preview,
    cr.type,
    cr.is_read,
    cr.sent_at
FROM chat_records cr
WHERE cr.id >= 9001
ORDER BY cr.sent_at DESC;
