# 乡村助学平台 RESTful API 接口文档

## 1. 基础信息

### 1.1 API 基础路径
```
/api/v1
```

### 1.2 认证方式
- 使用 JWT (JSON Web Token) 进行认证
- 在请求头中添加 `Authorization: Bearer <token>`

### 1.3 响应格式
- 所有响应均为 JSON 格式
- 标准响应结构：
  ```json
  {
    "status": "success",
    "message": "操作成功",
    "data": {}
  }
  ```

- 错误响应结构：
  ```json
  {
    "status": "error",
    "message": "操作失败",
    "error": "具体错误信息"
  }
  ```

## 2. 认证相关接口

### 2.1 登录
- **路径**: `/api/v1/auth/login`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "teacher1",
    "password": "teacher123",
    "role": "teacher"
  }
  ```
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "teacher1",
        "name": "李老师",
        "role": "teacher",
        "avatar": "avatar_url"
      }
    }
  }
  ```

### 2.2 注册
- **路径**: `/api/v1/auth/register`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "student1",
    "password": "student123",
    "role": "student",
    "name": "小明",
    "phone": "13600136001",
    "email": "student1@example.com",
    "grade": "三年级"
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "注册成功",
    "data": {
      "id": 6,
      "username": "student1",
      "name": "小明",
      "role": "student"
    }
  }
  ```

### 2.3 忘记密码
- **路径**: `/api/v1/auth/forgot-password`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "student1",
    "email": "student1@example.com"
  }
  ```
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "密码重置链接已发送到您的邮箱"
  }
  ```

## 3. 用户管理接口

### 3.1 获取当前用户信息
- **路径**: `/api/v1/users/me`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "id": 1,
      "username": "teacher1",
      "name": "李老师",
      "role": "teacher",
      "phone": "13900139001",
      "email": "teacher1@example.com",
      "avatar": "avatar_url",
      "teacher_info": {
        "subject": "数学",
        "education": "本科",
        "experience": "5年教学经验",
        "rating": 4.8
      }
    }
  }
  ```

### 3.2 更新用户信息
- **路径**: `/api/v1/users/me`
- **方法**: PUT
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "name": "李老师",
    "phone": "13900139001",
    "email": "teacher1@example.com",
    "avatar": "new_avatar_url"
  }
  ```
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "更新成功",
    "data": {
      "id": 1,
      "name": "李老师",
      "phone": "13900139001",
      "email": "teacher1@example.com",
      "avatar": "new_avatar_url"
    }
  }
  ```

### 3.3 获取用户列表 (管理员)
- **路径**: `/api/v1/users`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `role`: 角色类型 (teacher/student/parent/admin)
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "users": [
        {
          "id": 1,
          "username": "teacher1",
          "name": "李老师",
          "role": "teacher",
          "phone": "13900139001",
          "email": "teacher1@example.com",
          "created_at": "2026-03-01T10:00:00Z"
        }
      ],
      "pagination": {
        "total": 10,
        "page": 1,
        "page_size": 20,
        "pages": 1
      }
    }
  }
  ```

## 4. 学生管理接口

### 4.1 获取学生列表 (教师)
- **路径**: `/api/v1/students`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `grade`: 年级
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "students": [
        {
          "id": 1,
          "user_id": 6,
          "name": "小明",
          "grade": "三年级",
          "school": "希望小学",
          "address": "乡村1组",
          "parent_id": 4
        }
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "page_size": 20,
        "pages": 2
      }
    }
  }
  ```

