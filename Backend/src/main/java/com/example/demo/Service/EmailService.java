package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEnrollmentConfirmation(String toEmail, String studentName, String courseName, String enrollmentDate, String paymentMethod, String status) {
        new Thread(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setTo(toEmail);
                helper.setSubject("Enrollment Confirmation - " + courseName);

                String content = "<h3>Hello " + studentName + ",</h3>"
                        + "<p>Thank you for enrolling in <strong>" + courseName + "</strong>.</p>"
                        + "<p>Here are your enrollment details:</p>"
                        + "<ul>"
                        + "<li><strong>Enrollment Date:</strong> " + enrollmentDate + "</li>"
                        + "<li><strong>Payment Method:</strong> " + paymentMethod + "</li>"
                        + "<li><strong>Status:</strong> " + status + "</li>"
                        + "</ul>"
                        + "<p>You can login to your LMS account to access your course materials:</p>"
                        + "<p><a href='http://localhost:3000/login'>Login to LMS</a></p>"
                        + "<br><p>Best Regards,</p>"
                        + "<p>LMS Team</p>";

                helper.setText(content, true);

                mailSender.send(message);
                System.out.println("Confirmation email sent to " + toEmail);
            } catch (MessagingException e) {
                System.err.println("Failed to send email to " + toEmail);
                e.printStackTrace();
            }
        }).start();
    }
}
