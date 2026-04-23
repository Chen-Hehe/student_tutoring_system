-- 先删除现有的表（如果存在）
DROP TABLE IF EXISTS psychological_assessment_details;
DROP TABLE IF EXISTS psychological_assessments;

-- 重新创建psychological_assessments表
CREATE TABLE IF NOT EXISTS psychological_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    assessor_id BIGINT NOT NULL,
    assessment_date DATETIME,
    score INT,
    comments TEXT,
    recommendations TEXT,
    assess_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 创建psychological_assessment_details表
CREATE TABLE IF NOT EXISTS psychological_assessment_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_id BIGINT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,
    percentage INT NOT NULL,
    level VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (assessment_id) REFERENCES psychological_assessments(id) ON DELETE CASCADE
);
