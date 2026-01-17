package com.gestionprojets.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gestionprojets.enums.EtatTache;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "taches")
public class Tache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private EtatTache status = EtatTache.TODO;

    private String assignee;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id")
    @JsonBackReference  // IMPORTANT: Évite la sérialisation circulaire
    private Projet projet;

    public Tache() {
    }

    // IMPORTANT: Ajouter cette méthode pour exposer le projectId dans le JSON
    public Long getProjectId() {
        return projet != null ? projet.getId() : null;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public EtatTache getStatus() {
        return status;
    }

    public void setStatus(EtatTache status) {
        this.status = status;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }
}