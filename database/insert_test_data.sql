-- Test Data Insert Script - Direct SQL with hardcoded IDs
-- For student_tutoring_system database
-- Created: 2026-04-02

USE tutoring;
SET NAMES utf8mb4;

-- ========================================
-- 1. Insert Teacher Details
-- ========================================

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES 
(100001, 2039590574738759682, 'Math', 'Peking University Mathematics Master', '15 years of high school math teaching experience, specializing in college entrance exam coaching', 'Algebra, Geometry, Calculus', 'Mon-Fri evenings, weekends all day', 0),
(100002, 2039590679596359682, 'English', 'Shanghai International Studies University English PhD', '12 years of English teaching experience, senior IELTS/TOEFL instructor', 'English speaking, writing, exam preparation', 'Tue-Sat afternoons', 0),
(100003, 2039590680246476802, 'Chinese', 'Beijing Normal University Chinese Literature Master', '18 years of Chinese teaching experience, focusing on composition and reading comprehension', 'Classical poetry, modern reading, essay writing', 'Mon/Wed/Fri evenings, Sun all day', 0);

-- ========================================
-- 2. Insert Student Details
-- ========================================

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES 
(200001, 2039590680833679362, 15, 'Grade 9', 'Beijing No.1 High School', 'Haidian District, Beijing', 'Needs improvement in math and English', 'Cheerful personality, studies actively', 0),
(200002, 2039590681416687617, 14, 'Grade 8', 'Shanghai Experimental High School', 'Pudong New Area, Shanghai', 'Needs to improve English speaking and writing', 'Introverted, needs encouragement', 0),
(200003, 2039590682008084481, 16, 'Grade 10', 'Guangzhou Yucai High School', 'Tianhe District, Guangzhou', 'Needs Chinese composition and math tutoring', 'Active, needs focus improvement', 0),
(200004, 2039590682595287042, 13, 'Grade 7', 'Shenzhen Nanshan Foreign Language School', 'Nanshan District, Shenzhen', 'All subjects tutoring, especially English basics', 'Quiet and well-behaved, studies seriously', 0),
(200005, 2039590683048271874, 15, 'Grade 9', 'Hangzhou No.2 High School', 'Xihu District, Hangzhou', 'Needs math and physics competition coaching', 'Smart and eager to learn, has competition talent', 0);

-- ========================================
-- 3. Insert Parent Details
-- ========================================

INSERT INTO parents (id, user_id, deleted)
VALUES 
(300001, 2039590683568365570, 0),
(300002, 2039590684088459265, 0),
(300003, 2039590684541444098, 0);

-- ========================================
-- 4. Insert Parent-Student Relationships
-- ========================================

-- parent_chen -> student_ming (father-son)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (400001, 300001, 200001, 'Father-Son', NOW(), 0);

-- parent_liu -> student_hua (mother-son)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (400002, 300002, 200002, 'Mother-Son', NOW(), 0);

-- parent_liu -> student_fang (mother-daughter)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (400003, 300002, 200004, 'Mother-Daughter', NOW(), 0);

-- parent_zhao -> student_gang (father-son)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (400004, 300003, 200003, 'Father-Son', NOW(), 0);

-- parent_zhao -> student_jun (father-son)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (400005, 300003, 200005, 'Father-Son', NOW(), 0);

-- ========================================
-- 5. Verification Queries
-- ========================================

SELECT '=== Teachers ===' AS info;
SELECT u.username, u.name, t.subject, t.education, LEFT(t.experience, 50) AS experience_preview
FROM users u
JOIN teachers t ON u.id = t.user_id
WHERE u.username LIKE 'teacher_%';

SELECT '' AS '';
SELECT '=== Students ===' AS info;
SELECT u.username, u.name, s.age, s.grade, s.school
FROM users u
JOIN students s ON u.id = s.user_id
WHERE u.username LIKE 'student_%';

SELECT '' AS '';
SELECT '=== Parents ===' AS info;
SELECT u.username, u.name, p.id AS parent_id
FROM users u
JOIN parents p ON u.id = p.user_id
WHERE u.username LIKE 'parent_%';

SELECT '' AS '';
SELECT '=== Parent-Student Relationships ===' AS info;
SELECT pu.username AS parent, su.username AS student, psr.relationship
FROM parent_student_relations psr
JOIN parents p ON psr.parent_id = p.id
JOIN students s ON psr.student_id = s.id
JOIN users pu ON p.user_id = pu.id
JOIN users su ON s.user_id = su.id;
