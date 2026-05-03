package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/db")
@CrossOrigin
public class DatabaseController {

    private final MongoTemplate mongoTemplate;

    public DatabaseController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkConnection() {
        Map<String, Object> response = new HashMap<>();

        try {
            Document result = mongoTemplate.executeCommand("{ ping: 1 }");
            boolean connected = result.containsKey("ok") && ((Number) result.get("ok")).intValue() == 1;

            response.put("connected", connected);
            response.put("database", mongoTemplate.getDb().getName());
            response.put("message", connected ? "MongoDB connection successful" : "MongoDB ping failed");

            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            response.put("connected", false);
            response.put("database", mongoTemplate.getDb().getName());
            response.put("message", "MongoDB connection failed");
            response.put("error", exception.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}