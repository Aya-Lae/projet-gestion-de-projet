package com.gestionprojets.service;

import com.gestionprojets.entity.Projet;
import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.repository.ProjetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjetService {

    private static final Logger log = LoggerFactory.getLogger(ProjetService.class);
    private final ProjetRepository projetRepository;

    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public List<Projet> findAllByUser(Utilisateur owner) {
        log.info("Recherche projets pour: {} {} (id={}, email={})",
                owner.getFirstName(), owner.getLastName(), owner.getId(), owner.getEmail());

        List<Projet> projets = projetRepository.findByOwnerOrMember(owner.getId(), owner.getEmail());

        log.info("{} projet(s) trouvé(s)", projets.size());
        for (Projet p : projets) {
            log.info("  Projet: {} (id={}) - Owner ID: {} - Membres: {}",
                    p.getName(), p.getId(), p.getOwner().getId(), p.getMembers());
        }

        return projets;
    }

    public List<Projet> findAll() {
        return projetRepository.findAll();
    }

    public Optional<Projet> findById(Long id) {
        return projetRepository.findById(id);
    }

    public Projet save(Projet p, Utilisateur owner) {
        p.setOwner(owner);
        Projet saved = projetRepository.save(p);
        log.info("Projet sauvegardé: {} (id={}) - Membres: {}", saved.getName(), saved.getId(), saved.getMembers());
        return saved;
    }

    public void deleteById(Long id) {
        log.info("Suppression du projet id={}", id);
        projetRepository.deleteById(id);
    }
}
