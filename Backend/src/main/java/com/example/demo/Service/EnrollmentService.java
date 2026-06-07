package com.example.demo.Service;

import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Enrollment enroll(String userId, String courseId, java.util.Map<String, String> payload) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already enrolled");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        com.example.demo.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setStudentId(userId);
        enrollment.setStudentName(user.getName());
        enrollment.setStudentEmail(user.getEmail());
        enrollment.setCourseTitle(course.getTitle());
        enrollment.setTeacherName(course.getInstructorName());

        String paymentMethod = (payload != null && payload.containsKey("paymentMethod")) ? payload.get("paymentMethod") : "Credit/Debit Card";
        enrollment.setPaymentMethod(paymentMethod);
        
        if ("Free Course".equalsIgnoreCase(paymentMethod)) {
            enrollment.setPaymentStatus("COMPLETED");
        } else if ("Credit/Debit Card".equalsIgnoreCase(paymentMethod)) {
            if (payload == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing payment details");
            }
            String cardNumber = payload.get("cardNumber");
            String cvv = payload.get("cvv");
            String cardName = payload.get("cardName");
            String expiryMonth = payload.get("expiryMonth");
            String expiryYear = payload.get("expiryYear");

            if (cardNumber == null || !cardNumber.matches("\\d{16}")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid card number (must be 16 digits)");
            }
            if (cvv == null || !cvv.matches("\\d{3,4}")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CVV (must be 3 or 4 digits)");
            }
            if (cardName == null || cardName.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card holder name cannot be empty");
            }
            if (expiryMonth == null || expiryYear == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry date is required");
            }

            try {
                int month = Integer.parseInt(expiryMonth);
                int year = Integer.parseInt(expiryYear);
                java.time.YearMonth current = java.time.YearMonth.now();
                java.time.YearMonth expiry = java.time.YearMonth.of(year, month);
                if (expiry.isBefore(current)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry date cannot be in the past");
                }
            } catch (NumberFormatException | java.time.DateTimeException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid expiry date format");
            }

            String masked = "**** **** **** " + cardNumber.substring(12);
            enrollment.setMaskedCardNumber(masked);
            enrollment.setTransactionId(java.util.UUID.randomUUID().toString());
            enrollment.setPaymentStatus("COMPLETED");
        } else {
            enrollment.setPaymentStatus("PENDING");
        }

        enrollment.setCompletedMaterialIds(new java.util.ArrayList<>());
        enrollment.setProgressPercentage(0);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setStatus("ENROLLED");

        return enrollmentRepository.save(enrollment);
    }

    public List<Course> getEnrolledCourses(String userId) {
        List<Enrollment> list = enrollmentRepository.findByUserId(userId);
        return list.stream()
                .map(e -> courseRepository.findById(e.getCourseId()).orElse(null))
                .filter(c -> c != null)
                .collect(Collectors.toList());
    }

    public List<Enrollment> getEnrollmentsByUserId(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public Page<Enrollment> search(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return enrollmentRepository.findAll(pageable);
        }
        String safeQuery = query.trim();
        return enrollmentRepository.findByStudentNameContainingIgnoreCaseOrStudentEmailContainingIgnoreCaseOrCourseTitleContainingIgnoreCaseOrTeacherNameContainingIgnoreCase(
                safeQuery, safeQuery, safeQuery, safeQuery, pageable);
    }

    public Enrollment create(Enrollment enrollment) {
        enrollment.setId(null);
        enrollment.setStatus(normalizeStatus(enrollment.getStatus()));
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment update(String id, Enrollment request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        if (request.getStudentId() != null) {
            enrollment.setStudentId(request.getStudentId().trim());
        }
        if (request.getStudentName() != null) {
            enrollment.setStudentName(request.getStudentName().trim());
        }
        if (request.getStudentEmail() != null) {
            enrollment.setStudentEmail(request.getStudentEmail().trim().toLowerCase());
        }
        if (request.getCourseId() != null) {
            enrollment.setCourseId(request.getCourseId().trim());
        }
        if (request.getCourseTitle() != null) {
            enrollment.setCourseTitle(request.getCourseTitle().trim());
        }
        if (request.getTeacherName() != null) {
            enrollment.setTeacherName(request.getTeacherName().trim());
        }
        if (request.getStatus() != null) {
            enrollment.setStatus(normalizeStatus(request.getStatus()));
        }

        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    public void delete(String id) {
        enrollmentRepository.deleteById(id);
    }

    public Enrollment toggleMaterialCompletion(String userId, String courseId, String materialId, int totalMaterials) {
        List<Enrollment> list = enrollmentRepository.findByUserId(userId);
        Enrollment enrollment = list.stream()
                .filter(e -> courseId.equals(e.getCourseId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));

        List<String> completed = enrollment.getCompletedMaterialIds();
        if (completed.contains(materialId)) {
            completed.remove(materialId);
        } else {
            completed.add(materialId);
        }
        enrollment.setCompletedMaterialIds(completed);

        if (totalMaterials > 0) {
            int percentage = (completed.size() * 100) / totalMaterials;
            enrollment.setProgressPercentage(percentage > 100 ? 100 : percentage);
        } else {
            enrollment.setProgressPercentage(0);
        }
        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "ENROLLED";
        }
        return status.trim().toUpperCase();
    }
}
