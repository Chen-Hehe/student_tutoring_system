# 测试账号汇总 / Test Accounts Summary

创建日期：2026-04-02  
所有账号密码：`Test1234!`

## 账号列表 / Account List

### 教师账号 / Teacher Accounts (3 个)

| 用户名 Username | 密码 Password | 角色 Role | 姓名 Name | 科目 Subject | 教育背景 Education | 经验 Experience |
|----------------|---------------|-----------|----------|--------------|-------------------|-----------------|
| teacher_zhang | Test1234! | 教师 | 张明华 | 数学 | 北京大学数学系硕士 | 15 年高中数学教学经验 |
| teacher_li | Test1234! | 教师 | 李雅文 | 英语 | 上海外国语大学英语系博士 | 12 年英语教学经验 |
| teacher_wang | Test1234! | 教师 | 王晓文 | 语文 | 北京师范大学中文系硕士 | 18 年语文教学经验 |

### 学生账号 / Student Accounts (5 个)

| 用户名 Username | 密码 Password | 角色 Role | 姓名 Name | 年龄 Age | 年级 Grade | 学校 School |
|----------------|---------------|-----------|----------|----------|------------|-------------|
| student_ming | Test1234! | 学生 | 陈明 | 15 | 初三 | 北京市第一中学 |
| student_hua | Test1234! | 学生 | 李华 | 14 | 初二 | 上海市实验中学 |
| student_gang | Test1234! | 学生 | 王刚 | 16 | 高一 | 广州市育才中学 |
| student_fang | Test1234! | 学生 | 刘芳 | 13 | 初一 | 深圳市南山外国语学校 |
| student_jun | Test1234! | 学生 | 赵军 | 15 | 初三 | 杭州市第二中学 |

### 家长账号 / Parent Accounts (3 个)

| 用户名 Username | 密码 Password | 角色 Role | 姓名 Name | 关联学生 Linked Students | 关系 Relationship |
|----------------|---------------|-----------|----------|------------------------|-------------------|
| parent_chen | Test1234! | 家长 | 陈建国 | student_ming | 父子 |
| parent_liu | Test1234! | 家长 | 刘美丽 | student_hua, student_fang | 母子，母女 |
| parent_zhao | Test1234! | 家长 | 赵志强 | student_gang, student_jun | 父子，父子 |

## 家长 - 学生关系 / Parent-Student Relationships

```
parent_chen (陈建国) ──父子──> student_ming (陈明)
parent_liu (刘美丽) ──母子──> student_hua (李华)
parent_liu (刘美丽) ──母女──> student_fang (刘芳)
parent_zhao (赵志强) ──父子──> student_gang (王刚)
parent_zhao (赵志强) ──父子──> student_jun (赵军)
```

## 快速登录测试 / Quick Login Test

### 教师端 / Teacher Portal
- URL: http://localhost:8080 (teacher-frontend)
- 测试账号：teacher_zhang / Test1234!

### 学生端 / Student Portal
- URL: http://localhost:8080 (student-frontend)
- 测试账号：student_ming / Test1234!

### 家长端 / Parent Portal
- URL: http://localhost:8080 (parent-frontend)
- 测试账号：parent_chen / Test1234!

## 数据库脚本 / Database Scripts

以下脚本已创建在 `database/` 目录：

1. `create_test_data.sql` - 完整 SQL 插入脚本（含 BCrypt 密码）
2. `insert_test_data.sql` - 补充数据脚本（教师/学生/家长详情）
3. `create_test_accounts.bat` - Windows 批处理 API 创建脚本

## 注意事项 / Notes

- 所有密码均为：`Test1234!`
- 密码已使用 BCrypt 加密存储在数据库中
- 账号仅用于测试，请勿用于生产环境
- 如需重置数据，请执行 `drop` 语句后重新运行脚本

---
Generated: 2026-04-02  
Project: student_tutoring_system
