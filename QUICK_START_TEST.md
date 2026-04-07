# Quick Start - Testing Chat Fixes

## 🚀 Quick Test (5 minutes)

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started StudentTutoringSystemApplication in X seconds`

### 2. Start Student Frontend (Terminal 2)
```bash
cd student-frontend
npm run dev
```

### 3. Start Teacher Frontend (Terminal 3)
```bash
cd teacher-frontend
npm run dev
```

### 4. Test in Browser

**Window 1 - Student:**
1. Open: http://localhost:5173 (or the URL shown)
2. Login as a student
3. Go to Chat page
4. Select a teacher
5. Send message: "Hello Teacher!"
6. **Check console** (F12) - should see: `发送消息：{receiverId: X, message: "Hello Teacher!", ...}`

**Window 2 - Teacher:**
1. Open: http://localhost:5174 (or the URL shown)
2. Login as a teacher
3. Go to Chat page
4. **Should see message appear in real-time!**
5. **Check console** - should see: `收到 WebSocket 消息：{senderId: X, ...}`

### 5. Verify Database
```sql
mysql> USE tutoring;
mysql> SELECT * FROM chat_records ORDER BY sent_at DESC LIMIT 5;
```

**You should see your message in the database!** ✅

### 6. Test Persistence
1. Refresh the student's browser
2. **Messages should still be there!** ✅

## ✅ Success Indicators

### Backend Logs (Look for these):
```
✓ === WebSocket 收到用户 X 的消息
✓ 解析后的消息对象：receiverId=Y, message=Hello, type=1
✓ ChatRecordService.sendMessage - 开始保存消息
✓ ChatRecordService.sendMessage - 数据库插入结果：affectedRows=1
✓ 消息已保存到数据库，recordId=123456789
✓ 消息处理完成，已发送给接收者 Y
```

### Frontend Console (Student):
```
✓ WebSocket 连接成功
✓ 发送消息：{receiverId: Y, message: "Hello", ...}
```

### Frontend Console (Teacher):
```
✓ WebSocket 连接成功
✓ 收到 WebSocket 消息：{senderId: X, receiverId: Y, message: "Hello", ...}
✓ 处理收到的消息
✓ 添加新消息到状态
```

### Database:
```sql
+------------------+-----------+-------------+---------------+------+----------+---------+
| id               | sender_id | receiver_id | message       | type | is_read  | sent_at |
+------------------+-----------+-------------+---------------+------+----------+---------+
| 1738562940123    | 2         | 1           | Hello Teacher | 1    | 0        | ...     |
+------------------+-----------+-------------+---------------+------+----------+---------+
```

## ❌ Troubleshooting

### Problem: WebSocket connection fails
**Solution:**
- Check backend is running on port 8080
- Verify `.env` files have: `VITE_WS_URL=ws://localhost:8080/ws-chat`

### Problem: Messages don't appear in database
**Solution:**
- Check backend logs for errors
- Verify MySQL is running
- Check database credentials in `application.yml`

### Problem: Real-time delivery doesn't work
**Solution:**
- Verify both users are connected to WebSocket (check console logs)
- Check if receiverId is correct
- Look for "用户 Y 不在线" in backend logs

### Problem: Duplicate messages appear
**Solution:**
- The fix includes duplicate prevention
- Check browser console for "消息已存在，跳过添加"

## 📝 Full Documentation

For detailed information, see:
- `CHAT_FIXES_SUMMARY.md` - Complete fix documentation
- `CHAT_FIX_TEST.md` - Comprehensive testing guide
- `test-chat-fix.sh` - Automated test script

## 🎯 What Was Fixed

1. ✅ **Backend logging** - Full visibility into message flow
2. ✅ **Database validation** - Ensures messages are actually saved
3. ✅ **Frontend duplicate prevention** - No more duplicate messages
4. ✅ **Error handling** - Users see error messages
5. ✅ **Console logging** - Easy debugging

## 📊 Git Commits

```
f8a0ff7 docs: Add comprehensive testing guide and fix summary
cc08e2f fix: Improve frontend chat message handling and prevent duplicates
68698c0 fix: Add comprehensive logging and validation to chat message persistence
```

---

**Ready to test!** 🚀

If you encounter any issues, check the logs and refer to the troubleshooting section above.