### 4.2 获取学生详情
- **路径**: `/api/v1/students/{id}`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "id": 1,
      "user_id": 6,
      "name": "小明",
      "grade": "三年级",
      "school": "希望小学",
      "address": "乡村1组",
      "parent_id": 4,
      "parent_name": "张三爸爸",
      "learning_progress": [
        {
          "subject": "数学",
          "progress": 65.5
        }
      ],
      "psychological_status": {
        "emotional_state": "good",
        "assessment_date": "2026-03-20"
      }
    }
  }
  ```

## 5. 教师管理接口

### 5.1 获取教师列表 (学生/家长)
- **路径**: `/api/v1/teachers`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `subject`: 教授科目
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "teachers": [
        {
          "id": 1,
          "user_id": 2,
          "name": "李老师",
          "subject": "数学",
          "education": "本科",
          "experience": "5年教学经验",
          "rating": 4.8
        }
      ],
      "pagination": {
        "total": 15,
        "page": 1,
        "page_size": 20,
        "pages": 1
      }
    }
  }
  ```

### 5.2 获取教师详情
- **路径**: `/api/v1/teachers/{id}`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "id": 1,
      "user_id": 2,
      "name": "李老师",
      "subject": "数学",
      "education": "本科",
      "experience": "5年教学经验",
      "introduction": "擅长小学数学教学，注重基础培养",
      "rating": 4.8,
      "resources_count": 5
    }
  }
  ```

## 6. 师生匹配接口

### 6.1 创建匹配请求
- **路径**: `/api/v1/matches`
- **方法**: POST
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "teacher_id": 1,
    "student_id": 1,
    "request_from": "student",
    "request_message": "希望获得数学辅导"
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "匹配请求已创建",
    "data": {
      "id": 1,
      "teacher_id": 1,
      "student_id": 1,
      "status": "pending",
      "request_from": "student",
      "created_at": "2026-03-31T10:00:00Z"
    }
  }
  ```

### 6.2 获取匹配列表
- **路径**: `/api/v1/matches`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `status`: 匹配状态 (pending/approved/rejected/active/completed)
  - `role`: 角色视角 (teacher/student/parent)
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "matches": [
        {
          "id": 1,
          "teacher_id": 1,
          "teacher_name": "李老师",
          "student_id": 1,
          "student_name": "小明",
          "status": "active",
          "request_from": "student",
          "matched_at": "2026-03-31T10:30:00Z"
        }
      ],
      "pagination": {
        "total": 5,
        "page": 1,
        "page_size": 20,
        "pages": 1
      }
    }
  }
  ```

### 6.3 更新匹配状态
- **路径**: `/api/v1/matches/{id}`
- **方法**: PATCH
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "status": "approved",
    "parent_approval": true
  }
  ```
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "更新成功",
    "data": {
      "id": 1,
      "status": "approved",
      "parent_approval": true,
      "matched_at": "2026-03-31T10:30:00Z"
    }
  }
  ```

### 6.4 删除匹配
- **路径**: `/api/v1/matches/{id}`
- **方法**: DELETE
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "删除成功"
  }
  ```

## 7. 消息通信接口

### 7.1 发送消息
- **路径**: `/api/v1/messages`
- **方法**: POST
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "receiver_id": 2,
    "match_id": 1,
    "content": "你好，我是李老师"
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "消息发送成功",
    "data": {
      "id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "match_id": 1,
      "content": "你好，我是李老师",
      "status": "sent",
      "created_at": "2026-03-31T11:00:00Z"
    }
  }
  ```

### 7.2 获取消息列表
- **路径**: `/api/v1/messages`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `user_id`: 对话用户ID
  - `match_id`: 匹配ID
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "messages": [
        {
          "id": 1,
          "sender_id": 1,
          "sender_name": "李老师",
          "receiver_id": 2,
          "content": "你好，我是李老师",
          "status": "read",
          "created_at": "2026-03-31T11:00:00Z"
        }
      ],
      "pagination": {
        "total": 10,
        "page": 1,
        "page_size": 20,
        "pages": 1
      }
    }
  }
  ```

