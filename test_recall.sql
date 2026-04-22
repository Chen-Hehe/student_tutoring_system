-- ====================================
-- 消息撤回功能测试 SQL 脚本
-- 执行时间：2026-04-22
-- ====================================

USE tutoring;

-- 1. 检查表结构
SELECT '=== 步骤 1: 检查表结构 ===' AS step;
DESC chat_records;

-- 2. 查看最新消息（撤回前）
SELECT '=== 步骤 2: 最新消息（撤回前）===' AS step;
SELECT 
    id, 
    sender_id, 
    receiver_id, 
    LEFT(message, 50) AS message_preview,
    sent_at, 
    recalled_at, 
    recalled_by 
FROM chat_records 
ORDER BY id DESC 
LIMIT 5;

-- 3. 测试手动撤回（替换 ID 为实际消息 ID）
SELECT '=== 步骤 3: 测试手动撤回（修改下面的 ID）===' AS step;

-- 设置要撤回的消息 ID
SET @test_message_id = 789;  -- ⚠️ 修改这里的 ID
SET @test_user_id = 123456;   -- ⚠️ 修改这里的用户 ID

-- 查看该消息当前状态
SELECT '--- 撤回前状态 ---' AS status;
SELECT 
    id, 
    sender_id, 
    LEFT(message, 50) AS message,
    sent_at,
    TIMESTAMPDIFF(MINUTE, sent_at, NOW()) AS minutes_ago,
    recalled_at, 
    recalled_by 
FROM chat_records 
WHERE id = @test_message_id;

-- 执行撤回
UPDATE chat_records 
SET recalled_at = NOW(), recalled_by = @test_user_id 
WHERE id = @test_message_id 
  AND sender_id = @test_user_id 
  AND recalled_at IS NULL;

-- 查看撤回后状态
SELECT '--- 撤回后状态 ---' AS status;
SELECT 
    id, 
    sender_id, 
    LEFT(message, 50) AS message,
    sent_at,
    recalled_at, 
    recalled_by,
    CASE 
        WHEN recalled_at IS NOT NULL THEN '已撤回'
        ELSE '未撤回'
    END AS recall_status
FROM chat_records 
WHERE id = @test_message_id;

-- 4. 清除 Redis 缓存（需要在 Redis CLI 执行）
SELECT '=== 步骤 4: 清除 Redis 缓存 ===' AS step;
SELECT '在命令行执行：redis-cli KEYS "chat:history:*" | xargs redis-cli DEL' AS command;

-- 5. 验证缓存键
SELECT '=== 步骤 5: 检查 Redis 缓存键（可选）===' AS step;
SELECT '聊天记录缓存键格式：chat:history:{user1_id}:{user2_id}' AS key_format;

-- ====================================
-- 使用说明：
-- 1. 修改 @test_message_id 和 @test_user_id 为实际值
-- 2. 执行整个脚本
-- 3. 检查步骤 3 的输出，确认 recalled_at 有值
-- 4. 刷新前端页面，消息应显示为"已撤回"
-- ====================================
