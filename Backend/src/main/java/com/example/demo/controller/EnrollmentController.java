package com.example.demo.controller;

import com.example.demo.Service.EmailService;
import com.example.demo.Service.EnrollmentService;
import com.example.demo.Service.UserService;
import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserService userService;
    private final EmailService emailService;
    private final com.example.demo.repository.CourseRepository courseRepository;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            UserService userService,
            EmailService emailService,
            com.example.demo.repository.CourseRepository courseRepository) {
        this.enrollmentService = enrollmentService;
        this.userService = userService;
        this.emailService = emailService;
        this.courseRepository = courseRepository;
    }

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<Enrollment> enroll(@PathVariable("courseId") String courseId, @RequestBody(required = false) Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String principalName = authentication.getName();
        User user = userService.findByEmail(principalName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Enrollment saved = enrollmentService.enroll(user.getId(), courseId, payload);

        // Send email
        emailService.sendEnrollmentConfirmation(
                saved.getStudentEmail(),
                saved.getStudentName(),
                saved.getCourseTitle(),
                saved.getEnrolledAt().toString(),
                saved.getPaymentMethod(),
                saved.getStatus()
        );

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> myCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String principalName = authentication.getName();
        User user = userService.findByEmail(principalName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Course> courses = enrollmentService.getEnrolledCourses(user.getId());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Enrollment>> myEnrollments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String principalName = authentication.getName();
        User user = userService.findByEmail(principalName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUserId(user.getId());
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping("/course/{courseId}/complete/{materialId}")
    public ResponseEntity<Enrollment> toggleComplete(
            @PathVariable("courseId") String courseId,
            @PathVariable("materialId") String materialId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String principalName = authentication.getName();
        User user = userService.findByEmail(principalName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        com.example.demo.model.Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        int total = course.getVideos().size() + course.getNotes().size();

        Enrollment updated = enrollmentService.toggleMaterialCompletion(user.getId(), courseId, materialId, total);
        return ResponseEntity.ok(updated);
    }
}

