package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/db")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN')")
public class DatabaseController {

    private final MongoTemplate mongoTemplate;
    private final UserRepository userRepository;
    private final String databaseName;

    public DatabaseController(
            MongoTemplate mongoTemplate,
            UserRepository userRepository,
            @Value("${app.mongo.database:Education}") String databaseName) {
        this.mongoTemplate = mongoTemplate;
        this.userRepository = userRepository;
        this.databaseName = databaseName;
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkConnection() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Simple connection check - just query for any user
            long userCount = userRepository.count();
            boolean connected = true;

            response.put("connected", connected);
            response.put("database", databaseName);
            response.put("message", "MongoDB connection successful");

            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            response.put("connected", false);
            response.put("database", databaseName);
            response.put("message", "MongoDB connection failed");
            response.put("error", exception.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<User> users = userRepository.findAll();
            response.put("success", true);
            response.put("count", users.size());
            response.put("database", databaseName);
            response.put("collection", "users");
            response.put("users", users);

            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            response.put("success", false);
            response.put("database", databaseName);
            response.put("error", exception.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}