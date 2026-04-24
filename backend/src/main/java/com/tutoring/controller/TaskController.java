package com.tutoring.controller;

import com.tutoring.entity.Task;
import com.tutoring.entity.Student;
import com.tutoring.repository.TaskRepository;
import com.tutoring.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    // 获取学生的所有任务
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Task>> getTasksByStudentId(@PathVariable Long studentId) {
        // 根据学生ID查询学生信息，获取用户ID
        Student student = studentRepository.selectById(studentId);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        Long userId = student.getUserId();
        List<Task> tasks = taskRepository.findByStudentId(userId);
        return ResponseEntity.ok(tasks);
    }

    // 创建新任务
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        System.out.println("收到添加任务请求: " + task);
        try {
            taskRepository.insert(task);
            System.out.println("任务添加成功: " + task);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (Exception e) {
            System.out.println("任务添加失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 更新任务状态
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody Task task) {
        Task existingTask = taskRepository.selectById(id);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        existingTask.setStatus(task.getStatus());
        taskRepository.updateById(existingTask);
        return ResponseEntity.ok(existingTask);
    }

    // 删除任务
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Task existingTask = taskRepository.selectById(id);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}