# 项目端口分配说明

**更新时间：** 2026-04-23  
**状态：** ✅ 已修复

---

## 📊 端口分配总览

| 端口 | 项目 | 用途 | 访问地址 |
|------|------|------|---------|
| **3000** | 统一认证中心 | **统一登录入口** | http://localhost:3000 |
| 3001 | admin-frontend | 管理员端 | http://localhost:3001 |
| 3002 | teacher-frontend | 教师端 | http://localhost:3002 |
| 3003 | student-frontend | 学生端 | http://localhost:3003 |
| 3004 | parent-frontend | 家长端 | http://localhost:3004 |
| 8080 | backend | Spring Boot 后端 | http://localhost:8080 |

---

## 🔧 修复内容

### package.json 修复

所有前端的 `package.json` 已修复为正确的端口号：

```json
// admin-frontend/package.json
"dev": "vite --port 3001"

// teacher-frontend/package.json
"dev": "vite --port 3002"

// student-frontend/package.json
"dev": "vite --port 3003"

// parent-frontend/package.json
"dev": "vite --port 3004"
```

### vite.config.js 配置

所有前端的 `vite.config.js` 已经是正确的端口号，无需修改。

---

## 🚀 启动顺序

### 1. 启动后端（必须先启动）

```bash
cd backend
mvn spring-boot:run
```

**等待看到：** `Started StudentTutoringSystem`

---

### 2. 启动统一认证中心（3000 端口）

```bash
# 如果有独立的认证中心项目
cd auth-center
npm run dev
```

**访问：** http://localhost:3000

---

### 3. 启动各端前端

#### 管理员端
```bash
cd admin-frontend
npm run dev
```
**访问：** http://localhost:3001

#### 教师端
```bash
cd teacher-frontend
npm run dev
```
**访问：** http://localhost:3002

#### 学生端
```bash
cd student-frontend
npm run dev
```
**访问：** http://localhost:3003

#### 家长端
```bash
cd parent-frontend
npm run dev
```
**访问：** http://localhost:3004

---

## 🔍 端口占用处理

### 检查端口占用

```bash
# Windows
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":3002"
netstat -ano | findstr ":3003"
netstat -ano | findstr ":3004"
```

### 杀死占用端口的进程

```bash
# Windows PowerShell
Get-Process -Id <PID> | Stop-Process -Force
```

---

## 📝 注意事项

1. **后端必须先启动** - 所有前端依赖后端 API
2. **3000 端口用于统一登录** - 所有用户通过 3000 端口登录后跳转到对应端
3. **端口冲突处理** - 如果端口被占用，先杀死占用进程再启动
4. **vite.config.js 优先** - 启动时优先读取该文件的端口配置

---

## 🐛 常见问题

### Q: 启动后访问的不是正确端口？

**A:** 检查 `package.json` 和 `vite.config.js` 是否一致

### Q: 3000 端口是做什么的？

**A:** 统一认证中心，处理所有用户的登录逻辑

### Q: 可以跳过 3000 直接访问各端吗？

**A:** 可以，但建议通过 3000 统一登录

---

**最后更新：** 2026-04-23
