package com.tutoring.controller;

import com.tutoring.entity.Task;
import com.tutoring.repository.TaskRepository;
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

    // 获取学生的所有任务
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Task>> getTasksByStudentId(@PathVariable Long studentId) {
        List<Task> tasks = taskRepository.findByStudentId(studentId);
        return ResponseEntity.ok(tasks);
    }

    // 创建新任务
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }

    // 更新任务状态
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody Task task) {
        Task existingTask = taskRepository.findById(id).orElse(null);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        existingTask.setStatus(task.getStatus());
        Task updatedTask = taskRepository.save(existingTask);
        return ResponseEntity.ok(updatedTask);
    }

    // 删除任务
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Task existingTask = taskRepository.findById(id).orElse(null);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.delete(existingTask);
        return ResponseEntity.noContent().build();
    }
}