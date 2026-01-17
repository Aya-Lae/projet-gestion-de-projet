package com.gestionprojets.service;

import com.gestionprojets.entity.Projet;
import com.gestionprojets.entity.Tache;
import com.gestionprojets.enums.EtatTache;
import com.gestionprojets.repository.TacheRepository;
import com.gestionprojets.repository.ProjetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TacheService {

    private final TacheRepository tacheRepository;
    private final ProjetRepository projetRepository;

    public TacheService(TacheRepository tacheRepository, ProjetRepository projetRepository) {
        this.tacheRepository = tacheRepository;
        this.projetRepository = projetRepository;
    }

    public List<Tache> findByProject(Long projetId) {
        // Charger le projet avec ses tâches
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        return projet.getTasks();
    }

    public Optional<Tache> findById(Long id) {
        return tacheRepository.findById(id);
    }

    @Transactional  // AJOUTÉ: Garantit que toutes les opérations sont dans une transaction
    public Tache createForProject(Long projetId, Tache t) {
        Projet p = projetRepository.findById(projetId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Définir le statut par défaut si null
        if (t.getStatus() == null) {
            t.setStatus(EtatTache.TODO);
        }

        // Associer la tâche au projet
        t.setProjet(p);

        // Sauvegarder la tâche
        Tache savedTache = tacheRepository.save(t);

        // IMPORTANT: Ajouter la tâche à la liste du projet
        p.addTask(savedTache);
        projetRepository.save(p);

        return savedTache;
    }

    @Transactional  // AJOUTÉ: Garantit la cohérence des données
    public Tache update(Long id, Tache updated) {
        Tache t = tacheRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (updated.getTitle() != null) {
            t.setTitle(updated.getTitle());
        }
        if (updated.getDescription() != null) {
            t.setDescription(updated.getDescription());
        }
        if (updated.getStatus() != null) {
            t.setStatus(updated.getStatus());
        }
        if (updated.getAssignee() != null) {
            t.setAssignee(updated.getAssignee());
        }
        if (updated.getDueDate() != null) {
            t.setDueDate(updated.getDueDate());
        }

        return tacheRepository.save(t);
    }

    @Transactional  // AJOUTÉ: Garantit la suppression cohérente
    public void delete(Long id) {
        Tache tache = tacheRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        // IMPORTANT: Retirer la tâche du projet avant de la supprimer
        if (tache.getProjet() != null) {
            tache.getProjet().removeTask(tache);
            projetRepository.save(tache.getProjet());
        }

        tacheRepository.deleteById(id);
    }
}
