# ============================================
# 导入测试数据 PowerShell 脚本
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  师生匹配系统 - 测试数据导入工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "tutoring"
$dbUser = "root"
$dbPassword = "8022"
$sqlFile = "D:\app_extension\cursor_projects\student_tutoring_system\backend\src\main\resources\data\test_match_data.sql"

Write-Host "数据库配置:" -ForegroundColor Yellow
Write-Host "  Host: $dbHost"
Write-Host "  Port: $dbPort"
Write-Host "  Database: $dbName"
Write-Host "  User: $dbUser"
Write-Host "  SQL 文件：$sqlFile"
Write-Host ""

# 检查 SQL 文件是否存在
if (-not (Test-Path $sqlFile)) {
    Write-Host "错误：SQL 文件不存在！" -ForegroundColor Red
    exit 1
}

# 提示用户确认密码
Write-Host "提示：如果密码不正确，请在 MySQL 中修改或更新此脚本的配置。" -ForegroundColor Yellow
Write-Host ""

# 执行 SQL
Write-Host "正在导入测试数据..." -ForegroundColor Green
try {
    $env:MYSQL_PWD = $dbPassword
    $result = mysql -h $dbHost -P $dbPort -u $dbUser $dbName -e "source $sqlFile" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ 测试数据导入成功！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        # 验证数据
        Write-Host "验证数据..." -ForegroundColor Cyan
        $verifyResult = mysql -h $dbHost -P $dbPort -u $dbUser $dbName -e @"
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;
"@
        
        Write-Host ""
        Write-Host "统计数据:" -ForegroundColor Yellow
        $verifyResult | Format-Table -AutoSize
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ✗ 导入失败！" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "错误信息:" -ForegroundColor Red
        Write-Host $result
        Write-Host ""
        Write-Host "可能的原因:" -ForegroundColor Yellow
        Write-Host "  1. 数据库密码不正确"
        Write-Host "  2. 数据库不存在（请先创建 tutoring 数据库）"
        Write-Host "  3. MySQL 服务未启动"
        Write-Host ""
    }
} catch {
    Write-Host "发生异常：$_" -ForegroundColor Red
} finally {
    Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}

Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
