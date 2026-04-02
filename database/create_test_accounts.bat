@echo off
chcp 65001 >nul
echo ========================================
echo 测试账号创建脚本 - 通过 API 创建
echo 所有账号密码均为：Test1234!
echo ========================================
echo.

set baseUrl=http://localhost:8080/api/auth/register
set password=Test1234!

echo --- 创建教师账号 ---

echo 创建教师 1: teacher_zhang (张明华)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"teacher_zhang\",\"password\":\"%password%\",\"role\":1,\"name\":\"张明华\",\"email\":\"zhang_math@example.com\",\"phone\":\"13800138001\",\"gender\":1}"
echo.

echo 创建教师 2: teacher_li (李雅文)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"teacher_li\",\"password\":\"%password%\",\"role\":1,\"name\":\"李雅文\",\"email\":\"li_english@example.com\",\"phone\":\"13800138002\",\"gender\":0}"
echo.

echo 创建教师 3: teacher_wang (王晓文)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"teacher_wang\",\"password\":\"%password%\",\"role\":1,\"name\":\"王晓文\",\"email\":\"wang_chinese@example.com\",\"phone\":\"13800138003\",\"gender\":1}"
echo.

echo --- 创建学生账号 ---

echo 创建学生 1: student_ming (陈明)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"student_ming\",\"password\":\"%password%\",\"role\":2,\"name\":\"陈明\",\"email\":\"ming_student@example.com\",\"phone\":\"13900139001\",\"gender\":1}"
echo.

echo 创建学生 2: student_hua (李华)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"student_hua\",\"password\":\"%password%\",\"role\":2,\"name\":\"李华\",\"email\":\"hua_student@example.com\",\"phone\":\"13900139002\",\"gender\":0}"
echo.

echo 创建学生 3: student_gang (王刚)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"student_gang\",\"password\":\"%password%\",\"role\":2,\"name\":\"王刚\",\"email\":\"gang_student@example.com\",\"phone\":\"13900139003\",\"gender\":1}"
echo.

echo 创建学生 4: student_fang (刘芳)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"student_fang\",\"password\":\"%password%\",\"role\":2,\"name\":\"刘芳\",\"email\":\"fang_student@example.com\",\"phone\":\"13900139004\",\"gender\":0}"
echo.

echo 创建学生 5: student_jun (赵军)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"student_jun\",\"password\":\"%password%\",\"role\":2,\"name\":\"赵军\",\"email\":\"jun_student@example.com\",\"phone\":\"13900139005\",\"gender\":1}"
echo.

echo --- 创建家长账号 ---

echo 创建家长 1: parent_chen (陈建国)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"parent_chen\",\"password\":\"%password%\",\"role\":3,\"name\":\"陈建国\",\"email\":\"chen_parent@example.com\",\"phone\":\"13700137001\",\"gender\":1}"
echo.

echo 创建家长 2: parent_liu (刘美丽)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"parent_liu\",\"password\":\"%password%\",\"role\":3,\"name\":\"刘美丽\",\"email\":\"liu_parent@example.com\",\"phone\":\"13700137002\",\"gender\":0}"
echo.

echo 创建家长 3: parent_zhao (赵志强)
curl -X POST "%baseUrl%" -H "Content-Type: application/json" -d "{\"username\":\"parent_zhao\",\"password\":\"%password%\",\"role\":3,\"name\":\"赵志强\",\"email\":\"zhao_parent@example.com\",\"phone\":\"13700137003\",\"gender\":1}"
echo.

echo ========================================
echo 账号创建完成！
echo ========================================
echo.
echo 所有账号密码：Test1234!
echo.
pause
