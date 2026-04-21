-- 创建教师沟通记录表
CREATE TABLE IF NOT EXISTS teacher_communications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    send_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 插入测试数据
-- 陈老师与王家长的沟通记录
INSERT INTO teacher_communications (parent_id, teacher_id, student_id, sender, content, send_time) VALUES
(1001, 1001, 3001, '陈老师', '您好，王家长！小明最近在数学学习上有很大进步，尤其是在应用题方面。建议在家多练习一些实际生活中的数学问题，帮助他巩固所学知识。', '2026-03-30 10:00:00'),
(1001, 1001, 3001, '王家长', '谢谢陈老师的反馈！我们会按照您的建议，在家多帮助小明练习数学应用题。请问小明在课堂上的表现如何？', '2026-03-30 10:30:00'),
(1001, 1001, 3001, '陈老师', '小明在课堂上表现很积极，经常主动回答问题，而且作业完成质量也很好。他是个很有潜力的学生，只要继续保持，数学成绩会越来越好的。', '2026-03-30 11:00:00');

-- 张老师与王家长的沟通记录
INSERT INTO teacher_communications (parent_id, teacher_id, student_id, sender, content, send_time) VALUES
(1001, 1002, 3002, '张老师', '您好，王家长！小红最近在语文学习上有很大进步，尤其是在作文方面。建议在家多阅读一些经典文学作品，帮助她提高写作水平。', '2026-03-29 14:00:00'),
(1001, 1002, 3002, '王家长', '谢谢张老师的反馈！我们会按照您的建议，在家多帮助小红阅读文学作品。请问小红在课堂上的表现如何？', '2026-03-29 14:30:00'),
(1001, 1002, 3002, '张老师', '小红在课堂上表现很认真，总是认真听讲并做好笔记。她的作文进步很大，特别是在描写方面，已经能够生动地描述事物和场景了。', '2026-03-29 15:00:00');
