-- 乡村助学平台数据库脚本
-- MySQL版本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS rural_education_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rural_education_platform;

-- 用户表（包含所有角色）
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('teacher', 'student', 'parent', 'admin') NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 教师信息表
CREATE TABLE IF NOT EXISTS teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    education VARCHAR(50),
    experience VARCHAR(255),
    introduction TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 学生信息表
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    grade VARCHAR(20) NOT NULL,
    school VARCHAR(100),
    address VARCHAR(255),
    parent_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 家长信息表
CREATE TABLE IF NOT EXISTS parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    relation VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 师生匹配表
CREATE TABLE IF NOT EXISTS teacher_student_matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'active', 'completed') DEFAULT 'pending',
    request_from ENUM('teacher', 'student') NOT NULL,
    request_message TEXT,
    parent_approval BOOLEAN DEFAULT FALSE,
    matched_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    match_id INT,
    content TEXT NOT NULL,
    status ENUM('sent', 'read') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES teacher_student_matches(id) ON DELETE SET NULL
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 心理状态表
CREATE TABLE IF NOT EXISTS psychological_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    assessment_date DATE NOT NULL,
    emotional_state ENUM('excellent', 'good', 'normal', 'poor', 'critical') DEFAULT 'normal',
    anxiety_level INT DEFAULT 0,
    depression_level INT DEFAULT 0,
    counselor_notes TEXT,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 教学资源表
CREATE TABLE IF NOT EXISTS teaching_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    resource_type ENUM('courseware', 'lesson_plan', 'exercise', 'video', 'other') NOT NULL,
    file_path VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 资源分享表
CREATE TABLE IF NOT EXISTS resource_shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT NOT NULL,
    student_id INT NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES teaching_resources(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- AI匹配推荐表
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    recommended_teacher_id INT NOT NULL,
    match_score DECIMAL(5,2) NOT NULL,
    reason TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 插入示例数据
-- 管理员用户
INSERT INTO users (username, password, role, name, phone, email) VALUES
('admin', 'admin123', 'admin', '管理员', '13800138000', 'admin@example.com');

-- 教师用户
INSERT INTO users (username, password, role, name, phone, email) VALUES
('teacher1', 'teacher123', 'teacher', '王老师', '13900139001', 'teacher1@example.com'),
('teacher2', 'teacher123', 'teacher', '李老师', '13900139002', 'teacher2@example.com');

-- 家长用户
INSERT INTO users (username, password, role, name, phone, email) VALUES
('parent1', 'parent123', 'parent', '张三爸爸', '13700137001', 'parent1@example.com'),
('parent2', 'parent123', 'parent', '李四妈妈', '13700137002', 'parent2@example.com');

-- 学生用户
INSERT INTO users (username, password, role, name, phone, email) VALUES
('student1', 'student123', 'student', '张三', '13600136001', 'student1@example.com'),
('student2', 'student123', 'student', '李四', '13600136002', 'student2@example.com');

-- 教师信息
INSERT INTO teachers (user_id, subject, education, experience, introduction) VALUES
(2, '数学', '本科', '5年教学经验', '擅长小学数学教学，注重基础培养'),
(3, '语文', '硕士', '8年教学经验', '专注于阅读和写作能力提升');

-- 家长信息
INSERT INTO parents (user_id, relation) VALUES
(4, '父亲'),
(5, '母亲');

-- 学生信息
INSERT INTO students (user_id, grade, school, address, parent_id) VALUES
(6, '三年级', '希望小学', '乡村1组', 4),
(7, '五年级', '光明小学', '乡村2组', 5);

-- 学习进度
INSERT INTO learning_progress (student_id, subject, progress) VALUES
(1, '数学', 65.5),
(1, '语文', 72.0),
(2, '数学', 58.0),
(2, '语文', 80.5);

-- 心理状态
INSERT INTO psychological_status (student_id, assessment_date, emotional_state, anxiety_level, depression_level, counselor_notes) VALUES
(1, '2026-03-20', 'good', 1, 0, '状态良好，积极向上'),
(2, '2026-03-22', 'normal', 2, 1, '偶尔有焦虑情绪，需要关注');

-- 教学资源
INSERT INTO teaching_resources (teacher_id, title, description, resource_type, file_path) VALUES
(1, '三年级数学上册课件', '包含第一单元知识点', 'courseware', '/resources/courseware/math3_1.pptx'),
(2, '五年级语文阅读技巧', '提高阅读理解能力', 'lesson_plan', '/resources/lesson_plan/chinese5_reading.pdf');

-- AI推荐
INSERT INTO ai_recommendations (student_id, recommended_teacher_id, match_score, reason) VALUES
(1, 1, 92.5, '学生数学成绩需要提升，教师擅长小学数学教学'),
(2, 2, 88.0, '学生语文基础较好，教师专注于阅读和写作能力提升');

-- 创建索引
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_teacher_student_matches_status ON teacher_student_matches(status);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_learning_progress_student_id ON learning_progress(student_id);
CREATE INDEX idx_psychological_status_student_id ON psychological_status(student_id);
CREATE INDEX idx_teaching_resources_teacher_id ON teaching_resources(teacher_id);
CREATE INDEX idx_ai_recommendations_student_id ON ai_recommendations(student_id);

-- 查看创建的表
SHOW TABLES;

-- 查看表结构
DESCRIBE users;
DESCRIBE teachers;
DESCRIBE students;
DESCRIBE parents;
DESCRIBE teacher_student_matches;
DESCRIBE messages;
DESCRIBE learning_progress;
DESCRIBE psychological_status;
DESCRIBE teaching_resources;
DESCRIBE resource_shares;
DESCRIBE ai_recommendations;