### 7.3 标记消息已读
- **路径**: `/api/v1/messages/{id}/read`
- **方法**: PATCH
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "标记成功",
    "data": {
      "id": 1,
      "status": "read"
    }
  }
  ```

## 8. 学习进度接口

### 8.1 获取学习进度
- **路径**: `/api/v1/learning-progress`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `student_id`: 学生ID (教师或家长查询时必填)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "student_id": 1,
        "subject": "数学",
        "progress": 65.5,
        "last_updated": "2026-03-30T10:00:00Z"
      }
    ]
  }
  ```

### 8.2 创建或更新学习进度
- **路径**: `/api/v1/learning-progress`
- **方法**: POST
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "student_id": 1,
    "subject": "数学",
    "progress": 70.0
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "更新成功",
    "data": {
      "id": 1,
      "student_id": 1,
      "subject": "数学",
      "progress": 70.0,
      "last_updated": "2026-03-31T10:00:00Z"
    }
  }
  ```

## 9. 心理状态接口

### 9.1 获取心理状态
- **路径**: `/api/v1/psychological-status`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `student_id`: 学生ID (教师或家长查询时必填)
  - `limit`: 返回记录数 (默认 10)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "student_id": 1,
        "assessment_date": "2026-03-20",
        "emotional_state": "good",
        "anxiety_level": 1,
        "depression_level": 0,
        "counselor_notes": "状态良好，积极向上",
        "recommendation": "继续保持",
        "created_at": "2026-03-20T10:00:00Z"
      }
    ]
  }
  ```

### 9.2 提交心理评估
- **路径**: `/api/v1/psychological-status`
- **方法**: POST
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "student_id": 1,
    "emotional_state": "good",
    "anxiety_level": 0,
    "depression_level": 0,
    "counselor_notes": "状态良好，积极向上",
    "recommendation": "继续保持"
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "提交成功",
    "data": {
      "id": 2,
      "student_id": 1,
      "assessment_date": "2026-03-31",
      "emotional_state": "good",
      "anxiety_level": 0,
      "depression_level": 0,
      "created_at": "2026-03-31T10:00:00Z"
    }
  }
  ```

## 10. 教学资源接口

### 10.1 上传教学资源
- **路径**: `/api/v1/resources`
- **方法**: POST
- **请求头**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **请求体**:
  - `title`: 资源标题 (string, 必填)
  - `description`: 资源描述 (string, 可选)
  - `resource_type`: 资源类型 (string, 必填) - courseware/lesson_plan/exercise/video/other
  - `file`: 资源文件 (file, 必填)
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "上传成功",
    "data": {
      "id": 1,
      "teacher_id": 1,
      "title": "三年级数学上册课件",
      "description": "包含第一单元知识点",
      "resource_type": "courseware",
      "file_path": "/resources/courseware/math3_1.pptx",
      "upload_date": "2026-03-31T10:00:00Z"
    }
  }
  ```

### 10.2 获取资源列表
- **路径**: `/api/v1/resources`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `teacher_id`: 教师ID
  - `resource_type`: 资源类型
  - `page`: 页码 (默认 1)
  - `page_size`: 每页条数 (默认 20)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "resources": [
        {
          "id": 1,
          "teacher_id": 1,
          "teacher_name": "李老师",
          "title": "三年级数学上册课件",
          "description": "包含第一单元知识点",
          "resource_type": "courseware",
          "file_path": "/resources/courseware/math3_1.pptx",
          "upload_date": "2026-03-31T10:00:00Z"
        }
      ],
      "pagination": {
        "total": 5,
        "page": 1,
        "page_size": 20,
        "pages": 1
      }
    }
  }
  ```

### 10.3 获取资源详情
- **路径**: `/api/v1/resources/{id}`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "id": 1,
      "teacher_id": 1,
      "teacher_name": "李老师",
      "title": "三年级数学上册课件",
      "description": "包含第一单元知识点",
      "resource_type": "courseware",
      "file_path": "/resources/courseware/math3_1.pptx",
      "upload_date": "2026-03-31T10:00:00Z"
    }
  }
  ```

