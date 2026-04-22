-- 为 chat_records 表添加消息撤回相关字段
-- 执行时间：2026-04-22

-- 添加撤回时间字段
ALTER TABLE chat_records 
ADD COLUMN recalled_at DATETIME DEFAULT NULL COMMENT '消息撤回时间';

-- 添加撤回者 ID 字段（记录是谁撤回的）
ALTER TABLE chat_records 
ADD COLUMN recalled_by BIGINT DEFAULT NULL COMMENT '撤回者 ID';

-- 添加索引以优化查询
ALTER TABLE chat_records 
ADD INDEX idx_recalled_at (recalled_at);

-- 查看修改后的表结构
DESC chat_records;
