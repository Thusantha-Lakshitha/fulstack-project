package com.example.demo.Service;

import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Page<Course> search(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return courseRepository.findAll(pageable);
        }
        String safeQuery = query.trim();
        return courseRepository.findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrInstructorNameContainingIgnoreCase(
                safeQuery, safeQuery, safeQuery, pageable);
    }

    public Course create(Course course) {
        course.setId(null);
        course.setLevel(normalizeLevel(course.getLevel()));
        // allow optional fields
        if (course.getImageUrl() != null && course.getImageUrl().isBlank()) {
            course.setImageUrl(null);
        }
        if (course.getSyllabus() != null && course.getSyllabus().isBlank()) {
            course.setSyllabus(null);
        }
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course getById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public Course update(String id, Course request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (request.getTitle() != null) {
            course.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription().trim());
        }
        if (request.getCategory() != null) {
            course.setCategory(request.getCategory().trim());
        }
        if (request.getInstructorName() != null) {
            course.setInstructorName(request.getInstructorName().trim());
        }
        if (request.getPrice() != null) {
            course.setPrice(request.getPrice());
        }
        if (request.getDuration() != null) {
            course.setDuration(request.getDuration().trim());
        }
        if (request.getLevel() != null) {
            course.setLevel(normalizeLevel(request.getLevel()));
        }
        if (request.getSeatsAvailable() != null) {
            course.setSeatsAvailable(request.getSeatsAvailable());
        }
        if (request.getImageUrl() != null) {
            course.setImageUrl(request.getImageUrl().trim());
        }
        if (request.getSyllabus() != null) {
            course.setSyllabus(request.getSyllabus());
        }
        if (request.getVideos() != null) {
            course.setVideos(request.getVideos());
        }
        if (request.getNotes() != null) {
            course.setNotes(request.getNotes());
        }

        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public void delete(String id) {
        courseRepository.deleteById(id);
    }

    private String normalizeLevel(String level) {
        if (level == null || level.isBlank()) {
            return "BEGINNER";
        }
        return level.trim().toUpperCase();
    }
}