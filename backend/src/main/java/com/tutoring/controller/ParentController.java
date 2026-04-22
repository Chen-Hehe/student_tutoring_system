package com.tutoring.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutoring.dto.LearningReportDTO;
import com.tutoring.dto.PsychologicalStatusDTO;
import com.tutoring.dto.Result;
import com.tutoring.dto.SimpleMatchRequestDTO;
import com.tutoring.dto.StudentInfoDTO;
import com.tutoring.entity.GradeRecord;
import com.tutoring.entity.LearningProgress;
import com.tutoring.entity.LearningReport;
import com.tutoring.entity.Parent;
import com.tutoring.entity.ParentStudentRelation;
import com.tutoring.entity.PsychologicalAssessment;
import com.tutoring.entity.PsychologicalAssessmentDetail;
import com.tutoring.entity.Student;
import com.tutoring.entity.Teacher;
import com.tutoring.entity.TeacherCommunication;
import com.tutoring.entity.TeacherStudentMatch;
import com.tutoring.entity.User;
import com.tutoring.repository.GradeRecordRepository;
import com.tutoring.repository.LearningProgressRepository;
import com.tutoring.repository.LearningReportRepository;
import com.tutoring.repository.ParentRepository;
import com.tutoring.repository.ParentStudentRelationRepository;
import com.tutoring.repository.StudentRepository;
import com.tutoring.repository.TeacherRepository;
import com.tutoring.repository.TeacherStudentMatchRepository;
import com.tutoring.repository.UserRepository;
import com.tutoring.service.PsychologicalAssessmentService;
import com.tutoring.service.TeacherCommunicationService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 家长控制器
 */
@RestController
@RequestMapping("/api/parent")
public class ParentController {
    
    private final ParentRepository parentRepository;
    private final ParentStudentRelationRepository parentStudentRelationRepository;
    private final StudentRepository studentRepository;
    private final TeacherStudentMatchRepository teacherStudentMatchRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final LearningReportRepository learningReportRepository;
    private final GradeRecordRepository gradeRecordRepository;
    private final LearningProgressRepository learningProgressRepository;
    private final PsychologicalAssessmentService psychologicalAssessmentService;
    private final TeacherCommunicationService teacherCommunicationService;
    
    public ParentController(ParentRepository parentRepository, ParentStudentRelationRepository parentStudentRelationRepository, 
                          StudentRepository studentRepository, TeacherStudentMatchRepository teacherStudentMatchRepository, 
                          UserRepository userRepository, TeacherRepository teacherRepository, 
                          LearningReportRepository learningReportRepository, GradeRecordRepository gradeRecordRepository, 
                          LearningProgressRepository learningProgressRepository, PsychologicalAssessmentService psychologicalAssessmentService, 
                          TeacherCommunicationService teacherCommunicationService) {
        this.parentRepository = parentRepository;
        this.parentStudentRelationRepository = parentStudentRelationRepository;
        this.studentRepository = studentRepository;
        this.teacherStudentMatchRepository = teacherStudentMatchRepository;
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.learningReportRepository = learningReportRepository;
        this.gradeRecordRepository = gradeRecordRepository;
        this.learningProgressRepository = learningProgressRepository;
        this.psychologicalAssessmentService = psychologicalAssessmentService;
        this.teacherCommunicationService = teacherCommunicationService;
    }
    
    /**
     * 测试方法
     *
     * @return 测试结果
     */
    @GetMapping("/test")
    public Result<String> test() {
        System.out.println("测试方法被调用");
        return Result.success("Parent controller is working");
    }
    
    /**
     * 获取家长的孩子列表
     *
     * @param request HTTP请求
     * @return 孩子列表
     */
    @GetMapping("/children")
    public Result<List<StudentInfoDTO>> getChildren(HttpServletRequest request) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取孩子列表请求，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 获取家长信息
            Parent parent = parentRepository.findByUserId(userId);
            System.out.println("家长信息：" + parent);
            
            if (parent == null) {
                System.out.println("家长信息不存在，用户ID：" + userId);
                return Result.error(404, "家长信息不存在");
            }
            
            // 获取家长与学生的关联关系
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            System.out.println("家长与学生的关联关系数量：" + (relations != null ? relations.size() : 0));
            