### 10.4 分享资源
- **路径**: `/api/v1/resources/{id}/share`
- **方法**: POST
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "student_id": 1
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "分享成功",
    "data": {
      "id": 1,
      "resource_id": 1,
      "student_id": 1,
      "shared_at": "2026-03-31T10:30:00Z"
    }
  }
  ```

### 10.5 删除资源
- **路径**: `/api/v1/resources/{id}`
- **方法**: DELETE
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "删除成功"
  }
  ```

## 11. AI推荐接口

### 11.1 获取AI推荐教师
- **路径**: `/api/v1/ai/recommendations`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **查询参数**:
  - `student_id`: 学生ID (教师查询时必填)
  - `limit`: 返回推荐数量 (默认 5)
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "student_id": 1,
        "teacher_id": 1,
        "teacher_name": "李老师",
        "subject": "数学",
        "match_score": 92.5,
        "reason": "学生数学成绩需要提升，教师擅长小学数学教学",
        "generated_at": "2026-03-31T10:00:00Z"
      }
    ]
  }
  ```

## 12. 家长管理接口

### 12.1 获取孩子列表
- **路径**: `/api/v1/parents/children`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "user_id": 6,
        "name": "小明",
        "grade": "三年级",
        "school": "希望小学",
        "learning_progress": {
          "math": 65.5,
          "chinese": 72.0
        },
        "psychological_status": "good"
      }
    ]
  }
  ```

### 12.2 确认匹配请求
- **路径**: `/api/v1/parents/matches/{id}/approve`
- **方法**: PATCH
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "approved": true,
    "reason": "同意孩子接受辅导"
  }
  ```
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "确认成功",
    "data": {
      "id": 1,
      "parent_approval": true,
      "status": "approved"
    }
  }
  ```

## 13. 管理员接口

### 13.1 获取系统统计
- **路径**: `/api/v1/admin/stats`
- **方法**: GET
- **请求头**: `Authorization: Bearer <token>`
- **成功响应** (200 OK):
  ```json
  {
    "status": "success",
    "message": "获取成功",
    "data": {
      "total_users": 50,
      "teachers_count": 15,
      "students_count": 25,
      "parents_count": 10,
      "active_matches": 20,
      "pending_matches": 5,
      "total_resources": 100,
      "total_messages": 500
    }
  }
  ```

### 13.2 管理用户 (创建/更新/删除)
- **路径**: `/api/v1/admin/users`
- **方法**: POST (创建)
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "username": "teacher2",
    "password": "teacher123",
    "role": "teacher",
    "name": "王老师",
    "phone": "13900139002",
    "email": "teacher2@example.com",
    "subject": "语文"
  }
  ```
- **成功响应** (201 Created):
  ```json
  {
    "status": "success",
    "message": "创建成功",
    "data": {
      "id": 3,
      "username": "teacher2",
      "name": "王老师",
      "role": "teacher"
    }
  }
  ```

## 14. 错误处理

### 14.1 常见错误状态码
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权，需要登录
- `403 Forbidden`: 禁止访问，权限不足
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突，如用户名已存在
- `500 Internal Server Error`: 服务器内部错误

### 14.2 错误响应示例
```json
{
  "status": "error",
  "message": "登录失败",
  "error": "用户名或密码错误"
}
```

## 15. API 调用示例

### 15.1 使用 cURL 调用登录接口
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "teacher1", "password": "teacher123", "role": "teacher"}'
```

### 15.2 使用 JavaScript 调用获取消息列表
```javascript
fetch('http://localhost:3000/api/v1/messages', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log(data);
});
```

### 15.3 使用 Python 调用创建匹配请求
```python
import requests

url = 'http://localhost:3000/api/v1/matches'
headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}
data = {
    'teacher_id': 1,
    'student_id': 1,
    'request_from': 'student',
    'request_message': '希望获得数学辅导'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```