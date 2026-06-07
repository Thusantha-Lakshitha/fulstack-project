package com.example.demo.Service;

import com.example.demo.dto.DashboardStatsResponse;
import com.example.demo.model.Enrollment;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.TeacherRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardService(
            UserRepository userRepository,
            TeacherRepository teacherRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public DashboardStatsResponse stats() {
        long users = userRepository.count();
        long teachers = teacherRepository.count();
        long courses = courseRepository.count();
        long enrollmentsCount = enrollmentRepository.count();

        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        
        Map<String, Long> enrollmentsByPaymentMethod = new HashMap<>();
        long pendingPayments = 0;
        long completedPayments = 0;

        for (Enrollment e : allEnrollments) {
            String method = e.getPaymentMethod();
            if (method == null || method.isBlank()) {
                method = "Unknown";
            }
            enrollmentsByPaymentMethod.put(method, enrollmentsByPaymentMethod.getOrDefault(method, 0L) + 1);

            if ("COMPLETED".equalsIgnoreCase(e.getPaymentStatus())) {
                completedPayments++;
            } else {
                pendingPayments++; // PENDING or null
            }
        }

        return new DashboardStatsResponse(
                users,
                teachers,
                courses,
                enrollmentsCount,
                enrollmentsByPaymentMethod,
                pendingPayments,
                completedPayments);
    }
}