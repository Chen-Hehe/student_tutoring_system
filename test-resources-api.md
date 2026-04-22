# 教学资源 API 调试

**时间：** 2026-04-23 00:33

## 问题诊断

### 前端错误
```
加载资源列表失败：Error: 获取资源列表失败：null
```

### 可能原因
1. 后端没有正确响应
2. 数据库表不存在
3. Service 层返回 null

## 测试步骤

### 1. 检查后端日志

在后端控制台查看是否有以下日志：
```
GET /api/resources/list
```

### 2. 直接访问 API

浏览器访问：
```
http://localhost:8080/api/resources/list
```

**预期响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": []
}
```

### 3. 检查数据库表

```sql
USE tutoring;

-- 检查表是否存在
SHOW TABLES LIKE 'learning_resources';

-- 如果不存在，创建表
CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '资源标题',
    description TEXT COMMENT '资源描述',
    type VARCHAR(50) NOT NULL COMMENT '资源类型：document/video/audio/other',
    url VARCHAR(500) NOT NULL COMMENT '文件存储路径',
    uploader_id BIGINT NOT NULL COMMENT '上传者 ID',
    category VARCHAR(100) COMMENT '分类：数学/语文/英语等',
    file_size BIGINT COMMENT '文件大小（字节）',
    file_name VARCHAR(200) COMMENT '原始文件名',
    download_count INT DEFAULT 0 COMMENT '下载次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_category (category)
);
```

### 4. 检查前端 Network

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 刷新页面
4. 找到 `/api/resources/list` 请求
5. 查看 Response 内容

**可能的响应：**
- `403 Forbidden` - Security 配置问题
- `404 Not Found` - 接口路径错误
- `500 Internal Server Error` - 后端代码错误
- 空响应 - 后端没有正确返回

## 快速修复

如果数据库表不存在，执行以下 SQL：

```sql
USE tutoring;

CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    uploader_id BIGINT NOT NULL,
    category VARCHAR(100),
    file_size BIGINT,
    file_name VARCHAR(200),
    download_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习资源表';
```
