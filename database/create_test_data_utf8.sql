-- 娴嬭瘯璐﹀彿鏁版嵁鑴氭湰
-- 鐢ㄤ簬鍒涘缓娴嬭瘯鐢ㄧ殑鏁欏笀銆佸鐢熴€佸闀胯处鍙?
-- 鎵ц鍓嶈纭繚宸茶繍琛?schema.sql 鍒涘缓鏁版嵁搴撶粨鏋?
-- 鎵€鏈夎处鍙峰瘑鐮佸潎涓猴細Test1234! (BCrypt 鍔犲瘑鍚庣殑鍝堝笇鍊肩浉鍚?

USE tutoring;

-- BCrypt 鍝堝笇鍊?(瀵嗙爜锛歍est1234!)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- ========================================
-- 1. 鍒涘缓鏁欏笀璐﹀彿 (3 涓?
-- ========================================

-- 鏁欏笀 1: 寮犺€佸笀 (鏁板)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (1001, 'teacher_zhang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '寮犳槑鍗?, 'zhang_math@example.com', '13800138001', 1, '1985-06-15 00:00:00', '123456001', 'zhang_math', '鍖椾含甯傛捣娣€鍖轰腑鍏虫潙澶ц 1 鍙?, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2001, 1001, '鏁板', '鍖椾含澶у鏁板绯荤澹?, '15 骞撮珮涓暟瀛︽暀瀛︾粡楠岋紝鎿呴暱楂樿€冨啿鍒鸿緟瀵?, '浠ｆ暟銆佸嚑浣曘€佸井绉垎', '鍛ㄤ竴鑷冲懆浜旀櫄涓婏紝鍛ㄦ湯鍏ㄥぉ', 0);

-- 鏁欏笀 2: 鏉庤€佸笀 (鑻辫)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (1002, 'teacher_li', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '鏉庨泤鏂?, 'li_english@example.com', '13800138002', 0, '1988-03-22 00:00:00', '123456002', 'li_english', '涓婃捣甯傛郸涓滄柊鍖轰笘绾ぇ閬?100 鍙?, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2002, 1002, '鑻辫', '涓婃捣澶栧浗璇ぇ瀛﹁嫳璇郴鍗氬＋', '12 骞磋嫳璇暀瀛︾粡楠岋紝闆呮€濇墭绂忚祫娣辫甯?, '鑻辫鍙ｈ銆佸啓浣溿€佽€冭瘯杈呭', '鍛ㄤ簩鑷冲懆鍏笅鍗?, 0);

-- 鏁欏笀 3: 鐜嬭€佸笀 (璇枃)
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (1003, 'teacher_wang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '鐜嬫檽鏂?, 'wang_chinese@example.com', '13800138003', 1, '1982-09-10 00:00:00', '123456003', 'wang_chinese', '骞垮窞甯傚ぉ娌冲尯澶╂渤璺?200 鍙?, NOW(), 0);

INSERT INTO teachers (id, user_id, subject, education, experience, specialties, availability, deleted)
VALUES (2003, 1003, '璇枃', '鍖椾含甯堣寖澶у涓枃绯荤澹?, '18 骞磋鏂囨暀瀛︾粡楠岋紝涓撴敞浣滄枃鍜岄槄璇荤悊瑙?, '鍙よ瘲鏂囥€佺幇浠ｆ枃闃呰銆佷綔鏂?, '鍛ㄤ竴銆佷笁銆佷簲鏅氫笂锛屽懆鏃ュ叏澶?, 0);

-- ========================================
-- 2. 鍒涘缓瀛︾敓璐﹀彿 (5 涓?
-- ========================================

-- 瀛︾敓 1: 灏忔槑
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (2001, 'student_ming', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '闄堟槑', 'ming_student@example.com', '13900139001', 1, '2010-05-20 00:00:00', '234567001', 'ming_student', '鍖椾含甯傛捣娣€鍖轰腑鍏虫潙灏忓尯 1 鏍?, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3001, 2001, 15, '鍒濅笁', '鍖椾含甯傜涓€涓', '鍖椾含甯傛捣娣€鍖轰腑鍏虫潙灏忓尯 1 鏍?, '闇€瑕佸姞寮烘暟瀛﹀拰鑻辫瀛︿範', '鎬ф牸寮€鏈楋紝瀛︿範绉瀬', 0);

-- 瀛︾敓 2: 灏忓崕
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (2002, 'student_hua', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '鏉庡崕', 'hua_student@example.com', '13900139002', 0, '2011-08-15 00:00:00', '234567002', 'hua_student', '涓婃捣甯傛郸涓滄柊鍖轰笘绾皬鍖?2 鏍?, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3002, 2002, 14, '鍒濅簩', '涓婃捣甯傚疄楠屼腑瀛?, '涓婃捣甯傛郸涓滄柊鍖轰笘绾皬鍖?2 鏍?, '闇€瑕佹彁楂樿嫳璇彛璇拰鍐欎綔鑳藉姏', '鎬ф牸鍐呭悜锛岄渶瑕侀紦鍔?, 0);

-- 瀛︾敓 3: 灏忓垰
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (2003, 'student_gang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '鐜嬪垰', 'gang_student@example.com', '13900139003', 1, '2009-12-05 00:00:00', '234567003', 'gang_student', '骞垮窞甯傚ぉ娌冲尯澶╂渤灏忓尯 3 鏍?, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3003, 2003, 16, '楂樹竴', '骞垮窞甯傝偛鎵嶄腑瀛?, '骞垮窞甯傚ぉ娌冲尯澶╂渤灏忓尯 3 鏍?, '闇€瑕佽鏂囦綔鏂囪緟瀵煎拰鏁板鎻愰珮', '娲绘臣濂藉姩锛屾敞鎰忓姏闇€瑕侀泦涓?, 0);

-- 瀛︾敓 4: 灏忚姵
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (2004, 'student_fang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '鍒樿姵', 'fang_student@example.com', '13900139004', 0, '2012-02-28 00:00:00', '234567004', 'fang_student', '娣卞湷甯傚崡灞卞尯绉戞妧鍥皬鍖?4 鏍?, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3004, 2004, 13, '鍒濅竴', '娣卞湷甯傚崡灞卞鍥借瀛︽牎', '娣卞湷甯傚崡灞卞尯绉戞妧鍥皬鍖?4 鏍?, '鍏ㄧ杈呭锛岀壒鍒槸鑻辫鍩虹', '鏂囬潤涔栧阀锛屽涔犺鐪?, 0);

-- 瀛︾敓 5: 灏忓啗
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (2005, 'student_jun', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '璧靛啗', 'jun_student@example.com', '13900139005', 1, '2010-11-11 00:00:00', '234567005', 'jun_student', '鏉窞甯傝タ婀栧尯鏂囦竴璺皬鍖?5 鏍?, NOW(), 0);

INSERT INTO students (id, user_id, age, grade, school, address, learning_needs, psychological_status, deleted)
VALUES (3005, 2005, 15, '鍒濅笁', '鏉窞甯傜浜屼腑瀛?, '鏉窞甯傝タ婀栧尯鏂囦竴璺皬鍖?5 鏍?, '闇€瑕佹暟瀛﹀拰鐗╃悊绔炶禌杈呭', '鑱槑濂藉锛屾湁绔炶禌澶╄祴', 0);

-- ========================================
-- 3. 鍒涘缓瀹堕暱璐﹀彿 (3 涓?
-- ========================================

-- 瀹堕暱 1: 闄堢埜鐖?(瀛︾敓 1 灏忔槑鐨勭埗浜?
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (3001, 'parent_chen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '闄堝缓鍥?, 'chen_parent@example.com', '13700137001', 1, '1978-04-10 00:00:00', '345678001', 'chen_parent', '鍖椾含甯傛捣娣€鍖轰腑鍏虫潙灏忓尯 1 鏍?, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4001, 3001, 0);

-- 瀹堕暱 2: 鍒樺濡?(瀛︾敓 2 灏忓崕鍜屽鐢?4 灏忚姵鐨勬瘝浜?
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (3002, 'parent_liu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '鍒樼編涓?, 'liu_parent@example.com', '13700137002', 0, '1980-07-25 00:00:00', '345678002', 'liu_parent', '涓婃捣甯傛郸涓滄柊鍖轰笘绾皬鍖?2 鏍?, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4002, 3002, 0);

-- 瀹堕暱 3: 璧电埜鐖?(瀛︾敓 3 灏忓垰鍜屽鐢?5 灏忓啗鐨勭埗浜?
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (3003, 'parent_zhao', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '璧靛織寮?, 'zhao_parent@example.com', '13700137003', 1, '1976-11-30 00:00:00', '345678003', 'zhao_parent', '骞垮窞甯傚ぉ娌冲尯澶╂渤灏忓尯 3 鏍?, NOW(), 0);

INSERT INTO parents (id, user_id, deleted)
VALUES (4003, 3003, 0);

-- ========================================
-- 4. 鍒涘缓绠＄悊鍛樿处鍙?(2 涓?
-- ========================================

-- 绠＄悊鍛?1: 绯荤粺绠＄悊鍛?
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (4001, 'admin_system', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, '绯荤粺绠＄悊鍛?, 'admin_chen@example.com', '13600136001', 1, '1980-01-01 00:00:00', '456789001', 'admin_system', '鍖椾含甯傛捣娣€鍖轰腑鍏虫潙绉戞妧鍥尯', NOW(), 0);

-- 绠＄悊鍛?2: 瓒呯骇绠＄悊鍛?
INSERT INTO users (id, username, password, role, name, email, phone, gender, birth_date, qq, wechat, address, created_at, deleted)
VALUES (4002, 'admin_super', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, '瓒呯骇绠＄悊鍛?, 'admin_li@example.com', '13600136002', 0, '1982-02-02 00:00:00', '456789002', 'admin_super', '涓婃捣甯傛郸涓滄柊鍖哄紶姹熼珮绉戞妧鍥尯', NOW(), 0);

-- ========================================
-- 4. 鍒涘缓瀹堕暱瀛︾敓鍏宠仈鍏崇郴
-- ========================================

-- 闄堢埜鐖?-> 灏忔槑 (鐖跺瓙)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5001, 4001, 3001, '鐖跺瓙', NOW(), 0);

-- 鍒樺濡?-> 灏忓崕 (姣嶅瓙)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5002, 4002, 3002, '姣嶅瓙', NOW(), 0);

-- 鍒樺濡?-> 灏忚姵 (姣嶅コ)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5003, 4002, 3004, '姣嶅コ', NOW(), 0);

-- 璧电埜鐖?-> 灏忓垰 (鐖跺瓙)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5004, 4003, 3003, '鐖跺瓙', NOW(), 0);

-- 璧电埜鐖?-> 灏忓啗 (鐖跺瓙)
INSERT INTO parent_student_relations (id, parent_id, student_id, relationship, created_at, deleted)
VALUES (5005, 4003, 3005, '鐖跺瓙', NOW(), 0);

-- ========================================
-- 楠岃瘉鏁版嵁
-- ========================================

-- 鏌ヨ鎵€鏈夊垱寤虹殑璐﹀彿
SELECT 
    u.id,
    u.username,
    u.role,
    CASE u.role 
        WHEN 1 THEN '鏁欏笀'
        WHEN 2 THEN '瀛︾敓'
        WHEN 3 THEN '瀹堕暱'
        WHEN 4 THEN '绠＄悊鍛?
    END AS role_name,
    u.name,
    u.email,
    u.phone
FROM users u
WHERE u.id >= 1001 AND u.id <= 4002
ORDER BY u.role, u.id;
