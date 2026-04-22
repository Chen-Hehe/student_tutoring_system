# WebSocket 实时通知集成指南

## 概述

匹配状态变更时，系统会通过 WebSocket 向相关用户推送实时通知。

## 后端实现

### 新增文件

1. **`NotificationMessage.java`** - 通知消息 DTO
2. **`NotificationService.java`** - 通知服务（通过 Redis Pub/Sub 推送）

### 修改文件

1. **`MatchService.java`** - 在 `acceptMatch`、`rejectMatch`、`sendInvitation` 方法中添加通知逻辑

### 通知类型

| 类型 | 说明 | 触发场景 |
|------|------|----------|
| `MATCH_INVITATION` | 收到匹配邀请 | 教师主动发送辅导邀请 |
| `MATCH_STATUS_UPDATE` | 匹配状态更新 | 接受/拒绝匹配请求 |

### 匹配状态码

| 状态码 | 说明 |
|--------|------|
| 0 | 待确认 |
| 1 | 待家长确认 |
| 2 | 已匹配 |
| 3 | 已拒绝 |

---

## 前端集成（React）

### 1. 创建 WebSocket 连接工具

```typescript
// src/utils/websocket.ts

class WebSocketClient {
  private ws: WebSocket | null = null;
  private userId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  
  // 消息回调
  private onMessageCallback: ((data: any) => void) | null = null;
  private onOpenCallback: (() => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  connect(userId: number, baseUrl: string = 'ws://localhost:8080') {
    this.userId = userId;
    const wsUrl = `${baseUrl}/ws-chat?userId=${userId}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket 连接成功');
        this.reconnectAttempts = 0;
        this.onOpenCallback?.();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 处理心跳响应
          if (data.type === 'pong') {
            console.log('收到心跳响应');
            return;
          }
          
          // 处理通知消息
          if (data.type === 'MATCH_STATUS_UPDATE' || data.type === 'MATCH_INVITATION') {
            console.log('收到匹配通知:', data);
            this.onMessageCallback?.(data);
          }
        } catch (e) {
          console.error('解析 WebSocket 消息失败:', e);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket 连接关闭');
        this.onCloseCallback?.();
        this.attemptReconnect(userId, baseUrl);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };
    } catch (e) {
      console.error('创建 WebSocket 连接失败:', e);
    }
  }
  
  private attemptReconnect(userId: number, baseUrl: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(userId, baseUrl), this.reconnectDelay);
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  // 发送心跳
  sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }
  
  // 设置消息回调
  onMessage(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }
  
  onOpen(callback: () => void) {
    this.onOpenCallback = callback;
  }
  
  onClose(callback: () => void) {
    this.onCloseCallback = callback;
  }
}

export const wsClient = new WebSocketClient();
```

### 2. 在 React 组件中使用

```typescript
// src/hooks/useMatchNotification.ts

import { useEffect } from 'react';
import { wsClient } from '../utils/websocket';
import { useAuth } from './useAuth'; // 假设你有认证 hook

export function useMatchNotification() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.id) return;
    
    // 连接 WebSocket
    wsClient.connect(user.id);
    
    // 设置消息处理
    wsClient.onMessage((data) => {
      handleNotification(data);
    });
    
    // 心跳检测（每 30 秒）
    const pingInterval = setInterval(() => {
      wsClient.sendPing();
    }, 30000);
    
    return () => {
      clearInterval(pingInterval);
      wsClient.disconnect();
    };
  }, [user?.id]);
  
  const handleNotification = (data: any) => {
    switch (data.type) {
      case 'MATCH_INVITATION':
        // 显示邀请通知
        showNotification({
          title: '收到辅导邀请',
          message: data.message,
          matchId: data.matchId,
        });
        break;
        
      case 'MATCH_STATUS_UPDATE':
        // 显示状态更新通知
        showNotification({
          title: '匹配状态更新',
          message: data.message,
          matchId: data.matchId,
          status: data.status,
        });
        break;
    }
  };
  
  const showNotification = (notification: {
    title: string;
    message: string;
    matchId?: number;
    status?: number;
  }) => {
    // 使用你的通知组件（如 antd notification、toast 等）
    console.log('显示通知:', notification);
    
    // 示例：使用 antd notification
    // notification.info({
    //   message: notification.title,
    //   description: notification.message,
    //   onClick: () => {
    //     // 点击跳转到匹配详情页
    //     navigate(`/matches/${notification.matchId}`);
    //   },
    // });
  };
}
```

### 3. 在应用入口初始化

```typescript
// src/App.tsx

import { useMatchNotification } from './hooks/useMatchNotification';

function App() {
  // 启用匹配通知
  useMatchNotification();
  
  return (
    // ... 你的应用内容
  );
}
```

---

## 通知消息格式

### MATCH_INVITATION（收到邀请）

```json
{
  "type": "MATCH_INVITATION",
  "message": "您收到一条新的数学辅导邀请来自张老师",
  "matchId": 1234567890,
  "status": 0,
  "senderId": 2041436600118394881,
  "senderName": "张老师",
  "timestamp": "2026-04-23 10:30:00"
}
```

### MATCH_STATUS_UPDATE（状态更新）

```json
{
  "type": "MATCH_STATUS_UPDATE",
  "message": "您的数学辅导请求已被张老师接受",
  "matchId": 1234567890,
  "status": 2,
  "timestamp": "2026-04-23 10:35:00"
}
```

---

## 测试步骤

### 1. 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

### 2. 测试场景

#### 场景 A：教师发送邀请
1. 教师登录，调用 `POST /api/matches/invite`
2. 学生端应收到 `MATCH_INVITATION` 通知

#### 场景 B：学生接受邀请
1. 学生登录，调用 `POST /api/matches/{matchId}/accept`
2. 教师端应收到 `MATCH_STATUS_UPDATE` 通知

#### 场景 C：家长确认匹配
1. 家长登录，调用 `POST /api/matches/{matchId}/accept` (userType=parent)
2. 学生和教师端应收到 `MATCH_STATUS_UPDATE` 通知（状态变为 2-已匹配）

---

## 注意事项

1. **WebSocket 连接时机**：用户登录后立即建立连接
2. **断线重连**：实现自动重连机制（最多 5 次）
3. **心跳检测**：每 30 秒发送一次 ping 保持连接
4. **通知去重**：前端可根据 `matchId + timestamp` 避免重复显示
5. **离线消息**：当前实现仅推送在线用户，离线消息需另行实现（可考虑数据库轮询或消息队列持久化）

---

## 后续优化

1. **家长通知**：需要实现 `ParentStudentRelation` 查询逻辑
2. **离线消息**：将通知存入数据库，用户上线后拉取
3. **通知设置**：允许用户自定义通知类型（如关闭某些通知）
4. **通知中心**：在应用内添加通知列表页面

---

## 相关文件

- 后端：`backend/src/main/java/com/tutoring/dto/NotificationMessage.java`
- 后端：`backend/src/main/java/com/tutoring/service/NotificationService.java`
- 后端：`backend/src/main/java/com/tutoring/service/MatchService.java`
- 后端：`backend/src/main/java/com/tutoring/handler/ChatWebSocketHandler.java`
- 后端：`backend/src/main/java/com/tutoring/config/WebSocketConfig.java`
