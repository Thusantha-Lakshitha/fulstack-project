package com.example.demo.controller;

import com.example.demo.Service.ClassroomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/classroom")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getClassroom(@PathVariable("courseId") String courseId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();
        if (!classroomService.hasAccess(email, courseId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You must enroll in this course to access classroom content."));
        }

        return ResponseEntity.ok(classroomService.getClassroomData(courseId));
    }
}
