USE tutoring;

-- 学习报告表
CREATE TABLE IF NOT EXISTS learning_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    report_period VARCHAR(50) NOT NULL,
    overall VARCHAR(20) NOT NULL,
    rank VARCHAR(20) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 成绩记录表
CREATE TABLE IF NOT EXISTS grade_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_id BIGINT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (report_id) REFERENCES learning_reports(id) ON DELETE CASCADE
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_id BIGINT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    progress INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (report_id) REFERENCES learning_reports(id) ON DELETE CASCADE
);

-- 插入测试数据
-- 为小明创建学习报告
INSERT INTO learning_reports (student_id, report_period, overall, rank, comment) VALUES
(3001, '2026年3月', '优秀', '第5名', '小明在本学习期间表现优秀，特别是在数学方面有很大进步。他上课认真听讲，积极参与课堂讨论，作业完成质量高。建议继续保持这种学习态度，在语文阅读理解方面可以多加强练习，提高阅读速度和理解能力。总体来说，小明是一个很有潜力的学生，只要继续努力，成绩会更上一层楼。');

-- 为小明添加成绩记录
SET @report_id = LAST_INSERT_ID();
INSERT INTO grade_records (report_id, subject, grade) VALUES
(@report_id, '数学', 92),
(@report_id, '语文', 88),
(@report_id, '英语', 90);

-- 为小明添加学习进度
INSERT INTO learning_progress (report_id, subject, progress) VALUES
(@report_id, '数学', 85),
(@report_id, '语文', 78),
(@report_id, '英语', 90);

-- 为小红创建学习报告
INSERT INTO learning_reports (student_id, report_period, overall, rank, comment) VALUES
(3002, '2026年3月', '良好', '第8名', '小红在本学习期间表现良好，尤其是在语文方面有显著进步。她上课认真，作业完成及时，但是在数学方面还需要加强练习。建议在家多做一些数学练习题，提高计算能力和解题技巧。总体来说，小红是一个勤奋的学生，只要继续努力，成绩会有更大的提升。');

-- 为小红添加成绩记录
SET @report_id = LAST_INSERT_ID();
INSERT INTO grade_records (report_id, subject, grade) VALUES
(@report_id, '数学', 85),
(@report_id, '语文', 92),
(@report_id, '英语', 88);

-- 为小红添加学习进度
INSERT INTO learning_progress (report_id, subject, progress) VALUES
(@report_id, '数学', 75),
(@report_id, '语文', 85),
(@report_id, '英语', 80);
