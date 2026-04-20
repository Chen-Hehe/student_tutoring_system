# 聊天系统重构总结

## 重构目标
统一消息发送链路：**所有消息的发送必须只走 HTTP REST API，WebSocket 仅用于接收后端的实时推送。**

## 修改的文件

### 1. student-frontend/src/pages/Chat.jsx
- ✅ 去除 `wsService.send(messageData)` 调用
- ✅ 只调用 `chatAPI.sendMessage(messageData)`
- ✅ 使用后端返回的真实数据（包含真实 ID 和 timestamp）

### 2. teacher-frontend/src/pages/Chat.jsx
- ✅ 去除 `wsService.send(messageData)` 调用
- ✅ 改为调用 `chatAPI.sendMessage()`
- ✅ 实现乐观更新：生成临时 ID -> 发送 -> 用真实 ID 替换

### 3. backend/ChatRecordService.java
- ✅ 新增 `saveAndPushMessage(ChatMessage)` 方法
- ✅ 该方法负责：保存消息到 DB -> 通过 Redis 推送给接收者
- ✅ 返回包含真实 ID 和 timestamp 的 ChatRecord

### 4. backend/ChatController.java
- ✅ `/api/chat/send` 接口调用 `saveAndPushMessage`
- ✅ 从 Header 获取 `X-User-Id` 作为 senderId
- ✅ 返回包含真实数据库 ID 的消息

### 5. backend/ChatWebSocketHandler.java
- ✅ 移除 `handleTextMessage` 中的消息存储和推送逻辑
- ✅ 只保留心跳包处理（ping/pong）
- ✅ 移除对 `ChatRecordService` 和 `RedisTemplate` 的依赖

## 新的消息流程

```
前端发送 → HTTP POST /api/chat/send → ChatController
                                      ↓
                              ChatRecordService.saveAndPushMessage
                                      ↓
                          ┌───────────┴───────────┐
                          ↓                       ↓
                    保存到 DB              Redis 推送消息
                    生成真实 ID            chat:user:{receiverId}
                          ↓                       ↓
                    返回真实 ID              RedisListenerConfig
                    给前端                      ↓
                                        ChatWebSocketHandler
                                              ↓
                                        WebSocket 推送
                                              ↓
                                        接收方前端
```

## 提交记录
- 提交时间：2026-04-20
- 提交信息：`refactor: 重构聊天系统消息发送链路`
