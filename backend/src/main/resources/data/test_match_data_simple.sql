-- ============================================
-- 师生匹配系统 - 简化测试数据脚本
-- 只插入匹配记录，假设已有用户/教师/学生数据
-- ============================================

-- 先查看现有表结构
-- SHOW CREATE TABLE teacher_student_matches;

-- 插入测试匹配记录（使用现有的用户 ID）
-- 状态码：0-待确认，1-待家长确认，2-已匹配，3-已拒绝

-- 先清空现有测试数据（如果需要）
-- DELETE FROM teacher_student_matches WHERE id >= 2041436800000000001;

-- 插入 12 条测试数据
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, 
    status, request_message, 
    student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES
-- 状态 2：已匹配（成功）- 5 条
(2041436800000000001, 2041436613062017026, 2041436600118394881, 'student', 
 2, 'Hope to improve math', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 0),

(2041436800000000002, 2041436613062017027, 2041436600118394882, 'student', 
 2, 'Want to improve English', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),

(2041436800000000003, 2041436613062017028, 2041436600118394883, 'teacher', 
 2, 'Physics is important', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0),

(2041436800000000004, 2041436613062017029, 2041436600118394881, 'teacher', 
 2, 'Math foundation', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),

(2041436800000000005, 2041436613062017030, 2041436600118394882, 'student', 
 2, 'English learning', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

-- 状态 0：待确认 - 3 条
(2041436800000000006, 2041436613062017026, 2041436600118394882, 'student', 
 0, 'Also want English', 
 1, 0, 0, 
 DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),

(2041436800000000007, 2041436613062017027, 2041436600118394881, 'teacher', 
 0, 'Math needs improvement', 
 0, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

(2041436800000000008, 2041436613062017028, 2041436600118394882, 'student', 
 0, 'Interested in English', 
 1, 0, 0, 
 NOW(), NOW(), 0),

-- 状态 1：待家长确认 - 2 条
(2041436800000000009, 2041436613062017029, 2041436600118394883, 'teacher', 
 1, 'Physics experiments', 
 1, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

(2041436800000000010, 2041436613062017030, 2041436600118394883, 'student', 
 1, 'Want to learn physics', 
 1, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 0),

-- 状态 3：已拒绝 - 2 条
(2041436800000000011, 2041436613062017026, 2041436600118394883, 'teacher', 
 3, 'Physics training', 
 2, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),

(2041436800000000012, 2041436613062017027, 2041436600118394883, 'student', 
 3, 'Want physics', 
 1, 2, 0, 
 DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0);

-- 验证插入结果
SELECT 'Insert completed!' AS result;

-- 查看统计数据
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;
