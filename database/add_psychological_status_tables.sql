CREATE TABLE IF NOT EXISTS psychological_statuses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    emotion_status VARCHAR(20) NOT NULL,
    emotion_level VARCHAR(10) NOT NULL,
    emotion_percentage INT NOT NULL,
    social_status VARCHAR(20) NOT NULL,
    social_level VARCHAR(10) NOT NULL,
    social_percentage INT NOT NULL,
    stress_status VARCHAR(20) NOT NULL,
    stress_level VARCHAR(10) NOT NULL,
    stress_percentage INT NOT NULL,
    mental_status VARCHAR(20) NOT NULL,
    mental_level VARCHAR(10) NOT NULL,
    mental_percentage INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS psychological_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    status_id BIGINT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,
    percentage INT NOT NULL,
    level VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (status_id) REFERENCES psychological_statuses(id) ON DELETE CASCADE
);

INSERT INTO psychological_statuses (student_id, emotion_status, emotion_level, emotion_percentage, social_status, social_level, social_percentage, stress_status, stress_level, stress_percentage, mental_status, mental_level, mental_percentage) VALUES
(3001, '良好', 'good', 85, '优秀', 'good', 90, '中等', 'warning', 60, '良好', 'good', 80);

INSERT INTO psychological_assessments (status_id, assessment_type, percentage, level) VALUES
((SELECT id FROM psychological_statuses WHERE student_id = 3001 ORDER BY id DESC LIMIT 1), '情绪稳定性', 85, 'good'),
((SELECT id FROM psychological_statuses WHERE student_id = 3001 ORDER BY id DESC LIMIT 1), '社交互动', 90, 'good'),
((SELECT id FROM psychological_statuses WHERE student_id = 3001 ORDER BY id DESC LIMIT 1), '学习压力', 60, 'warning'),
((SELECT id FROM psychological_statuses WHERE student_id = 3001 ORDER BY id DESC LIMIT 1), '自我认知', 80, 'good');

INSERT INTO psychological_statuses (student_id, emotion_status, emotion_level, emotion_percentage, social_status, social_level, social_percentage, stress_status, stress_level, stress_percentage, mental_status, mental_level, mental_percentage) VALUES
(3002, '良好', 'good', 80, '良好', 'good', 85, '轻度', 'good', 45, '优秀', 'good', 90);

INSERT INTO psychological_assessments (status_id, assessment_type, percentage, level) VALUES
((SELECT id FROM psychological_statuses WHERE student_id = 3002 ORDER BY id DESC LIMIT 1), '情绪稳定性', 80, 'good'),
((SELECT id FROM psychological_statuses WHERE student_id = 3002 ORDER BY id DESC LIMIT 1), '社交互动', 85, 'good'),
((SELECT id FROM psychological_statuses WHERE student_id = 3002 ORDER BY id DESC LIMIT 1), '学习压力', 45, 'good'),
((SELECT id FROM psychological_statuses WHERE student_id = 3002 ORDER BY id DESC LIMIT 1), '自我认知', 88, 'good');
