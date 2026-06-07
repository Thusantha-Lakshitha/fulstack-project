package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/enroll")
@PreAuthorize("isAuthenticated()")
public class EnrollController {

    @PostMapping
    public ResponseEntity<?> enrollCourse(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("status", "enrolled", "course", body.get("courseId")));
    }
}
