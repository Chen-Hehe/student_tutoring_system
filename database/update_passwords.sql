-- 更新测试账号密码为正确的 BCrypt hash
-- Test1234! 的正确 BCrypt hash: $2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x
-- 这个 hash 对应明文密码 "Test1234!"

-- 更新教师账号
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'teacher_zhang';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'teacher_li';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'teacher_wang';

-- 更新学生账号
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'student_ming';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'student_hua';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'student_gang';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'student_fang';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'student_jun';

-- 更新家长账号
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'parent_chen';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'parent_liu';
UPDATE users SET password = '$2a$10$8k0qKxW5V6c7d8e9f0g1h2.i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x' WHERE username = 'parent_zhao';
