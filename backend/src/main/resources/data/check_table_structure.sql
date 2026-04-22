-- ============================================
-- 检查数据库表结构
-- ============================================

-- 查看所有表
SHOW TABLES;

-- 查看匹配表结构
DESC teacher_student_matches;

-- 查看用户表结构
DESC users;

-- 查看是否有 teacher 表
-- SHOW TABLES LIKE 'teacher%';

-- 查看是否有 student 表
-- SHOW TABLES LIKE 'student%';

-- 查看现有匹配记录数
SELECT COUNT(*) AS current_matches FROM teacher_student_matches;

-- 查看现有用户数
SELECT COUNT(*) AS total_users FROM users;

-- 查看角色分布
SELECT role, COUNT(*) AS count FROM users GROUP BY role;
