package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "courses")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Course {

    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private String instructorName;
    private Double price;
    private String duration;
    private String level;
    private Integer seatsAvailable;
    private String imageUrl;
    private String syllabus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getSeatsAvailable() {
        return seatsAvailable;
    }

    public void setSeatsAvailable(Integer seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSyllabus() {
        return syllabus;
    }

    public void setSyllabus(String syllabus) {
        this.syllabus = syllabus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Classroom nested models
    public static class Video {
        private String title;
        private String url;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    public static class Note {
        private String title;
        private String fileUrl;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    }

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private java.util.List<Video> videos = new java.util.ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private java.util.List<Note> notes = new java.util.ArrayList<>();

    public java.util.List<Video> getVideos() {
        if (videos == null) {
            videos = new java.util.ArrayList<>();
        }
        return videos;
    }

    public void setVideos(java.util.List<Video> videos) {
        this.videos = videos;
    }

    public java.util.List<Note> getNotes() {
        if (notes == null) {
            notes = new java.util.ArrayList<>();
        }
        return notes;
    }

    public void setNotes(java.util.List<Note> notes) {
        this.notes = notes;
    }

    // Alias compatibility properties
    public String getInstructor() {
        return instructorName;
    }

    public void setInstructor(String instructor) {
        this.instructorName = instructor;
    }

    public String getThumbnail() {
        return imageUrl;
    }

    public void setThumbnail(String thumbnail) {
        this.imageUrl = thumbnail;
    }
}