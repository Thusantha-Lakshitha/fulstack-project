package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class AppConfig {

	@Bean
	public CommandLineRunner seedAdminUser(
			UserRepository userRepository,
			UserService userService,
			@Value("${app.admin.seed.email:admin@lms.com}") String adminEmail,
			@Value("${app.admin.seed.password:Admin@12345}") String adminPassword) {
		return args -> {
			User adminUser = userRepository.findByEmailIgnoreCase(adminEmail).orElseGet(User::new);
			adminUser.setName("System Admin");
			adminUser.setEmail(adminEmail.trim().toLowerCase());
			adminUser.setPassword(userService.encodePassword(adminPassword));
			adminUser.setRole("ADMIN");
			adminUser.setEnabled(Boolean.TRUE);
			userRepository.save(adminUser);
		};
	}
}
