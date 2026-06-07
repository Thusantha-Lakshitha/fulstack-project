package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.User;
import com.example.demo.Service.UserService;
import com.example.demo.Service.AuthService;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request.getEmail(), request.getPassword());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", loginResponse.getToken());
        response.put("userId", loginResponse.getUserId());
        response.put("username", loginResponse.getUsername());
        response.put("email", loginResponse.getEmail());
        response.put("role", loginResponse.getRole());
        return ResponseEntity.ok(response);
    }
}