            // 获取学生信息
            List<StudentInfoDTO> children = new ArrayList<>();
            if (relations != null && !relations.isEmpty()) {
                for (ParentStudentRelation relation : relations) {
                    System.out.println("关联关系：parentId=" + relation.getParentId() + ", studentId=" + relation.getStudentId());
                    Student student = studentRepository.selectById(relation.getStudentId());
                    if (student != null && student.getDeleted() == 0) {
                        // 获取关联的用户信息
                        User user = userRepository.selectById(student.getUserId());
                        String studentName = "";
                        if (user != null) {
                            studentName = user.getName();
                            System.out.println("找到学生：" + studentName);
                        }
                        // 创建StudentInfoDTO对象，包含学生姓名
                        StudentInfoDTO studentInfo = new StudentInfoDTO(student, studentName);
                        children.add(studentInfo);
                    } else {
                        System.out.println("学生不存在或已删除，学生ID：" + relation.getStudentId());
                    }
                }
            }
            
            System.out.println("最终获取到的孩子数量：" + children.size());
            return Result.success(children);
        } catch (Exception e) {
            System.err.println("获取孩子列表失败：" + e.getMessage());
            e.printStackTrace();
            return Result.error(500, "获取孩子列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 绑定孩子
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @param relationship 关系
     * @return 操作结果
     */
    @PostMapping("/bind-child")
    public Result<Void> bindChild(HttpServletRequest request, 
                                 @RequestParam Long studentId, 
                                 @RequestParam String relationship) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("绑定孩子请求，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 获取家长信息
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            // 检查学生是否存在
            Student student = studentRepository.selectById(studentId);
            if (student == null || student.getDeleted() == 1) {
                return Result.error(404, "学生信息不存在");
            }
            
            // 检查是否已经绑定
            ParentStudentRelation existingRelation = parentStudentRelationRepository.findByParentIdAndStudentId(parent.getId(), studentId);
            if (existingRelation != null) {
                return Result.error(400, "已经绑定过该孩子");
            }
            
            // 创建绑定关系
            ParentStudentRelation relation = new ParentStudentRelation();
            relation.setParentId(parent.getId());
            relation.setStudentId(studentId);
            relation.setRelationship(relationship);
            relation.setDeleted(0);
            
            parentStudentRelationRepository.insert(relation);
            
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取待家长确认的师生匹配请求
     *
     * @param request HTTP请求
     * @return 匹配请求列表
     */
    @GetMapping("/match-requests")
    public Result<List<SimpleMatchRequestDTO>> getMatchRequests(HttpServletRequest request) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取匹配请求列表，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 获取家长信息
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            // 获取家长的孩子
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            List<Long> studentIds = relations.stream()
                    .map(ParentStudentRelation::getStudentId)
                    .collect(Collectors.toList());
            
            // 获取待家长确认的匹配请求
            List<TeacherStudentMatch> matchRequests = teacherStudentMatchRepository.findByStudentIdInAndStatus(studentIds, 1);
            
            // 转换为DTO对象列表
            List<SimpleMatchRequestDTO> matchRequestDTOs = new ArrayList<>();
            for (TeacherStudentMatch match : matchRequests) {
                // 获取学生信息
                Student student = studentRepository.selectById(match.getStudentId());
                User studentUser = userRepository.selectById(student.getUserId());
                String studentName = studentUser != null ? studentUser.getName() : "未知学生";
                String grade = student.getGrade();
                
                // 获取教师信息
                Teacher teacher = teacherRepository.selectById(match.getTeacherId());
                User teacherUser = userRepository.selectById(teacher.getUserId());
                String teacherName = teacherUser != null ? teacherUser.getName() : "未知教师";
                String subject = teacher.getSubject();
                
                // 创建DTO对象
                SimpleMatchRequestDTO dto = new SimpleMatchRequestDTO(match, studentName, grade, teacherName, subject);
                matchRequestDTOs.add(dto);
            }
            
            return Result.success(matchRequestDTOs);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 确认或拒绝师生匹配请求
     *
     * @param request HTTP请求
     * @param matchId 匹配ID
     * @param confirm 是否确认
     * @return 操作结果
     */
    @PutMapping("/match-requests/{matchId}")
    public Result<Void> confirmMatchRequest(HttpServletRequest request, 
                                          @PathVariable Long matchId, 
                                          @RequestParam boolean confirm) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("确认匹配请求，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 获取匹配请求
            TeacherStudentMatch match = teacherStudentMatchRepository.selectById(matchId);
            if (match == null) {
                return Result.error(404, "匹配请求不存在");
            }
            
            // 检查是否是待家长确认状态
            if (match.getStatus() != 1) {
                return Result.error(400, "该请求不是待家长确认状态");
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(match.getStudentId()));
            
            if (!isChild) {
                return Result.error(403, "无权操作该请求");
            }
            
            // 更新匹配状态
            if (confirm) {
                match.setStatus(2); // 已匹配
                match.setParentConfirm(1); // 家长同意
            } else {
                match.setStatus(3); // 已拒绝
                match.setParentConfirm(2); // 家长拒绝
            }
            
            teacherStudentMatchRepository.updateById(match);
            
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    
    /**
     * 获取孩子的学习报告
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @return 学习报告列表
     */
    @GetMapping("/learning-reports")
    public Result<List<LearningReportDTO>> getLearningReports(HttpServletRequest request, 
                                                            @RequestParam Long studentId) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取学习报告，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(studentId));
            
            if (!isChild) {
                return Result.error(403, "无权查看该孩子的学习报告");
            }
            
            // 获取学生信息
            Student student = studentRepository.selectById(studentId);
            User studentUser = userRepository.selectById(student.getUserId());
            String studentName = studentUser != null ? studentUser.getName() : "未知学生";
            String grade = student.getGrade();
            
            // 获取学习报告
            List<LearningReport> reports = learningReportRepository.findByStudentId(studentId);
            List<LearningReportDTO> reportDTOs = new ArrayList<>();
            
            for (LearningReport report : reports) {
                // 获取成绩记录
                List<GradeRecord> gradeRecords = gradeRecordRepository.findByReportId(report.getId());
                // 获取学习进度
                List<LearningProgress> progressRecords = learningProgressRepository.findByReportId(report.getId());
                
                // 创建DTO对象
                LearningReportDTO dto = new LearningReportDTO(
                        report.getId(),
                        studentName,
                        grade,
                        report.getReportPeriod(),
                        report.getOverall(),
                        report.getClassRank(),
                        gradeRecords,
                        progressRecords,
                        report.getComment()
                );
                reportDTOs.add(dto);
            }
            
            return Result.success(reportDTOs);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取孩子的心理状态评估
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @return 心理状态评估数据
     */
    @GetMapping("/psychological-status")
    public Result<PsychologicalStatusDTO> getPsychologicalStatus(HttpServletRequest request, 
                                                              @RequestParam Long studentId) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取心理状态评估，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(studentId));
            
            if (!isChild) {
                return Result.error(403, "无权查看该孩子的心理状态评估");
            }
            
            // 获取学生信息
            Student student = studentRepository.selectById(studentId);
            User studentUser = userRepository.selectById(student.getUserId());
            String studentName = studentUser != null ? studentUser.getName() : "未知学生";
            String grade = student.getGrade();
            
            // 获取心理状态评估
            PsychologicalAssessment assessment = psychologicalAssessmentService.getLatestByStudentId(studentId);
            if (assessment == null) {
                return Result.error(404, "暂无心理状态评估数据");
            }
            
            // 获取详细评估数据
            List<PsychologicalAssessmentDetail> details = psychologicalAssessmentService.getDetailsByAssessmentId(assessment.getId());
            
            // 构建DTO对象
            PsychologicalStatusDTO dto = new PsychologicalStatusDTO();
            dto.setStudentName(studentName);
            dto.setGrade(grade);
            dto.setComments(assessment.getComments());
            dto.setRecommendations(assessment.getRecommendations());
            
            // 构建状态数据
            java.util.Map<String, PsychologicalStatusDTO.StatusData> statuses = new java.util.HashMap<>();
            
            // 从详细评估数据中构建状态数据
            // 初始化默认值
            PsychologicalStatusDTO.StatusData emotionStatus = new PsychologicalStatusDTO.StatusData();
            emotionStatus.setValue("良好");
            emotionStatus.setLevel("good");
            emotionStatus.setPercentage(85);
            
            PsychologicalStatusDTO.StatusData socialStatus = new PsychologicalStatusDTO.StatusData();
            socialStatus.setValue("优秀");
            socialStatus.setLevel("good");
            socialStatus.setPercentage(90);
            
            PsychologicalStatusDTO.StatusData stressStatus = new PsychologicalStatusDTO.StatusData();
            stressStatus.setValue("中等");
            stressStatus.setLevel("warning");
            stressStatus.setPercentage(60);
            
            PsychologicalStatusDTO.StatusData mentalStatus = new PsychologicalStatusDTO.StatusData();
            mentalStatus.setValue("良好");
            mentalStatus.setLevel("good");
            mentalStatus.setPercentage(80);
            
            // 根据详细评估数据更新状态
            for (PsychologicalAssessmentDetail detail : details) {
                String type = detail.getAssessmentType();
                int percentage = detail.getPercentage();
                String level = detail.getLevel();
                
                // 根据评估类型更新对应的状态
                switch (type) {
                    case "情绪稳定性":
                        emotionStatus.setPercentage(percentage);
                        emotionStatus.setLevel(level);
                        // 根据百分比设置评估值
                        if (percentage >= 85) {
                            emotionStatus.setValue("优秀");
                        } else if (percentage >= 70) {
                            emotionStatus.setValue("良好");
                        } else if (percentage >= 60) {
                            emotionStatus.setValue("中等");
                        } else {
                            emotionStatus.setValue("较差");
                        }
                        break;
                    case "社交互动":
                        socialStatus.setPercentage(percentage);
                        socialStatus.setLevel(level);
                        // 根据百分比设置评估值
                        if (percentage >= 85) {
                            socialStatus.setValue("优秀");
                        } else if (percentage >= 70) {
                            socialStatus.setValue("良好");
                        } else if (percentage >= 60) {
                            socialStatus.setValue("中等");
                        } else {
                            socialStatus.setValue("较差");
                        }
                        break;
                    case "学习压力":
                        stressStatus.setPercentage(percentage);
                        stressStatus.setLevel(level);
                        // 根据百分比设置评估值
                        if (percentage >= 80) {
                            stressStatus.setValue("重度");
                            stressStatus.setLevel("danger");
                        } else if (percentage >= 60) {
                            stressStatus.setValue("中等");
                            stressStatus.setLevel("warning");
                        } else if (percentage >= 40) {
                            stressStatus.setValue("轻度");
                            stressStatus.setLevel("good");
                        } else {
                            stressStatus.setValue("无");
                            stressStatus.setLevel("good");
                        }
                        break;
                    case "自我认知":
                        mentalStatus.setPercentage(percentage);
                        mentalStatus.setLevel(level);
                        // 根据百分比设置评估值
                        if (percentage >= 85) {
                            mentalStatus.setValue("优秀");
                        } else if (percentage >= 70) {
                            mentalStatus.setValue("良好");
                        } else if (percentage >= 60) {
                            mentalStatus.setValue("中等");
                        } else {
                            mentalStatus.setValue("较差");
                        }
                        break;
                }
            }
            
            // 将状态数据添加到map中
            statuses.put("情绪状态", emotionStatus);
            statuses.put("社交能力", socialStatus);
            statuses.put("学习压力", stressStatus);
            statuses.put("心理健康", mentalStatus);
            
            dto.setStatuses(statuses);
            
            // 构建详细评估数据
            java.util.Map<String, PsychologicalStatusDTO.AssessmentData> assessments = new java.util.HashMap<>();
            
            for (PsychologicalAssessmentDetail detail : details) {
                PsychologicalStatusDTO.AssessmentData assessmentData = new PsychologicalStatusDTO.AssessmentData();
                assessmentData.setPercentage(detail.getPercentage());
                assessmentData.setLevel(detail.getLevel());
                assessments.put(detail.getAssessmentType(), assessmentData);
            }
            
            dto.setAssessments(assessments);
            
            return Result.success(dto);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取孩子的教师列表
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @return 教师列表
     */
    @GetMapping("/teachers")
    public Result<List<java.util.Map<String, Object>>> getTeachers(HttpServletRequest request, 
                                                              @RequestParam Long studentId) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取教师列表，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(studentId));
            
            if (!isChild) {
                return Result.error(403, "无权查看该孩子的教师信息");
            }
            
            // 获取已匹配的教师
            System.out.println("开始获取学生 " + studentId + " 的已匹配教师");
            List<TeacherStudentMatch> matches = teacherStudentMatchRepository.findByStudentIdAndStatus(studentId, 2);
            System.out.println("获取到的匹配数量：" + (matches != null ? matches.size() : 0));
            
            List<Long> teacherIds = matches.stream()
                    .map(TeacherStudentMatch::getTeacherId)
                    .collect(Collectors.toList());
            System.out.println("教师ID列表：" + teacherIds);
            
            // 获取教师信息
            List<java.util.Map<String, Object>> teachers = new ArrayList<>();
            for (Long teacherId : teacherIds) {
                System.out.println("获取教师ID：" + teacherId + " 的信息");
                Teacher teacher = teacherRepository.selectById(teacherId);
                if (teacher != null) {
                    System.out.println("找到教师：" + teacher.getId());
                    User teacherUser = userRepository.selectById(teacher.getUserId());
                    if (teacherUser != null) {
                        System.out.println("找到教师用户：" + teacherUser.getName());
                        java.util.Map<String, Object> teacherInfo = new java.util.HashMap<>();
                        teacherInfo.put("id", teacher.getId());
                        teacherInfo.put("name", teacherUser.getName());
                        teacherInfo.put("subject", teacher.getSubject());
                        teacherInfo.put("avatar", teacherUser.getName().substring(0, 1));
                        teachers.add(teacherInfo);
                        System.out.println("添加教师信息：" + teacherUser.getName());
                    } else {
                        System.out.println("教师用户不存在，教师ID：" + teacherId);
                    }
                } else {
                    System.out.println("教师不存在，教师ID：" + teacherId);
                }
            }
            System.out.println("最终获取到的教师数量：" + teachers.size());
            
            return Result.success(teachers);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 获取与教师的沟通记录
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @param teacherId 教师ID
     * @return 沟通记录列表
     */
    @GetMapping("/communication-history")
    public Result<List<java.util.Map<String, Object>>> getCommunicationHistory(HttpServletRequest request, 
                                                                           @RequestParam Long studentId, 
                                                                           @RequestParam Long teacherId) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("获取沟通记录，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(studentId));
            
            if (!isChild) {
                return Result.error(403, "无权查看该孩子的沟通记录");
            }
            
            // 获取沟通记录
            List<TeacherCommunication> communications = teacherCommunicationService.getCommunicationsByParentAndTeacher(parent.getId(), teacherId);
            List<java.util.Map<String, Object>> messages = new ArrayList<>();
            
            for (TeacherCommunication communication : communications) {
                java.util.Map<String, Object> message = new java.util.HashMap<>();
                message.put("id", communication.getId());
                message.put("sender", communication.getSender());
                message.put("content", communication.getContent());
                message.put("time", communication.getSendTime().toString());
                message.put("type", communication.getSender().equals("王家长") ? "sent" : "received");
                messages.add(message);
            }
            
            return Result.success(messages);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
    
    /**
     * 发送沟通消息
     *
     * @param request HTTP请求
     * @param studentId 学生ID
     * @param teacherId 教师ID
     * @param content 消息内容
     * @return 发送结果
     */
    @PostMapping("/send-message")
    public Result<Boolean> sendMessage(HttpServletRequest request, 
                                     @RequestParam Long studentId, 
                                     @RequestParam Long teacherId, 
                                     @RequestParam String content) {
        try {
            // 从request属性中获取用户ID
            Long userId = (Long) request.getAttribute("X-User-Id");
            System.out.println("发送消息，用户ID：" + userId);
            
            // 测试用：如果没有用户ID，使用默认值
            if (userId == null) {
                userId = 3001L; // 默认家长ID
                System.out.println("使用默认用户ID：" + userId);
            }
            
            // 检查是否是该家长的孩子
            Parent parent = parentRepository.findByUserId(userId);
            if (parent == null) {
                return Result.error(404, "家长信息不存在");
            }
            
            List<ParentStudentRelation> relations = parentStudentRelationRepository.findByParentId(parent.getId());
            boolean isChild = relations.stream()
                    .anyMatch(relation -> relation.getStudentId().equals(studentId));
            
            if (!isChild) {
                return Result.error(403, "无权为该孩子发送消息");
            }
            
            // 创建沟通记录
            TeacherCommunication communication = new TeacherCommunication();
            communication.setParentId(parent.getId());
            communication.setTeacherId(teacherId);
            communication.setStudentId(studentId);
            communication.setSender("王家长");
            communication.setContent(content);
            communication.setSendTime(new java.util.Date());
            communication.setDeleted(0);
            
            // 保存沟通记录
            boolean success = teacherCommunicationService.saveCommunication(communication);
            
            return Result.success(success);
        } catch (RuntimeException e) {
            return Result.error(500, e.getMessage());
        }
    }
}