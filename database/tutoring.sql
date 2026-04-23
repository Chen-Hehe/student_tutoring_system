/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : tutoring

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 23/04/2026 12:18:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ai_matches
-- ----------------------------
DROP TABLE IF EXISTS `ai_matches`;
CREATE TABLE `ai_matches`  (
  `id` bigint NOT NULL COMMENT '?? (????)',
  `student_id` bigint NOT NULL COMMENT '?? ID',
  `teacher_id` bigint NOT NULL COMMENT '?? ID',
  `match_score` double NULL DEFAULT NULL COMMENT '????',
  `match_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '????',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_student_id`(`student_id` ASC) USING BTREE,
  INDEX `idx_teacher_id`(`teacher_id` ASC) USING BTREE,
  CONSTRAINT `ai_matches_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ai_matches_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'AI ?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ai_matches
-- ----------------------------

-- ----------------------------
-- Table structure for announcements
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `author_id` bigint NULL DEFAULT NULL,
  `publish_date` datetime NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'published',
  `view_count` int NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcements
-- ----------------------------
INSERT INTO `announcements` VALUES (1, '系统维护通知', '尊敬的用户，系统将于本周六进行维护升级，届时部分功能将暂时无法使用，给您带来不便敬请谅解。', 1, '2026-04-21 12:20:30', 'published', 156, '2026-04-21 12:20:30', '2026-04-21 12:35:13', 0);
INSERT INTO `announcements` VALUES (2, '新课程上线公告', '为了更好地服务广大学子，我们新增了多门优质课程，欢迎大家体验学习！', 1, '2026-04-21 12:20:30', 'published', 89, '2026-04-21 12:20:30', '2026-04-21 12:35:13', 0);
INSERT INTO `announcements` VALUES (3, '寒假班报名通知', '寒假班报名通道已开启，名额有限，请各位家长抓紧时间报名。', 1, '2026-04-21 12:20:30', 'published', 234, '2026-04-21 12:20:30', '2026-04-21 12:35:13', 0);
INSERT INTO `announcements` VALUES (4, '春季学期开学公告', '春季学期将于3月1日正式开学，请同学们做好新学期的准备。', 1, '2026-04-21 12:20:30', 'published', 445, '2026-04-21 12:20:30', '2026-04-21 12:35:13', 0);
INSERT INTO `announcements` VALUES (5, '期中考试安排通知', '2026年期中考试将于4月25日至27日进行，请各位同学做好准备。', 1, '2026-04-22 10:24:44', 'published', 0, '2026-04-22 10:24:44', '2026-04-22 10:24:44', 0);
INSERT INTO `announcements` VALUES (6, '教师培训计划', '为提高教师教学水平，学校将于5月1日至3日组织教师培训。', 1, '2026-04-22 10:24:44', 'draft', 0, '2026-04-22 10:24:44', '2026-04-22 10:24:44', 0);
INSERT INTO `announcements` VALUES (8, '暑期课程安排', '2026年暑期课程将于7月10日开始，8月20日结束。', 1, '2026-04-22 10:24:44', 'published', 0, '2026-04-22 10:24:44', '2026-04-22 10:29:56', 1);
INSERT INTO `announcements` VALUES (9, '校园安全提醒', '为确保校园安全，请注意以下事项。', 1, '2026-04-22 10:24:44', 'draft', 0, '2026-04-22 10:24:44', '2026-04-22 10:24:44', 1);
INSERT INTO `announcements` VALUES (10, '秋季学期教师调整', '亲爱的同学们：大家好！因学校教学工作安排，秋季学期部分课程的任课教师将进行调整。具体调整信息将同步更新至课程系统，请同学们留意查看。给大家带来的不便敬请谅解，祝大家学习顺利！', 1, '2026-04-22 10:56:15', 'draft', 0, '2026-04-22 10:56:15', '2026-04-22 10:56:15', 0);

-- ----------------------------
-- Table structure for chat_records
-- ----------------------------
DROP TABLE IF EXISTS `chat_records`;
CREATE TABLE `chat_records`  (
  `id` bigint NOT NULL COMMENT '?? (????)',
  `sender_id` bigint NOT NULL COMMENT '??? ID',
  `receiver_id` bigint NOT NULL COMMENT '??? ID',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '????',
  `type` tinyint NOT NULL COMMENT '?? (1:???2:???3:??)',
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '???????? OSS ??',
  `sent_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `is_read` tinyint NULL DEFAULT 0 COMMENT '???? (0:???1:??)',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  `recalled_at` datetime NULL DEFAULT NULL COMMENT '娑堟伅鎾ゅ洖鏃堕棿',
  `recalled_by` bigint NULL DEFAULT NULL COMMENT '鎾ゅ洖鑰?ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sender_id`(`sender_id` ASC) USING BTREE,
  INDEX `idx_receiver_id`(`receiver_id` ASC) USING BTREE,
  INDEX `idx_sent_at`(`sent_at` ASC) USING BTREE,
  INDEX `idx_recalled_at`(`recalled_at` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '?????' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chat_records
-- ----------------------------
INSERT INTO `chat_records` VALUES (9001, 2001, 1001, '张老师好！我是小明，我想请教一下数学题。', 1, NULL, '2026-04-19 09:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9002, 1001, 2001, '你好小明！什么问题？发给我看看。', 1, NULL, '2026-04-19 09:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9003, 2001, 1001, '就是这道二次函数的题目，我不太理解。', 1, NULL, '2026-04-19 10:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9004, 1001, 2001, '好的，这题的关键是找到顶点坐标。你先说说你的思路。', 1, NULL, '2026-04-19 10:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9005, 2001, 1001, '我觉得应该用配方法，但是配方后不知道怎么继续。', 1, NULL, '2026-04-19 11:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9006, 2002, 1002, '李老师，我想练习英语口语，有什么建议吗？', 1, NULL, '2026-04-20 07:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9007, 1002, 2002, '很好的想法！建议每天坚持朗读，可以找一些英文材料。', 1, NULL, '2026-04-20 07:49:45', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9008, 2002, 1002, '谢谢老师！我会努力的。', 1, NULL, '2026-04-20 08:49:45', 0, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (9009, 2003, 1003, '王老师，作文怎么写好开头啊？', 1, NULL, '2026-04-20 09:19:45', 0, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046110388286210050, 1001, 2001, '陈明今天状态怎么样？', 1, NULL, '2026-04-20 14:15:06', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046110616536039426, 2001, 1001, '谢谢老师今天还可以！', 1, NULL, '2026-04-20 14:16:01', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046113992514584577, 2001, 1001, '今天的作业是什么老师？', 1, NULL, '2026-04-20 14:29:25', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046114104766742529, 1001, 2001, '完成100页练习册', 1, NULL, '2026-04-20 14:29:52', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046117226620768257, 1001, 2001, '在吗', 1, NULL, '2026-04-20 14:42:16', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046118968968085506, 1001, 2001, '陈明你在吗', 1, NULL, '2026-04-20 14:49:12', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046121412930433026, 1001, 2001, '我是张老师', 1, NULL, '2026-04-20 14:58:55', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046124026124394497, 2001, 1001, '登在干嘛', 1, NULL, '2026-04-20 15:09:18', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046126594539921410, 1001, 2001, '气死我了调不好了', 1, NULL, '2026-04-20 15:19:30', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046127167213412353, 2001, 1001, '我生气了！', 1, NULL, '2026-04-20 15:21:47', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046130586779217922, 1001, 2001, '失败', 1, NULL, '2026-04-20 15:35:22', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046142208868450305, 2001, 1001, 'test1', 1, NULL, '2026-04-20 16:21:33', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046142369552236546, 1001, 2001, 'haoxiangkeyile', 1, NULL, '2026-04-20 16:22:11', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046143532834062337, 1001, 2001, 'buxing!', 1, NULL, '2026-04-20 16:26:48', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046147536708177922, 1001, 2001, 'XIANZAINE', 1, NULL, '2026-04-20 16:42:43', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046147649836945410, 2001, 1001, 'KEYIKE!', 1, NULL, '2026-04-20 16:43:10', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046147842854621185, 1001, 2001, 'HAIYOUBUG', 1, NULL, '2026-04-20 16:43:56', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046464617379110913, 2001, 1001, '今天还可以吗？', 1, NULL, '2026-04-21 13:42:41', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046464680474025986, 1001, 2001, '今天不行', 1, NULL, '2026-04-21 13:42:56', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046464775420485634, 1001, 2001, '教师端发送消息学生端可以不用更新', 1, NULL, '2026-04-21 13:43:19', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046465968217628673, 2001, 1001, '学生端发送的呢？', 1, NULL, '2026-04-21 13:48:03', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046466475657109506, 1001, 2001, 'trytry', 1, NULL, '2026-04-21 13:50:04', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046466564337278977, 1001, 2001, 'try2', 1, NULL, '2026-04-21 13:50:25', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046467816005672961, 2001, 1001, 'student try', 1, NULL, '2026-04-21 13:55:24', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046472780077703170, 2001, 1001, 's——try2', 1, NULL, '2026-04-21 14:15:07', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046476774820917249, 2001, 1001, '好了没有', 1, NULL, '2026-04-21 14:30:59', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046479294993641474, 2001, 1001, '到底好了没', 1, NULL, '2026-04-21 14:41:00', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046479485431820290, 2001, 1001, '你行不行啊', 1, NULL, '2026-04-21 14:41:46', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046479645662621698, 2001, 1001, '我恨你还是不行', 1, NULL, '2026-04-21 14:42:24', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046483041845092354, 2001, 1001, '1', 1, NULL, '2026-04-21 14:55:54', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046484072507219969, 1001, 2001, '不行就滚吧', 1, NULL, '2026-04-21 14:59:59', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046484129755275265, 2001, 1001, '学生-》老师', 1, NULL, '2026-04-21 15:00:13', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046484247082541057, 2001, 1001, '可以了！', 1, NULL, '2026-04-21 15:00:41', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046491355551211522, 2001, 1002, '在吗在吗？', 1, NULL, '2026-04-21 15:28:56', 0, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046493030974332929, 2001, 1001, '你听得见吗？', 1, NULL, '2026-04-21 15:35:35', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046493112255750146, 1001, 2001, '我看得到', 1, NULL, '2026-04-21 15:35:55', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046493134510727169, 2001, 1001, '你呢', 1, NULL, '2026-04-21 15:36:00', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046493947920490497, 2001, 1001, '222223333', 1, NULL, '2026-04-21 15:39:14', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046496277327880193, 2001, 1001, '嗨嗨', 1, NULL, '2026-04-21 15:48:29', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046498020707115010, 1001, 2001, '试试看', 1, NULL, '2026-04-21 15:55:25', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046498310294446081, 2001, 1001, '再试一下', 1, NULL, '2026-04-21 15:56:34', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046498517832802306, 2001, 1001, '试试看', 1, NULL, '2026-04-21 15:57:23', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046506166628491266, 2001, 1001, '小龙虾改不好', 1, NULL, '2026-04-21 16:27:47', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046506970588504066, 2001, 1001, '坏', 1, NULL, '2026-04-21 16:30:59', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507453415809026, 1001, 2001, '密码的', 1, NULL, '2026-04-21 16:32:54', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507568155189250, 1001, 2001, '好一半', 1, NULL, '2026-04-21 16:33:21', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507619384418306, 1001, 2001, '诶好像可以？', 1, NULL, '2026-04-21 16:33:33', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507684677148673, 2001, 1001, '怎么会这样？', 1, NULL, '2026-04-21 16:33:49', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507881863962625, 2001, 1001, 'test1', 1, NULL, '2026-04-21 16:34:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507916626354177, 1001, 2001, 'test2', 1, NULL, '2026-04-21 16:34:44', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046507993013018626, 1001, 2001, '再次试试', 1, NULL, '2026-04-21 16:35:02', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046509548349022209, 1001, 2001, '我恨你', 1, NULL, '2026-04-21 16:41:13', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046509594117267457, 2001, 1001, '啊啊啊啊', 1, NULL, '2026-04-21 16:41:24', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046549263189483522, 2001, 1001, '行不行', 1, NULL, '2026-04-21 19:19:02', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046549321804881921, 2001, 1001, '还是不行', 1, NULL, '2026-04-21 19:19:16', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046549354637893633, 1001, 2001, '12345', 1, NULL, '2026-04-21 19:19:24', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046770629252222978, 2001, 1001, '今天天气不错', 1, NULL, '2026-04-22 09:58:40', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046770701658492929, 2001, 1001, 'hi', 1, NULL, '2026-04-22 09:58:57', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046772876342202369, 2001, 1001, '1', 1, NULL, '2026-04-22 10:07:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046773201518202881, 1001, 2001, '试试看', 1, NULL, '2026-04-22 10:08:53', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046775213169315841, 1001, 2001, '干', 1, NULL, '2026-04-22 10:16:53', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046775733976043522, 2001, 1001, 'test已读', 1, NULL, '2026-04-22 10:18:57', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046776116060360705, 2001, 1001, '已读2', 1, NULL, '2026-04-22 10:20:28', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046776234184544258, 2001, 1001, '已读3', 1, NULL, '2026-04-22 10:20:56', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046778853024071682, 2001, 1001, '123456', 1, NULL, '2026-04-22 10:31:21', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046778875677507585, 1001, 2001, 'test', 1, NULL, '2026-04-22 10:31:26', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046779473789452289, 2001, 1001, 'hihi', 1, NULL, '2026-04-22 10:33:49', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046780487686946817, 1001, 2001, '撤回测试', 1, NULL, '2026-04-22 10:37:50', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046782483265581057, 2001, 1001, '行不行！', 1, NULL, '2026-04-22 10:45:46', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046787220534726658, 2001, 1001, '撤回测试', 1, NULL, '2026-04-22 11:04:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046788118090616833, 2001, 1001, '不行就滚吧', 1, NULL, '2026-04-22 11:08:09', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046797294497959938, 2001, 1001, 'test撤回', 1, NULL, '2026-04-22 11:44:37', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046800831533674498, 2001, 1001, '解决雪花算法问题', 1, NULL, '2026-04-22 11:58:41', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046804736728494082, 2001, 1001, '没有解决', 1, NULL, '2026-04-22 12:14:12', 1, 0, '2026-04-22 12:16:13', 2001);
INSERT INTO `chat_records` VALUES (2046804964101713922, 2001, 1001, '111', 1, NULL, '2026-04-22 12:15:06', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046808994790109186, 1001, 2001, '2', 1, NULL, '2026-04-22 12:31:07', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046809917444714498, 2001, 1001, '学生端debug', 1, NULL, '2026-04-22 12:34:47', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046811631686119426, 1001, 2001, '教师端debug', 1, NULL, '2026-04-22 12:41:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046816098129129473, 2001, 1001, '1259test', 1, NULL, '2026-04-22 12:59:20', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046817345775185922, 2001, 1001, 'test1304', 1, NULL, '2026-04-22 13:04:18', 1, 0, '2026-04-22 13:04:28', 2001);
INSERT INTO `chat_records` VALUES (2046817805038891010, 2001, 1001, 'test1306', 1, NULL, '2026-04-22 13:06:07', 1, 0, '2026-04-22 13:06:11', 2001);
INSERT INTO `chat_records` VALUES (2046818141979914241, 1001, 2001, '教师端test', 1, NULL, '2026-04-22 13:07:28', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046818224825806849, 1001, 2001, '为什么到左边去了？', 1, NULL, '2026-04-22 13:07:48', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046818388906979329, 2001, 1001, 'test1308', 1, NULL, '2026-04-22 13:08:27', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046818664959291394, 1001, 2001, '奇怪！改到什么了！', 1, NULL, '2026-04-22 13:09:32', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046975104902606850, 1001, 2001, 'test0422', 1, NULL, '2026-04-22 23:31:11', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046975160183533569, 2001, 1001, '？', 1, NULL, '2026-04-22 23:31:24', 1, 0, '2026-04-22 23:31:58', 2001);
INSERT INTO `chat_records` VALUES (2046975208506109953, 1001, 2001, 'test2431', 1, NULL, '2026-04-22 23:31:35', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046975240038887425, 1001, 2001, '刚刚为何不行', 1, NULL, '2026-04-22 23:31:43', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046975503617339394, 1001, 2001, 'hi', 1, NULL, '2026-04-22 23:32:46', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046975539638022146, 2001, 1001, '怎么样？', 1, NULL, '2026-04-22 23:32:54', 1, 0, '2026-04-22 23:33:22', 2001);
INSERT INTO `chat_records` VALUES (2046975585922166786, 2001, 1001, '试试看已读', 1, NULL, '2026-04-22 23:33:05', 1, 0, '2026-04-22 23:34:05', 2001);
INSERT INTO `chat_records` VALUES (2046976099086872578, 1001, 2001, '我去你的', 1, NULL, '2026-04-22 23:35:08', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046976487311650817, 1001, 2001, '再试一次', 1, NULL, '2026-04-22 23:36:40', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046976873430888450, 2001, 1001, '已读？', 1, NULL, '2026-04-22 23:38:12', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046976903550185473, 1001, 2001, 'hi', 1, NULL, '2026-04-22 23:38:19', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046978259757412353, 2001, 1001, 'test1', 1, NULL, '2026-04-22 23:43:43', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046978293613834241, 1001, 2001, 'try', 1, NULL, '2026-04-22 23:43:51', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046978320209915905, 2001, 1001, 'test2', 1, NULL, '2026-04-22 23:43:57', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046978413222801409, 1001, 2001, '教师端ok', 1, NULL, '2026-04-22 23:44:19', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046978445267283969, 2001, 1001, '学生端不ok', 1, NULL, '2026-04-22 23:44:27', 1, 0, '2026-04-22 23:44:38', 2001);
INSERT INTO `chat_records` VALUES (2046978522161459202, 1001, 2001, '再试一下撤回', 1, NULL, '2026-04-22 23:44:45', 1, 0, '2026-04-22 23:44:48', 1001);
INSERT INTO `chat_records` VALUES (2046978560941993986, 2001, 1001, '试试看', 1, NULL, '2026-04-22 23:44:55', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046979815017918465, 1001, 2001, '已读功能', 1, NULL, '2026-04-22 23:49:54', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046979845527285762, 2001, 1001, '学生端呢', 1, NULL, '2026-04-22 23:50:01', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046979876649021442, 1001, 2001, '教师端ok', 1, NULL, '2026-04-22 23:50:08', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046979963836018689, 1001, 2001, '刷新之后', 1, NULL, '2026-04-22 23:50:29', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046979992260816898, 2001, 1001, '试试看', 1, NULL, '2026-04-22 23:50:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046980037047595010, 2001, 1001, '艾玛不行', 1, NULL, '2026-04-22 23:50:47', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046980087584763906, 1001, 2001, '教师端ok', 1, NULL, '2026-04-22 23:50:59', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046980203188170754, 2001, 1001, 'test', 1, NULL, '2026-04-22 23:51:26', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046980495510188034, 1001, 2001, '教师端', 1, NULL, '2026-04-22 23:52:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046981257799065601, 1001, 2001, '测试', 1, NULL, '2026-04-22 23:55:38', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046981308621447170, 2001, 1001, '学生测试', 1, NULL, '2026-04-22 23:55:50', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046981538297339906, 1001, 2001, '教师测试', 1, NULL, '2026-04-22 23:56:44', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046983188374282242, 1001, 2001, '教师测试2', 1, NULL, '2026-04-23 00:03:18', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046983224831172610, 1001, 2001, '又可以了？', 1, NULL, '2026-04-23 00:03:27', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046983263842394113, 2001, 1001, '学生端呢？', 1, NULL, '2026-04-23 00:03:36', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046983287552794625, 2001, 1001, '曹尼玛', 1, NULL, '2026-04-23 00:03:42', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046984556707291137, 2001, 1001, '008', 1, NULL, '2026-04-23 00:08:44', 1, 0, NULL, NULL);
INSERT INTO `chat_records` VALUES (2046984570670129153, 1001, 2001, '009', 1, NULL, '2026-04-23 00:08:47', 1, 0, NULL, NULL);

-- ----------------------------
-- Table structure for grade_records
-- ----------------------------
DROP TABLE IF EXISTS `grade_records`;
CREATE TABLE `grade_records`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `report_id` bigint NOT NULL,
  `subject` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `report_id`(`report_id` ASC) USING BTREE,
  CONSTRAINT `grade_records_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `learning_reports` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of grade_records
-- ----------------------------
INSERT INTO `grade_records` VALUES (1, 1, '数学', 92, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `grade_records` VALUES (2, 1, '语文', 88, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `grade_records` VALUES (3, 1, '英语', 90, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `grade_records` VALUES (4, 2, '数学', 85, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);
INSERT INTO `grade_records` VALUES (5, 2, '语文', 92, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);
INSERT INTO `grade_records` VALUES (6, 2, '英语', 88, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);

-- ----------------------------
-- Table structure for learning_materials
-- ----------------------------
DROP TABLE IF EXISTS `learning_materials`;
CREATE TABLE `learning_materials`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `subject` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploader_id` bigint NULL DEFAULT NULL,
  `view_count` int NULL DEFAULT 0,
  `download_count` int NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  `tags` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of learning_materials
-- ----------------------------
INSERT INTO `learning_materials` VALUES (1, '小学数学基础知识总结', '包含小学阶段数学的基本概念、公式和解题方法', '语文', '小学', 'document', 'https://example.com/materials/math-basics.pdf', 1001, 0, 0, '2026-04-21 11:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (2, '初中语文阅读理解技巧', '详细讲解初中语文阅读理解的解题技巧和方法', '语文', '初中', 'document', 'https://example.com/materials/chinese-reading.pdf', 1002, 0, 0, '2026-04-21 11:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (3, '高中英语语法大全', '高中英语语法的系统讲解和练习', '英语', '高中', 'document', 'https://example.com/materials/english-grammar.pdf', 1003, 0, 0, '2026-04-21 11:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (4, '物理实验视频教程', '物理实验的操作演示和原理讲解', '物理', '高中', 'video', 'https://example.com/materials/physics-experiments.mp4', 1001, 0, 0, '2026-04-21 11:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (5, '化学元素周期表详解', '化学元素周期表的结构和元素性质', '化学', '高中', 'document', 'https://example.com/materials/periodic-table.pdf', 1002, 0, 0, '2026-04-21 11:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (6, '分数加减法练习', '包含分数加减法的详细讲解和练习题，适合小学三年级学生使用。', '数学', '小学', 'document', 'https://example.com/resources/fraction-practice.pdf', 1001, 0, 0, '2026-04-21 11:33:15', 0, '分数,加减法,小学');
INSERT INTO `learning_materials` VALUES (7, '作文写作技巧', '详细讲解初中作文的写作技巧和方法，包括审题、立意、结构等方面。', '语文', '初中', 'video', 'https://example.com/resources/essay-writing.mp4', 1002, 0, 0, '2026-04-21 11:33:15', 0, '作文,写作技巧,初中');
INSERT INTO `learning_materials` VALUES (8, '英语单词记忆方法', '介绍几种有效的英语单词记忆方法，帮助小学生快速掌握英语单词。', '英语', '小学', 'document', 'https://example.com/resources/english-vocabulary.pdf', 1003, 0, 0, '2026-04-21 11:33:15', 0, '英语,单词记忆,小学');
INSERT INTO `learning_materials` VALUES (9, '数学应用题解题思路', '详细讲解初中数学应用题的解题思路和方法，帮助学生提高解题能力。', '数学', '初中', 'video', 'https://example.com/resources/math-applications.mp4', 1001, 0, 0, '2026-04-21 11:33:15', 0, '数学,应用题,初中');
INSERT INTO `learning_materials` VALUES (10, '高中数学函数专题', '详细讲解高中数学函数的概念和应用', '数学', '高中', 'document', 'http://example.com/math', 1001, 100, 50, '2026-04-22 10:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (11, '初中语文古诗词赏析', '初中语文古诗词的赏析方法', '语文', '初中', 'courseware', 'http://example.com/chinese', 1002, 80, 30, '2026-04-22 10:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (12, '高中英语阅读理解技巧', '高中英语阅读理解的解题技巧', '英语', '高中', 'video', 'http://example.com/english', 1001, 120, 60, '2026-04-22 10:24:25', 0, NULL);
INSERT INTO `learning_materials` VALUES (13, '初中物理实验报告模板', '初中物理实验报告的撰写方法', '物理', '初中', 'document', 'http://example.com/physics', 1002, 60, 20, '2026-04-22 10:24:25', 0, NULL);

-- ----------------------------
-- Table structure for learning_progress
-- ----------------------------
DROP TABLE IF EXISTS `learning_progress`;
CREATE TABLE `learning_progress`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `report_id` bigint NOT NULL,
  `subject` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `report_id`(`report_id` ASC) USING BTREE,
  CONSTRAINT `learning_progress_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `learning_reports` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of learning_progress
-- ----------------------------
INSERT INTO `learning_progress` VALUES (1, 1, '数学', 85, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `learning_progress` VALUES (2, 1, '语文', 78, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `learning_progress` VALUES (3, 1, '英语', 90, '2026-04-20 20:46:36', '2026-04-20 20:46:36', 0);
INSERT INTO `learning_progress` VALUES (4, 2, '数学', 75, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);
INSERT INTO `learning_progress` VALUES (5, 2, '语文', 85, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);
INSERT INTO `learning_progress` VALUES (6, 2, '英语', 80, '2026-04-20 20:47:02', '2026-04-20 20:47:02', 0);

-- ----------------------------
-- Table structure for learning_reports
-- ----------------------------
DROP TABLE IF EXISTS `learning_reports`;
CREATE TABLE `learning_reports`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `report_period` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `overall` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_rank` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  CONSTRAINT `learning_reports_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of learning_reports
-- ----------------------------
INSERT INTO `learning_reports` VALUES (1, 3001, '2026年3月', '优秀', '第5名', '小明在本学习期间表现优秀，特别是在数学方面有很大进步。他上课认真听讲，积极参与课堂讨论，作业完成质量高。建议继续保持这种学习态度，在语文阅读理解方面可以多加强练习，提高阅读速度和理解能力。总体来说，小明是一个很有潜力的学生，只要继续努力，成绩会更上一层楼。', '2026-04-20 20:46:21', '2026-04-20 20:46:21', 0);
INSERT INTO `learning_reports` VALUES (2, 3002, '2026年3月', '良好', '第8名', '小红在本学习期间表现良好，尤其是在语文方面有显著进步。她上课认真，作业完成及时，但是在数学方面还需要加强练习。建议在家多做一些数学练习题，提高计算能力和解题技巧。总体来说，小红是一个勤奋的学生，只要继续努力，成绩会有更大的提升。', '2026-04-20 20:46:49', '2026-04-20 20:46:49', 0);

-- ----------------------------
-- Table structure for learning_resources
-- ----------------------------
DROP TABLE IF EXISTS `learning_resources`;
CREATE TABLE `learning_resources`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '??',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '??',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '?????/??/???',
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '????',
  `uploader_id` bigint NOT NULL COMMENT '??? ID',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  `download_count` int NULL DEFAULT 0,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_uploader_id`(`uploader_id` ASC) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of learning_resources
-- ----------------------------
INSERT INTO `learning_resources` VALUES (1, '三年级数学基础教程', '', 'courseware', 'http://example.com/courseware1', 1001, '数学', '2026-04-21 10:43:16', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (2, '五年级语文阅读技巧', '', 'lesson_plan', 'http://example.com/lesson1', 1002, '语文', '2026-04-21 10:43:16', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (3, '四年级数学练习题', '四年级数学同步练习', 'exercise', 'http://example.com/exercise1', 1001, '数学', '2026-04-21 10:43:16', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (4, '六年级作文指导视频', '六年级作文写作技巧', 'video', 'http://example.com/video1', 1002, '语文', '2026-04-21 10:43:16', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (5, '小学生心理辅导指南', '小学生心理健康教育', 'other', 'http://example.com/guide1', 1001, '心理', '2026-04-21 10:43:16', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (6, '初中数学几何证明技巧', '详细讲解几何证明的方法和技巧', 'courseware', 'http://example.com/geometry', 1001, '数学', '2026-04-22 10:23:38', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (7, '高中物理力学专题', '高中物理力学部分的详细讲解', 'video', 'http://example.com/physics', 1002, '物理', '2026-04-22 10:23:38', 0, 0, NULL, NULL);
INSERT INTO `learning_resources` VALUES (10, '小学语文作文指导', '小学语文作文的写作技巧和方法', 'courseware', 'http://example.com/chinese', 1001, '语文', '2026-04-22 10:23:38', 0, 0, NULL, NULL);

-- ----------------------------
-- Table structure for parent_student_relations
-- ----------------------------
DROP TABLE IF EXISTS `parent_student_relations`;
CREATE TABLE `parent_student_relations`  (
  `id` bigint NOT NULL,
  `parent_id` bigint NULL DEFAULT NULL,
  `student_id` bigint NULL DEFAULT NULL,
  `relationship` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of parent_student_relations
-- ----------------------------
INSERT INTO `parent_student_relations` VALUES (3001, 3001, 3001, '父子', '2026-04-20 19:05:29', 0);
INSERT INTO `parent_student_relations` VALUES (3002, 3001, 3002, '父女', '2026-04-20 19:05:29', 0);
INSERT INTO `parent_student_relations` VALUES (400001, 300001, 200001, 'Father-Son', '2026-04-07 16:18:19', 0);
INSERT INTO `parent_student_relations` VALUES (400002, 300002, 200002, 'Mother-Son', '2026-04-07 16:18:20', 0);
INSERT INTO `parent_student_relations` VALUES (400003, 300002, 200004, 'Mother-Daughter', '2026-04-07 16:18:20', 0);
INSERT INTO `parent_student_relations` VALUES (400004, 300003, 200003, 'Father-Son', '2026-04-07 16:18:20', 0);
INSERT INTO `parent_student_relations` VALUES (400005, 300003, 200005, 'Father-Son', '2026-04-07 16:18:20', 0);

-- ----------------------------
-- Table structure for parents
-- ----------------------------
DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents`  (
  `id` bigint NOT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of parents
-- ----------------------------
INSERT INTO `parents` VALUES (3001, 3001, 0);
INSERT INTO `parents` VALUES (4001, 1003, 0);
INSERT INTO `parents` VALUES (4002, 3002, 0);
INSERT INTO `parents` VALUES (4003, 3003, 0);
INSERT INTO `parents` VALUES (300001, 2039590683568365570, 0);
INSERT INTO `parents` VALUES (300002, 2039590684088459265, 0);
INSERT INTO `parents` VALUES (300003, 2039590684541444098, 0);

-- ----------------------------
-- Table structure for psychological_assessment_details
-- ----------------------------
DROP TABLE IF EXISTS `psychological_assessment_details`;
CREATE TABLE `psychological_assessment_details`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assessment_id` bigint NOT NULL,
  `assessment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `percentage` int NOT NULL,
  `level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `assessment_id`(`assessment_id` ASC) USING BTREE,
  CONSTRAINT `psychological_assessment_details_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `psychological_assessments` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of psychological_assessment_details
-- ----------------------------
INSERT INTO `psychological_assessment_details` VALUES (1, 1, '情绪稳定性', 85, 'good', '2026-04-20 21:18:57', '2026-04-20 21:18:57', 0);
INSERT INTO `psychological_assessment_details` VALUES (2, 1, '社交互动', 90, 'good', '2026-04-20 21:18:57', '2026-04-20 21:18:57', 0);
INSERT INTO `psychological_assessment_details` VALUES (3, 1, '学习压力', 60, 'warning', '2026-04-20 21:18:57', '2026-04-20 21:18:57', 0);
INSERT INTO `psychological_assessment_details` VALUES (4, 1, '自我认知', 80, 'good', '2026-04-20 21:18:57', '2026-04-20 21:18:57', 0);
INSERT INTO `psychological_assessment_details` VALUES (5, 2, '情绪稳定性', 80, 'good', '2026-04-20 21:19:09', '2026-04-20 21:19:09', 0);
INSERT INTO `psychological_assessment_details` VALUES (6, 2, '社交互动', 85, 'good', '2026-04-20 21:19:09', '2026-04-20 21:19:09', 0);
INSERT INTO `psychological_assessment_details` VALUES (7, 2, '学习压力', 45, 'good', '2026-04-20 21:19:09', '2026-04-20 21:19:09', 0);
INSERT INTO `psychological_assessment_details` VALUES (8, 2, '自我认知', 88, 'good', '2026-04-20 21:19:09', '2026-04-20 21:19:09', 0);

-- ----------------------------
-- Table structure for psychological_assessments
-- ----------------------------
DROP TABLE IF EXISTS `psychological_assessments`;
CREATE TABLE `psychological_assessments`  (
  `id` bigint NOT NULL COMMENT '?? (????)',
  `student_id` bigint NOT NULL COMMENT '?? ID',
  `assessor_id` bigint NOT NULL COMMENT '??? ID',
  `assessment_date` datetime NOT NULL COMMENT '????',
  `score` int NULL DEFAULT NULL COMMENT '????',
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '????',
  `recommendations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '??',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_student_id`(`student_id` ASC) USING BTREE,
  INDEX `idx_assessment_date`(`assessment_date` ASC) USING BTREE,
  CONSTRAINT `psychological_assessments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of psychological_assessments
-- ----------------------------
INSERT INTO `psychological_assessments` VALUES (1, 3001, 1001, '2026-03-30 00:00:00', 85, '小明在情绪稳定性和社交能力方面表现良好，但学习压力适中，需要适当放松。', '建议家长多与孩子沟通，鼓励参加课外活动，减轻学习压力。', '2026-04-20 19:05:29', 0);
INSERT INTO `psychological_assessments` VALUES (2, 3002, 1001, '2026-03-30 00:00:00', 90, '小红在各方面表现优秀，情绪稳定，社交能力强，学习压力适中。', '建议保持当前状态，继续鼓励孩子全面发展。', '2026-04-20 19:05:29', 0);

-- ----------------------------
-- Table structure for psychological_statuses
-- ----------------------------
DROP TABLE IF EXISTS `psychological_statuses`;
CREATE TABLE `psychological_statuses`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `emotion_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emotion_level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emotion_percentage` int NOT NULL,
  `social_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `social_level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `social_percentage` int NOT NULL,
  `stress_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stress_level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stress_percentage` int NOT NULL,
  `mental_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mental_level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mental_percentage` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  CONSTRAINT `psychological_statuses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of psychological_statuses
-- ----------------------------
INSERT INTO `psychological_statuses` VALUES (1, 3001, '良好', 'good', 85, '优秀', 'good', 90, '中等', 'warning', 60, '良好', 'good', 80, '2026-04-20 21:17:33', '2026-04-20 21:17:33', 0);

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` bigint NOT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `age` int NULL DEFAULT NULL,
  `grade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `school` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `learning_needs` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `psychological_status` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (3001, 2001, 15, '三年级', '北京市第一中学', '北京市海淀区中关村大街 1 号', '需要数学辅导', '性格开朗', 0);
INSERT INTO `students` VALUES (3002, 2002, 14, '四年级', '上海市实验中学', '上海市浦东新区世纪大道 100 号', '需要语文辅导', '性格内向', 0);
INSERT INTO `students` VALUES (3003, 2003, 16, '高一', '广州市育才中学', '广州市天河区天河路 200 号', '需要语文作文辅导和数学提高', '活泼好动，注意力需要集中', 0);
INSERT INTO `students` VALUES (3004, 2004, 13, '初一', '深圳市南山外国语学校', '深圳市南山区科技园南区 30 号', '全科辅导，特别是英语基础', '文静乖巧，学习认真', 0);
INSERT INTO `students` VALUES (3005, 2005, 15, '初三', '杭州市第二中学', '杭州市西湖区文一路 1 号', '需要数学和物理竞赛辅导', '聪明好学，有竞赛天赋', 0);
INSERT INTO `students` VALUES (200001, 2039590680833679362, 15, 'Grade 9', 'Beijing No.1 High School', 'Haidian District, Beijing', 'Needs improvement in math and English', 'Cheerful personality, studies actively', 0);
INSERT INTO `students` VALUES (200002, 2039590681416687617, 14, 'Grade 8', 'Shanghai Experimental High School', 'Pudong New Area, Shanghai', 'Needs to improve English speaking and writing', 'Introverted, needs encouragement', 0);
INSERT INTO `students` VALUES (200003, 2039590682008084481, 16, 'Grade 10', 'Guangzhou Yucai High School', 'Tianhe District, Guangzhou', 'Needs Chinese composition and math tutoring', 'Active, needs focus improvement', 0);
INSERT INTO `students` VALUES (200004, 2039590682595287042, 13, 'Grade 7', 'Shenzhen Nanshan Foreign Language School', 'Nanshan District, Shenzhen', 'All subjects tutoring, especially English basics', 'Quiet and well-behaved, studies seriously', 0);
INSERT INTO `students` VALUES (200005, 2039590683048271874, 15, 'Grade 9', 'Hangzhou No.2 High School', 'Xihu District, Hangzhou', 'Needs math and physics competition coaching', 'Smart and eager to learn, has competition talent', 0);

-- ----------------------------
-- Table structure for teacher_communications
-- ----------------------------
DROP TABLE IF EXISTS `teacher_communications`;
CREATE TABLE `teacher_communications`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `sender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `send_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `teacher_id`(`teacher_id` ASC) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  CONSTRAINT `teacher_communications_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `teacher_communications_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `teacher_communications_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher_communications
-- ----------------------------
INSERT INTO `teacher_communications` VALUES (1, 3001, 2001, 3001, '李老师', '您好，王家长！小明最近在数学学习上有很大进步，尤其是在应用题方面。建议在家多练习一些实际生活中的数学问题，帮助他巩固所学知识。', '2026-03-30 10:00:00', '2026-03-30 10:00:00', 0);
INSERT INTO `teacher_communications` VALUES (2, 3001, 2001, 3001, '王家长', '谢谢李老师的反馈！我们会按照您的建议，在家多帮助小明练习数学应用题。请问小明在课堂上的表现如何？', '2026-03-30 10:30:00', '2026-03-30 10:30:00', 0);
INSERT INTO `teacher_communications` VALUES (3, 3001, 2001, 3001, '李老师', '小明在课堂上表现很积极，经常主动回答问题，而且作业完成质量也很好。他是个很有潜力的学生，只要继续保持，数学成绩会越来越好的。', '2026-03-30 11:00:00', '2026-03-30 11:00:00', 0);
INSERT INTO `teacher_communications` VALUES (4, 3001, 2003, 3002, '张老师', '您好，王家长！小红最近在语文学习上有很大进步，尤其是在作文方面。建议在家多阅读一些经典文学作品，帮助她提高写作水平。', '2026-03-29 14:00:00', '2026-03-29 14:00:00', 0);
INSERT INTO `teacher_communications` VALUES (5, 3001, 2003, 3002, '王家长', '谢谢张老师的反馈！我们会按照您的建议，在家多帮助小红阅读文学作品。请问小红在课堂上的表现如何？', '2026-03-29 14:30:00', '2026-03-29 14:30:00', 0);
INSERT INTO `teacher_communications` VALUES (6, 3001, 2003, 3002, '张老师', '小红在课堂上表现很认真，总是认真听讲并做好笔记。她的作文进步很大，特别是在描写方面，已经能够生动地描述事物和场景了。', '2026-03-29 15:00:00', '2026-03-29 15:00:00', 0);

-- ----------------------------
-- Table structure for teacher_student_matches
-- ----------------------------
DROP TABLE IF EXISTS `teacher_student_matches`;
CREATE TABLE `teacher_student_matches`  (
  `id` bigint NOT NULL COMMENT '?? (????)',
  `student_id` bigint NOT NULL COMMENT '?? ID',
  `teacher_id` bigint NOT NULL COMMENT '?? ID',
  `requester_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '??????student/teacher?',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '?? (0:????1:??????2:????3:???)',
  `request_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '????',
  `student_confirm` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:????2:???)',
  `parent_confirm` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:????2:???)',
  `teacher_confirm` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:????2:???)',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_student_id`(`student_id` ASC) USING BTREE,
  INDEX `idx_teacher_id`(`teacher_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `teacher_student_matches_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `teacher_student_matches_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher_student_matches
-- ----------------------------
INSERT INTO `teacher_student_matches` VALUES (3, 3001, 2001, 'teacher', 2, '为小明提供数学辅导，重点加强分数的加减法', 0, 1, 1, '2026-03-30 09:30:00', '2026-04-20 22:12:00', 0);
INSERT INTO `teacher_student_matches` VALUES (4, 3002, 2003, 'teacher', 2, '为小红提供语文辅导，重点加强作文指导', 0, 1, 1, '2026-03-29 16:45:00', '2026-04-20 22:12:00', 0);
INSERT INTO `teacher_student_matches` VALUES (101, 3001, 2001, 'teacher', 2, '数学辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (102, 3002, 2001, 'student', 2, '需要数学辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (103, 3003, 2001, 'teacher', 2, '数学和物理辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (104, 3004, 2001, 'student', 2, '数学基础薄弱', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (105, 3005, 2001, 'teacher', 2, '中考数学冲刺', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (201, 3001, 2002, 'student', 2, '语文辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (202, 3002, 2002, 'teacher', 2, '语文写作辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (301, 3003, 2003, 'student', 2, '英语辅导', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);
INSERT INTO `teacher_student_matches` VALUES (302, 3004, 2003, 'teacher', 2, '英语口语练习', 1, 1, 1, '2026-04-23 09:08:24', '2026-04-23 09:08:24', 0);

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers`  (
  `id` bigint NOT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `subject` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `education` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `experience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `specialties` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `availability` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teachers
-- ----------------------------
INSERT INTO `teachers` VALUES (2001, 1001, '数学', '北京大学数学系硕士', '15年教学经验，曾获北京市优秀教师称号', '代数、几何、微积分、数学竞赛', '周一至周五晚上 18:00-21:00，周六上午 9:00-12:00', 0);
INSERT INTO `teachers` VALUES (2002, 1002, '数学', '上海外国语大学英语系博士', '12年教学经验，擅长英语口语和写作教学', '英语口语、写作、语法、听力', '周二至周六下午 14:00-17:00，周日上午 9:00-12:00', 0);
INSERT INTO `teachers` VALUES (2003, 1003, '语文', '北京师范大学中文系硕士', '18年教学经验，专注于古诗文和作文教学', '古诗文、现代文阅读、作文指导', '周一、三、五晚上 19:00-21:00，周六下午 14:00-17:00', 0);
INSERT INTO `teachers` VALUES (100001, 2039590574738759682, 'Math', 'Peking University Mathematics Master', '15 years of high school math teaching experience, specializing in college entrance exam coaching', 'Algebra, Geometry, Calculus', 'Mon-Fri evenings, weekends all day', 0);
INSERT INTO `teachers` VALUES (100002, 2039590679596359682, 'English', 'Shanghai International Studies University English PhD', '12 years of English teaching experience, senior IELTS/TOEFL instructor', 'English speaking, writing, exam preparation', 'Tue-Sat afternoons', 0);
INSERT INTO `teachers` VALUES (100003, 2039590680246476802, 'Chinese', 'Beijing Normal University Chinese Literature Master', '18 years of Chinese teaching experience, focusing on composition and reading comprehension', 'Classical poetry, modern reading, essay writing', 'Mon/Wed/Fri evenings, Sun all day', 0);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL COMMENT '?? (????)',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '???',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '??',
  `role` tinyint NOT NULL COMMENT '?? (1:???2:???3:???4:???)',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '????',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `gender` tinyint NULL DEFAULT NULL COMMENT '?? (0:??1:?)',
  `birth_date` datetime NULL DEFAULT NULL COMMENT '????',
  `qq` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'QQ ?',
  `wechat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '??',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '???? (0:????1:???)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  INDEX `idx_username`(`username` ASC) USING BTREE,
  INDEX `idx_role`(`role` ASC) USING BTREE,
  INDEX `idx_phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '???' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1001, 'teacher_zhang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '张明华', 'zhang_math@example.com', '13800138001', 1, '1985-06-15 00:00:00', '123456001', 'zhang_math', '北京市海淀区中关村大街 1 号', NULL, '2026-04-20 09:49:45', '2026-04-20 13:31:03', 0);
INSERT INTO `users` VALUES (1002, 'teacher_li', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '李雅文', 'li_english@example.com', '13800138002', 0, '1988-03-22 00:00:00', '123456002', 'li_english', '上海市浦东新区世纪大道 100 号', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (1003, 'teacher_wang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '王晓文', 'wang_chinese@example.com', '13800138003', 1, '1982-09-10 00:00:00', '123456003', 'wang_chinese', '广州市天河区天河路 200 号', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (2001, 'student_ming', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '陈明', 'ming_student@example.com', '13900139001', 1, '2010-05-20 00:00:00', '234567001', 'ming_student', '北京市海淀区中关村小区 1 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 13:31:00', 0);
INSERT INTO `users` VALUES (2002, 'student_hua', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '李华', 'hua_student@example.com', '13900139002', 0, '2011-08-15 00:00:00', '234567002', 'hua_student', '上海市浦东新区世纪小区 2 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (2003, 'student_gang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '王刚', 'gang_student@example.com', '13900139003', 1, '2009-12-05 00:00:00', '234567003', 'gang_student', '广州市天河区天河小区 3 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (2004, 'student_fang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '刘芳', 'fang_student@example.com', '13900139004', 0, '2012-02-28 00:00:00', '234567004', 'fang_student', '深圳市南山区科技园小区 4 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (2005, 'student_jun', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '赵军', 'jun_student@example.com', '13900139005', 1, '2010-11-11 00:00:00', '234567005', 'jun_student', '杭州市西湖区文一路小区 5 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (3001, 'parent_chen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '陈建国', 'chen_parent@example.com', '13700137001', 1, '1978-04-10 00:00:00', '345678001', 'chen_parent', '北京市海淀区中关村小区 1 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (3002, 'parent_liu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '刘美丽', 'liu_parent@example.com', '13700137002', 0, '1980-07-25 00:00:00', '345678002', 'liu_parent', '上海市浦东新区世纪小区 2 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (3003, 'parent_zhao', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '赵志强', 'zhao_parent@example.com', '13700137003', 1, '1976-11-30 00:00:00', '345678003', 'zhao_parent', '广州市天河区天河小区 3 栋', NULL, '2026-04-20 09:49:45', '2026-04-20 09:49:45', 0);
INSERT INTO `users` VALUES (4001, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, 'Admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-23 09:23:00', '2026-04-23 09:23:00', 0);

SET FOREIGN_KEY_CHECKS = 1;
