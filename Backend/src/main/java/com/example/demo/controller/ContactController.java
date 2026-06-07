package com.example.demo.controller;

import com.example.demo.Service.ContactMessageService;
import com.example.demo.model.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ContactController {

    private final ContactMessageService service;

    public ContactController(ContactMessageService service) {
        this.service = service;
    }

    @PostMapping({"/contact", "/support"})
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(service.create(message));
    }

    @GetMapping({"/admin/contact-messages", "/admin/support-messages"})
    public ResponseEntity<Page<ContactMessage>> getContactMessages(
            @RequestParam(defaultValue = "") String query,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.search(query, pageable));
    }

    @PutMapping({"/admin/contact-messages/{id}/read", "/admin/support-messages/{id}/read"})
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }

    @DeleteMapping({"/admin/contact-messages/{id}", "/admin/support-messages/{id}"})
    public ResponseEntity<Void> deleteMessage(@PathVariable("id") String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
