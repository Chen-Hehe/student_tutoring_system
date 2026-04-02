-- 乡村助学平台数据库 schema
-- 数据库：tutoring
-- 字符集：utf8mb4

CREATE DATABASE IF NOT EXISTS tutoring DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tutoring;

-- 1. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    role TINYINT NOT NULL COMMENT '角色 (1:教师，2:学生，3:家长，4:管理员)',
    name VARCHAR(50) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '电话',
    gender TINYINT COMMENT '性别 (0:女，1:男)',
    birth_date DATETIME COMMENT '出生日期',
    qq VARCHAR(20) COMMENT 'QQ 号',
    wechat VARCHAR(50) COMMENT '微信',
    address VARCHAR(255) COMMENT '地址',
    avatar VARCHAR(255) COMMENT '头像',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 学生表 (students)
CREATE TABLE IF NOT EXISTS students (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    user_id BIGINT NOT NULL UNIQUE COMMENT '关联用户表',
    age TINYINT COMMENT '年龄',
    grade VARCHAR(20) COMMENT '年级',
    school VARCHAR(100) COMMENT '学校',
    address VARCHAR(255) COMMENT '地址',
    learning_needs TEXT COMMENT '学习需求',
    psychological_status TEXT COMMENT '心理状态',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生表';

-- 3. 教师表 (teachers)
CREATE TABLE IF NOT EXISTS teachers (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    user_id BIGINT NOT NULL UNIQUE COMMENT '关联用户表',
    subject VARCHAR(50) COMMENT '教授科目',
    education VARCHAR(100) COMMENT '教育背景',
    experience TEXT COMMENT '教学经验',
    specialties VARCHAR(255) COMMENT '专长',
    availability VARCHAR(255) COMMENT '可用时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教师表';

-- 4. 家长表 (parents)
CREATE TABLE IF NOT EXISTS parents (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    user_id BIGINT NOT NULL UNIQUE COMMENT '关联用户表',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家长表';

-- 5. 家长学生关联表 (parent_student_relations)
CREATE TABLE IF NOT EXISTS parent_student_relations (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    parent_id BIGINT NOT NULL COMMENT '家长 ID',
    student_id BIGINT NOT NULL COMMENT '学生 ID',
    relationship VARCHAR(20) COMMENT '关系（如：父亲、母亲、爷爷等）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '绑定时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_student_id (student_id),
    UNIQUE KEY uk_parent_student (parent_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家长学生关联表';

-- 6. 聊天记录表 (chat_records)
CREATE TABLE IF NOT EXISTS chat_records (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    sender_id BIGINT NOT NULL COMMENT '发送者 ID',
    receiver_id BIGINT NOT NULL COMMENT '接收者 ID',
    message TEXT COMMENT '消息内容',
    type TINYINT NOT NULL COMMENT '类型 (1:文字，2:图片，3:语音)',
    file_url VARCHAR(500) COMMENT '存储图片或语音的 OSS 链接',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
    is_read TINYINT DEFAULT 0 COMMENT '已读状态 (0:未读，1:已读)',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天记录表';

-- 7. 学习资源表 (learning_resources)
CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    type VARCHAR(20) COMMENT '类型（文档/视频/音频）',
    url VARCHAR(500) NOT NULL COMMENT '资源链接',
    uploader_id BIGINT NOT NULL COMMENT '上传者 ID',
    category VARCHAR(50) COMMENT '分类',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习资源表';

-- 8. 心理评估表 (psychological_assessments)
CREATE TABLE IF NOT EXISTS psychological_assessments (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    student_id BIGINT NOT NULL COMMENT '学生 ID',
    assessor_id BIGINT NOT NULL COMMENT '评估者 ID',
    assessment_date DATETIME NOT NULL COMMENT '评估日期',
    score INT COMMENT '评估分数',
    comments TEXT COMMENT '评估意见',
    recommendations TEXT COMMENT '建议',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_student_id (student_id),
    INDEX idx_assessment_date (assessment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='心理评估表';

-- 9. AI 匹配记录表 (ai_matches)
CREATE TABLE IF NOT EXISTS ai_matches (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    student_id BIGINT NOT NULL COMMENT '学生 ID',
    teacher_id BIGINT NOT NULL COMMENT '教师 ID',
    match_score DOUBLE COMMENT '匹配分数',
    match_reason TEXT COMMENT '匹配原因',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    INDEX idx_student_id (student_id),
    INDEX idx_teacher_id (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 匹配记录表';

-- 10. 师生匹配表 (teacher_student_matches)
CREATE TABLE IF NOT EXISTS teacher_student_matches (
    id BIGINT PRIMARY KEY COMMENT '主键 (雪花算法)',
    student_id BIGINT NOT NULL COMMENT '学生 ID',
    teacher_id BIGINT NOT NULL COMMENT '教师 ID',
    requester_type VARCHAR(20) NOT NULL COMMENT '请求发起方（student/teacher）',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态 (0:待确认，1:待家长确认，2:已匹配，3:已拒绝)',
    request_message TEXT COMMENT '请求消息',
    student_confirm TINYINT DEFAULT 0 COMMENT '学生确认 (0:未操作，1:已同意，2:已拒绝)',
    parent_confirm TINYINT DEFAULT 0 COMMENT '家长确认 (0:未操作，1:已同意，2:已拒绝)',
    teacher_confirm TINYINT DEFAULT 0 COMMENT '教师确认 (0:未操作，1:已同意，2:已拒绝)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 (0:未删除，1:已删除)',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    INDEX idx_student_id (student_id),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='师生匹配表';
