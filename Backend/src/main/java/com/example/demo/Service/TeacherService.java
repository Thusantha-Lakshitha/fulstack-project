package com.example.demo.Service;

import com.example.demo.model.Teacher;
import com.example.demo.repository.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public Page<Teacher> search(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return teacherRepository.findAll(pageable);
        }
        String safeQuery = query.trim();
        return teacherRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrSpecializationContainingIgnoreCase(
                safeQuery, safeQuery, safeQuery, pageable);
    }

    public Teacher create(Teacher teacher) {
        teacher.setId(null);
        teacher.setStatus(normalizeStatus(teacher.getStatus()));
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        return teacherRepository.save(teacher);
    }

    public Teacher getById(String id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
    }

    public Teacher update(String id, Teacher request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));

        if (request.getName() != null) {
            teacher.setName(request.getName().trim());
        }
        if (request.getEmail() != null) {
            teacher.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (request.getSpecialization() != null) {
            teacher.setSpecialization(request.getSpecialization().trim());
        }
        if (request.getBio() != null) {
            teacher.setBio(request.getBio().trim());
        }
        if (request.getExperienceYears() != null) {
            teacher.setExperienceYears(request.getExperienceYears());
        }
        if (request.getStatus() != null) {
            teacher.setStatus(normalizeStatus(request.getStatus()));
        }

        teacher.setUpdatedAt(LocalDateTime.now());
        return teacherRepository.save(teacher);
    }

    public void delete(String id) {
        teacherRepository.deleteById(id);
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "ACTIVE";
        }
        return status.trim().toUpperCase();
    }
}