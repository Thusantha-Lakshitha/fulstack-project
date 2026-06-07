package com.example.demo.repository;

import com.example.demo.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
    Page<Course> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrInstructorNameContainingIgnoreCase(
            String title,
            String category,
            String instructorName,
            Pageable pageable);
}