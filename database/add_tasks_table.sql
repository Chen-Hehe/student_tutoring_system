-- 删除任务表（如果存在）
DROP TABLE IF EXISTS tasks;

-- 创建任务表
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 添加示例数据
INSERT INTO tasks (student_id, title, description, due_date, status) VALUES
(1, '完成数学作业', '完成第三章练习', '2026-04-01 23:59:59', 'pending'),
(1, '阅读英语课文', '阅读Unit 5课文', '2026-03-30 23:59:59', 'completed'),
(1, '参加线上辅导', '数学线上辅导课程', '2026-03-31 14:00:00', 'pending'),
(2, '完成物理实验报告', '提交实验三的报告', '2026-04-02 23:59:59', 'pending'),
(2, '复习历史知识点', '复习近代史重要事件', '2026-03-29 23:59:59', 'completed');