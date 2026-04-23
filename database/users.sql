/*
 Navicat Premium Dump SQL

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : tutoring

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 23/04/2026 12:14:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '???' ROW_FORMAT = Dynamic;

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
