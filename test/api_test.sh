#!/bin/bash
# ============================================
# API 测试脚本
# 作用：测试匹配统计接口
# ============================================

BASE_URL="http://localhost:8080"

echo "========================================"
echo "  匹配统计功能 - API 测试"
echo "========================================"
echo ""

# 测试 1：全局统计
echo "测试 1: 全局统计"
echo "请求：GET $BASE_URL/api/matches/statistics"
curl -s "$BASE_URL/api/matches/statistics" | jq '.'
echo ""
echo ""

# 测试 2：按教师统计（需要替换教师 ID）
echo "测试 2: 按教师统计"
echo "提示：请替换 TEACHER_ID 为你的教师 ID"
TEACHER_ID="2041436700118394881"
echo "请求：GET $BASE_URL/api/matches/statistics?teacherId=$TEACHER_ID"
curl -s "$BASE_URL/api/matches/statistics?teacherId=$TEACHER_ID" | jq '.'
echo ""
echo ""

# 测试 3：按学生统计（需要替换学生 ID）
echo "测试 3: 按学生统计"
echo "提示：请替换 STUDENT_ID 为你的学生 ID"
STUDENT_ID="2041436713062017026"
echo "请求：GET $BASE_URL/api/matches/statistics?studentId=$STUDENT_ID"
curl -s "$BASE_URL/api/matches/statistics?studentId=$STUDENT_ID" | jq '.'
echo ""
echo ""

echo "========================================"
echo "  测试完成"
echo "========================================"
