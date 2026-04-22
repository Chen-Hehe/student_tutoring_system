-- ============================================
-- 快速插入测试数据（简化版）
-- 直接执行此脚本即可
-- ============================================

-- 获取第一个教师和第一个学生的 ID
SET @t1 = (SELECT id FROM users WHERE role = 1 LIMIT 1);
SET @t2 = (SELECT id FROM users WHERE role = 1 LIMIT 1 OFFSET 1);
SET @s1 = (SELECT id FROM users WHERE role = 2 LIMIT 1);
SET @s2 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 1);
SET @s3 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 2);

-- 插入 5 条成功匹配 (status=2)
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted)
VALUES 
(2041436800000000001, @s1, @t1, 'student', 2, 'Math help', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000002, @s2, @t2, 'student', 2, 'English help', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000003, @s3, @t1, 'teacher', 2, 'Physics help', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000004, @s1, @t2, 'teacher', 2, 'Science help', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000005, @s2, @t1, 'student', 2, 'Chemistry help', 1, 1, 1, NOW(), NOW(), 0);

-- 插入 3 条待确认 (status=0)
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted)
VALUES 
(2041436800000000006, @s3, @t2, 'student', 0, 'Bio help', 1, 0, 0, NOW(), NOW(), 0),
(2041436800000000007, @s1, @t1, 'teacher', 0, 'Geo help', 0, 1, 0, NOW(), NOW(), 0),
(2041436800000000008, @s2, @t2, 'student', 0, 'Hist help', 1, 0, 0, NOW(), NOW(), 0);

-- 插入 2 条待家长确认 (status=1)
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted)
VALUES 
(2041436800000000009, @s3, @t1, 'teacher', 1, 'Art help', 1, 1, 0, NOW(), NOW(), 0),
(2041436800000000010, @s1, @t2, 'student', 1, 'Music help', 1, 1, 0, NOW(), NOW(), 0);

-- 插入 2 条已拒绝 (status=3)
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted)
VALUES 
(2041436800000000011, @s2, @t1, 'teacher', 3, 'PE help', 2, 1, 0, NOW(), NOW(), 0),
(2041436800000000012, @s3, @t2, 'student', 3, 'Comp help', 1, 2, 0, NOW(), NOW(), 0);

-- 验证结果
SELECT '=== Test Data Inserted! ===' AS status;
SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN status=2 THEN 1 ELSE 0 END) AS success,
    SUM(CASE WHEN status IN (0,1) THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status=3 THEN 1 ELSE 0 END) AS rejected,
    CONCAT(ROUND(SUM(CASE WHEN status=2 THEN 1 ELSE 0 END)*100.0/COUNT(*),2),'%') AS rate
FROM teacher_student_matches
WHERE deleted=0;
