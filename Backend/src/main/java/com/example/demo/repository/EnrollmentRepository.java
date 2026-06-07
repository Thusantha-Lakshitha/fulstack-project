package com.example.demo.repository;

import com.example.demo.model.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    List<Enrollment> findByUserId(String userId);
    boolean existsByUserIdAndCourseId(String userId, String courseId);

    Page<Enrollment> findByStudentNameContainingIgnoreCaseOrStudentEmailContainingIgnoreCaseOrCourseTitleContainingIgnoreCaseOrTeacherNameContainingIgnoreCase(
            String studentName,
            String studentEmail,
            String courseTitle,
            String teacherName,
            Pageable pageable);
}
