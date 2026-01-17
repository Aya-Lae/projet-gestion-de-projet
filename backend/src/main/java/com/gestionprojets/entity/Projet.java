package com.gestionprojets.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ✅ AJOUTEZ CETTE LIGNE
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Utilisateur owner;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Tache> tasks = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "projet_members", joinColumns = @JoinColumn(name = "projet_id"))
    @Column(name = "member_name")
    private List<String> members = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Projet() {
    }

    public Projet(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
    }

    // ✅ AJOUTEZ les getters/setters pour owner
    public Utilisateur getOwner() {
        return owner;
    }

    public void setOwner(Utilisateur owner) {
        this.owner = owner;
    }

    // ... autres getters/setters (ne changez rien)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<Tache> getTasks() {
        return tasks;
    }

    public void setTasks(List<Tache> tasks) {
        this.tasks = tasks;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void addTask(Tache t) {
        tasks.add(t);
        t.setProjet(this);
    }

    public void removeTask(Tache t) {
        tasks.remove(t);
        t.setProjet(null);
    }
}
