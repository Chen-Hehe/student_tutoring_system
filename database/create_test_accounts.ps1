# 测试账号创建脚本 - 通过 API 创建
# 用于创建教师、学生、家长测试账号
# 所有账号密码均为：Test1234!

$baseUrl = "http://localhost:8080/api/auth/register"
$password = "Test1234!"

# 账号数据
$teachers = @(
    @{
        username = "teacher_zhang"
        name = "张明华"
        email = "zhang_math@example.com"
        phone = "13800138001"
        role = 1
        gender = 1
        subject = "数学"
        education = "北京大学数学系硕士"
        experience = "15 年高中数学教学经验，擅长高考冲刺辅导"
    },
    @{
        username = "teacher_li"
        name = "李雅文"
        email = "li_english@example.com"
        phone = "13800138002"
        role = 1
        gender = 0
        subject = "英语"
        education = "上海外国语大学英语系博士"
        experience = "12 年英语教学经验，雅思托福资深讲师"
    },
    @{
        username = "teacher_wang"
        name = "王晓文"
        email = "wang_chinese@example.com"
        phone = "13800138003"
        role = 1
        gender = 1
        subject = "语文"
        education = "北京师范大学中文系硕士"
        experience = "18 年语文教学经验，专注作文和阅读理解"
    }
)

$students = @(
    @{
        username = "student_ming"
        name = "陈明"
        email = "ming_student@example.com"
        phone = "13900139001"
        role = 2
        gender = 1
        age = 15
        grade = "初三"
        school = "北京市第一中学"
    },
    @{
        username = "student_hua"
        name = "李华"
        email = "hua_student@example.com"
        phone = "13900139002"
        role = 2
        gender = 0
        age = 14
        grade = "初二"
        school = "上海市实验中学"
    },
    @{
        username = "student_gang"
        name = "王刚"
        email = "gang_student@example.com"
        phone = "13900139003"
        role = 2
        gender = 1
        age = 16
        grade = "高一"
        school = "广州市育才中学"
    },
    @{
        username = "student_fang"
        name = "刘芳"
        email = "fang_student@example.com"
        phone = "13900139004"
        role = 2
        gender = 0
        age = 13
        grade = "初一"
        school = "深圳市南山外国语学校"
    },
    @{
        username = "student_jun"
        name = "赵军"
        email = "jun_student@example.com"
        phone = "13900139005"
        role = 2
        gender = 1
        age = 15
        grade = "初三"
        school = "杭州市第二中学"
    }
)

$parents = @(
    @{
        username = "parent_chen"
        name = "陈建国"
        email = "chen_parent@example.com"
        phone = "13700137001"
        role = 3
        gender = 1
    },
    @{
        username = "parent_liu"
        name = "刘美丽"
        email = "liu_parent@example.com"
        phone = "13700137002"
        role = 3
        gender = 0
    },
    @{
        username = "parent_zhao"
        name = "赵志强"
        email = "zhao_parent@example.com"
        phone = "13700137003"
        role = 3
        gender = 1
    }
)

# 创建账号函数
function Create-Account {
    param(
        [hashtable]$accountData
    )
    
    $body = @{
        username = $accountData.username
        password = $password
        role = $accountData.role
        name = $accountData.name
        email = $accountData.email
        phone = $accountData.phone
        gender = $accountData.gender
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json; charset=utf-8"
        Write-Host "✓ 创建成功：$($accountData.username) ($($accountData.name))" -ForegroundColor Green
        return $true
    }
    catch {
        $errorBody = $_.Exception.Response
        if ($errorBody) {
            $reader = New-Object System.IO.StreamReader($errorBody.GetResponseStream())
            $errorResponse = $reader.ReadToEnd()
            Write-Host "✗ 创建失败：$($accountData.username) - $errorResponse" -ForegroundColor Red
        } else {
            Write-Host "✗ 创建失败：$($accountData.username) - $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始创建测试账号" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 创建教师账号
Write-Host "--- 创建教师账号 ---" -ForegroundColor Yellow
$teacherCount = 0
foreach ($teacher in $teachers) {
    if (Create-Account -accountData $teacher) {
        $teacherCount++
    }
}
Write-Host "教师账号创建完成：$teacherCount/$($teachers.Count)" -ForegroundColor Cyan
Write-Host ""

# 创建学生账号
Write-Host "--- 创建学生账号 ---" -ForegroundColor Yellow
$studentCount = 0
foreach ($student in $students) {
    if (Create-Account -accountData $student) {
        $studentCount++
    }
}
Write-Host "学生账号创建完成：$studentCount/$($students.Count)" -ForegroundColor Cyan
Write-Host ""

# 创建家长账号
Write-Host "--- 创建家长账号 ---" -ForegroundColor Yellow
$parentCount = 0
foreach ($parent in $parents) {
    if (Create-Account -accountData $parent) {
        $parentCount++
    }
}
Write-Host "家长账号创建完成：$parentCount/$($parents.Count)" -ForegroundColor Cyan
Write-Host ""

# 输出汇总
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "账号创建汇总" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "教师账号：$teacherCount/$($teachers.Count)" -ForegroundColor $(if($teacherCount -eq $teachers.Count){"Green"}else{"Yellow"})
Write-Host "学生账号：$studentCount/$($students.Count)" -ForegroundColor $(if($studentCount -eq $students.Count){"Green"}else{"Yellow"})
Write-Host "家长账号：$parentCount/$($parents.Count)" -ForegroundColor $(if($parentCount -eq $parents.Count){"Green"}else{"Yellow"})
Write-Host ""
Write-Host "所有账号密码：Test1234!" -ForegroundColor Magenta
Write-Host ""

# 生成账号列表表格
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试账号列表" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allAccounts = @()

foreach ($t in $teachers) {
    $allAccounts += [PSCustomObject]@{
        用户名 = $t.username
        密码 = $password
        角色 = "教师"
        姓名 = $t.name
        科目 = $t.subject
    }
}

foreach ($s in $students) {
    $allAccounts += [PSCustomObject]@{
        用户名 = $s.username
        密码 = $password
        角色 = "学生"
        姓名 = $s.name
        年级 = $s.grade
    }
}

foreach ($p in $parents) {
    $allAccounts += [PSCustomObject]@{
        用户名 = $p.username
        密码 = $password
        角色 = "家长"
        姓名 = $p.name
    }
}

$allAccounts | Format-Table -AutoSize

# 保存账号列表到文件
$reportPath = Join-Path $PSScriptRoot "test_accounts_summary.txt"
$allAccounts | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "账号列表已保存到：$reportPath" -ForegroundColor Green
