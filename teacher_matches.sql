-- 为 teacher_zhang 添加更多匹配记录
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, request_message, student_confirm, parent_confirm, teacher_confirm, status, created_at, updated_at, deleted) VALUES
(101, 3001, 2001, 'teacher', '数学辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(102, 3002, 2001, 'student', '需要数学辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(103, 3003, 2001, 'teacher', '数学和物理辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(104, 3004, 2001, 'student', '数学基础薄弱', 1, 1, 1, 2, NOW(), NOW(), 0),
(105, 3005, 2001, 'teacher', '中考数学冲刺', 1, 1, 1, 2, NOW(), NOW(), 0);

-- 为其他教师也添加一些匹配记录
INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, request_message, student_confirm, parent_confirm, teacher_confirm, status, created_at, updated_at, deleted) VALUES
(201, 3001, 2002, 'student', '语文辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(202, 3002, 2002, 'teacher', '语文写作辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(301, 3003, 2003, 'student', '英语辅导', 1, 1, 1, 2, NOW(), NOW(), 0),
(302, 3004, 2003, 'teacher', '英语口语练习', 1, 1, 1, 2, NOW(), NOW(), 0);
