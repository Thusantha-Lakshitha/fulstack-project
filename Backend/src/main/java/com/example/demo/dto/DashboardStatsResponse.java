package com.example.demo.dto;

import java.util.Map;

public class DashboardStatsResponse {

    private long users;
    private long teachers;
    private long courses;
    private long enrollments;
    private Map<String, Long> enrollmentsByPaymentMethod;
    private long pendingPayments;
    private long completedPayments;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long users, long teachers, long courses, long enrollments,
                                  Map<String, Long> enrollmentsByPaymentMethod,
                                  long pendingPayments, long completedPayments) {
        this.users = users;
        this.teachers = teachers;
        this.courses = courses;
        this.enrollments = enrollments;
        this.enrollmentsByPaymentMethod = enrollmentsByPaymentMethod;
        this.pendingPayments = pendingPayments;
        this.completedPayments = completedPayments;
    }

    public long getUsers() {
        return users;
    }

    public void setUsers(long users) {
        this.users = users;
    }

    public long getTeachers() {
        return teachers;
    }

    public void setTeachers(long teachers) {
        this.teachers = teachers;
    }

    public long getCourses() {
        return courses;
    }

    public void setCourses(long courses) {
        this.courses = courses;
    }

    public long getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(long enrollments) {
        this.enrollments = enrollments;
    }

    public Map<String, Long> getEnrollmentsByPaymentMethod() {
        return enrollmentsByPaymentMethod;
    }

    public void setEnrollmentsByPaymentMethod(Map<String, Long> enrollmentsByPaymentMethod) {
        this.enrollmentsByPaymentMethod = enrollmentsByPaymentMethod;
    }

    public long getPendingPayments() {
        return pendingPayments;
    }

    public void setPendingPayments(long pendingPayments) {
        this.pendingPayments = pendingPayments;
    }

    public long getCompletedPayments() {
        return completedPayments;
    }

    public void setCompletedPayments(long completedPayments) {
        this.completedPayments = completedPayments;
    }
}