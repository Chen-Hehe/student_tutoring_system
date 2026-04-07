#!/bin/bash

# Chat System Test Script
# This script helps test the chat message persistence and real-time communication fixes

echo "=========================================="
echo "Student Tutoring System - Chat Test Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "backend/pom.xml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_success "Found project structure"
echo ""

# Step 1: Check MySQL connection
echo "Step 1: Checking MySQL connection..."
mysql -h ${DB_HOST:-localhost} -P ${DB_PORT:-3306} -u ${DB_USERNAME:-root} -p${DB_PASSWORD:-} -e "USE tutoring; SELECT COUNT(*) FROM chat_records;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "MySQL connection successful"
    mysql -h ${DB_HOST:-localhost} -P ${DB_PORT:-3306} -u ${DB_USERNAME:-root} -p${DB_PASSWORD:-} -e "USE tutoring; SELECT COUNT(*) as message_count FROM chat_records;" 2>/dev/null
else
    print_error "MySQL connection failed. Please check your database credentials."
    print_info "You can set environment variables: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD"
fi
echo ""

# Step 2: Check Redis connection
echo "Step 2: Checking Redis connection..."
redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Redis connection successful"
else
    print_error "Redis connection failed. Please check if Redis is running."
fi
echo ""

# Step 3: Build backend
echo "Step 3: Building backend..."
cd backend
mvn clean compile -DskipTests -q
if [ $? -eq 0 ]; then
    print_success "Backend compilation successful"
else
    print_error "Backend compilation failed"
    exit 1
fi
cd ..
echo ""

# Step 4: Check frontend configurations
echo "Step 4: Checking frontend configurations..."
for frontend in student-frontend teacher-frontend; do
    if [ -f "$frontend/.env" ]; then
        print_success "Found $frontend/.env"
        grep VITE_WS_URL $frontend/.env
    else
        print_error "Missing $frontend/.env"
    fi
done
echo ""

# Step 5: Show test instructions
echo "=========================================="
echo "Test Instructions"
echo "=========================================="
echo ""
print_info "1. Start the backend server:"
echo "   cd backend"
echo "   mvn spring-boot:run"
echo ""
print_info "2. In a new terminal, start the student frontend:"
echo "   cd student-frontend"
echo "   npm run dev"
echo ""
print_info "3. In another terminal, start the teacher frontend:"
echo "   cd teacher-frontend"
echo "   npm run dev"
echo ""
print_info "4. Open two browser windows:"
echo "   - Window 1: Student login (http://localhost:5173)"
echo "   - Window 2: Teacher login (http://localhost:5174)"
echo ""
print_info "5. Test sending a message from Student to Teacher"
echo ""
print_info "6. Check the backend logs for these messages:"
echo "   - '=== WebSocket 收到用户 X 的消息'"
echo "   - 'ChatRecordService.sendMessage - 开始保存消息'"
echo "   - 'ChatRecordService.sendMessage - 数据库插入结果：affectedRows=1'"
echo "   - '消息已保存到数据库，recordId=XXX'"
echo ""
print_info "7. Verify the message in database:"
echo "   mysql> USE tutoring;"
echo "   mysql> SELECT * FROM chat_records ORDER BY sent_at DESC LIMIT 5;"
echo ""
print_info "8. Refresh the browser and verify messages persist"
echo ""
echo "=========================================="
echo "For detailed test guide, see: CHAT_FIX_TEST.md"
echo "=========================================="
