package com.gestionprojets.dto;

public class TacheDTO {
    private String title;
    private String description;
    private String status;
    private String assignee;
    private String dueDate; // ISO date string

    public TacheDTO() {
    }

    public TacheDTO(String title, String description, String status, String assignee, String dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.assignee = assignee;
        this.dueDate = dueDate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
