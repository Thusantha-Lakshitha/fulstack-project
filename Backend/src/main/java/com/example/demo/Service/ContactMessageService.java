package com.example.demo.Service;

import com.example.demo.model.ContactMessage;
import com.example.demo.repository.ContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class ContactMessageService {

    private final ContactMessageRepository repository;

    public ContactMessageService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    public ContactMessage create(ContactMessage message) {
        // Validation Checks
        if (message.getName() == null || message.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (!message.getEmail().matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }
        if (message.getSubject() == null || message.getSubject().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject is required");
        }
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is required");
        }

        // Set default system properties
        message.setId(null);
        message.setName(message.getName().trim());
        message.setEmail(message.getEmail().trim().toLowerCase());
        message.setSubject(message.getSubject().trim());
        message.setMessage(message.getMessage().trim());
        message.setCreatedAt(LocalDateTime.now());
        message.setStatus("NEW");

        return repository.save(message);
    }

    public Page<ContactMessage> search(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll(pageable);
        }
        String safeQuery = query.trim();
        return repository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(safeQuery, safeQuery, pageable);
    }

    public ContactMessage markAsRead(String id) {
        ContactMessage msg = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));
        msg.setStatus("READ");
        return repository.save(msg);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found");
        }
        repository.deleteById(id);
    }
}
