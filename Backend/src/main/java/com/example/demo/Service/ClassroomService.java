package com.example.demo.Service;

import com.example.demo.model.Course;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class ClassroomService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public ClassroomService(
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    public boolean hasAccess(String email, String courseId) {
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            return false;
        }

        // Admin and teachers have access
        if ("ADMIN".equalsIgnoreCase(user.getRole()) || "TEACHER".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        return enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId);
    }

    public Map<String, Object> getClassroomData(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Map<String, Object> data = new HashMap<>();
        data.put("courseId", course.getId());
        data.put("courseTitle", course.getTitle());
        data.put("videos", course.getVideos());
        data.put("notes", course.getNotes());
        return data;
    }
}
