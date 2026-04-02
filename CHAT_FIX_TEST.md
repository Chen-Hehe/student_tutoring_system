# Chat Message Persistence Fix - Test Guide

## Issues Fixed

### Backend Fixes:
1. **Added comprehensive logging** to ChatWebSocketHandler and ChatRecordService
2. **Added validation** to ensure database insert returns affected rows > 0
3. **Added Slf4j logging** to ChatRecordService for better debugging

### Frontend Fixes:
1. **Added duplicate message prevention** - checks if message already exists before adding to state
2. **Added temporary message IDs** - uses temp_ prefix for optimistic updates until server confirms
3. **Added console logging** for debugging message flow
4. **Added error message handling** - properly displays error messages from WebSocket

## Testing Steps

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start the Frontend (Student)
```bash
cd student-frontend
npm run dev
```

### 3. Start the Frontend (Teacher)
```bash
cd teacher-frontend
npm run dev
```

### 4. Test Message Flow

#### Test 1: Send Message and Verify Database Persistence
1. Login as Student (user ID: e.g., 2)
2. Open Chat page
3. Send a message to Teacher (user ID: e.g., 1)
4. Check browser console for logs:
   - Should see "发送消息:" with message data
   - Should see WebSocket connection established
5. Check backend logs:
   - Should see "=== WebSocket 收到用户 X 的消息"
   - Should see "设置 senderId=X，准备保存到数据库"
   - Should see "消息已保存到数据库，recordId=XXX"
   - Should see "消息处理完成，已发送给接收者 Y"
6. Check database:
   ```sql
   SELECT * FROM chat_records ORDER BY sent_at DESC LIMIT 10;
   ```
   - Should see the message with correct sender_id, receiver_id, message, type

#### Test 2: Verify Real-time Delivery
1. Login as Teacher in a different browser/window
2. Teacher should receive the message in real-time
3. Check Teacher's browser console:
   - Should see "收到 WebSocket 消息:" with message data
   - Should see "处理收到的消息:" 
   - Should see "添加新消息到状态"
4. Message should appear in Teacher's chat window immediately

#### Test 3: Verify Persistence After Refresh
1. Refresh the Student's browser page
2. Chat history should reload from database
3. Check browser console:
   - Should see "从数据库获取聊天记录，共 X 条"
4. All previous messages should appear

#### Test 4: Verify Two-way Communication
1. Teacher replies to Student's message
2. Student should receive it in real-time
3. Refresh Student's page - message should persist

## Key Log Messages to Watch For

### Backend Logs:
```
=== WebSocket 收到用户 X 的消息：{"receiverId":Y,"message":"Hello","type":1}
解析后的消息对象：receiverId=Y, message=Hello, type=1
设置 senderId=X，准备保存到数据库
ChatRecordService.sendMessage - 开始保存消息：senderId=X, receiverId=Y, message=Hello
ChatRecordService.sendMessage - 数据库插入结果：affectedRows=1, recordId=123456789
ChatRecordService.sendMessage - 消息保存成功，recordId=123456789
消息已发布到 Redis 频道：chat:user:Y
消息已发送给用户 Y
消息处理完成，已发送给接收者 Y
```

### Frontend Logs (Student):
```
WebSocket 连接成功
发送消息： {receiverId: Y, message: "Hello", type: 1, timestamp: "..."}
```

### Frontend Logs (Teacher):
```
WebSocket 连接成功
收到 WebSocket 消息： {senderId: X, receiverId: Y, message: "Hello", type: 1, ...}
处理收到的消息： {senderId: X, receiverId: Y, message: "Hello", type: 1, ...}
添加新消息到状态
```

## Common Issues and Solutions

### Issue 1: Messages not saving to database
**Symptoms:**
- Backend logs show "数据库插入结果：affectedRows=0"
- chat_records table remains empty

**Solution:**
- Check database connection in application.yml
- Verify MySQL is running
- Check if tutoring database exists
- Verify chat_records table schema matches entity

### Issue 2: WebSocket connection fails
**Symptoms:**
- Frontend shows "连接已断开"
- Console shows WebSocket error

**Solution:**
- Verify backend is running on port 8080
- Check VITE_WS_URL in frontend .env matches backend WebSocket path
- Check firewall settings
- Verify WebSocketConfig is properly configured

### Issue 3: Messages not appearing in real-time
**Symptoms:**
- Sender sees message but receiver doesn't
- Need to refresh to see messages

**Solution:**
- Check if both users are connected to WebSocket
- Verify receiverId is correct in message
- Check backend logs for "用户 Y 不在线"
- Verify Redis is running (for multi-node support)

### Issue 4: Duplicate messages
**Symptoms:**
- Same message appears multiple times

**Solution:**
- The fix includes duplicate detection
- Check if messageId or temp_ prefix matching works
- Verify message format includes all required fields

## Database Verification Queries

```sql
-- Check recent messages
SELECT * FROM chat_records ORDER BY sent_at DESC LIMIT 20;

-- Check messages between specific users
SELECT * FROM chat_records 
WHERE (sender_id = 1 AND receiver_id = 2) 
   OR (sender_id = 2 AND receiver_id = 1)
ORDER BY sent_at DESC;

-- Count messages
SELECT COUNT(*) FROM chat_records;

-- Check for deleted messages (should be 0)
SELECT COUNT(*) FROM chat_records WHERE deleted = 1;
```

## Files Modified

### Backend:
- `backend/src/main/java/com/tutoring/handler/ChatWebSocketHandler.java` - Added logging
- `backend/src/main/java/com/tutoring/service/ChatRecordService.java` - Added logging and validation

### Frontend:
- `student-frontend/src/pages/Chat.jsx` - Fixed message handling and duplicate prevention
- `teacher-frontend/src/pages/Chat.jsx` - Fixed message handling and duplicate prevention

## Next Steps

1. Run the backend and frontends
2. Follow the test steps above
3. Monitor logs for any issues
4. Verify messages appear in database
5. Test real-time communication
6. Test persistence after refresh
