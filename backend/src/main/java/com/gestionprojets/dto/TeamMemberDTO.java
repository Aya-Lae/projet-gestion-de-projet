package com.gestionprojets.dto;

public class TeamMemberDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String projectId;

    public TeamMemberDTO() {
    }

    public TeamMemberDTO(String firstName, String lastName, String email, String projectId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.projectId = projectId;
    }

    // Getters et Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}
