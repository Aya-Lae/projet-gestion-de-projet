package com.gestionprojets.controller;

import com.gestionprojets.dto.TeamMemberDTO;
import com.gestionprojets.entity.Projet;
import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.repository.UtilisateurRepository;
import com.gestionprojets.service.ProjetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private static final Logger log = LoggerFactory.getLogger(TeamController.class);
    private final ProjetService projetService;
    private final UtilisateurRepository utilisateurRepository;

    public TeamController(ProjetService projetService, UtilisateurRepository utilisateurRepository) {
        this.projetService = projetService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> allMembers = new ArrayList<>();
        List<Projet> projets = projetService.findAll();

        for (Projet projet : projets) {
            for (String memberEmail : projet.getMembers()) {
                Map<String, Object> member = new HashMap<>();

                //  ID unique : email_projetId
                String uniqueId = memberEmail + "_" + projet.getId();
                member.put("id", uniqueId);
                member.put("email", memberEmail);
                member.put("projectId", projet.getId());
                member.put("projectName", projet.getName());

                utilisateurRepository.findByEmail(memberEmail).ifPresent(u -> {
                    member.put("firstName", u.getFirstName());
                    member.put("lastName", u.getLastName());
                });

                allMembers.add(member);
            }
        }

        log.info(" {} membre(s) retourné(s)", allMembers.size());
        return ResponseEntity.ok(allMembers);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody TeamMemberDTO dto) {
        try {
            log.info(" Ajout membre - Email: {}, Projet: {}", dto.getEmail(), dto.getProjectId());

            Optional<Projet> projetOpt = projetService.findById(Long.parseLong(dto.getProjectId()));

            if (projetOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Projet non trouvé");
            }

            Projet projet = projetOpt.get();
            Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(dto.getEmail());

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Utilisateur non trouvé avec cet email");
            }

            Utilisateur user = userOpt.get();

            if (projet.getMembers().contains(user.getEmail())) {
                return ResponseEntity.badRequest().body("Ce membre existe déjà dans le projet");
            }

            projet.getMembers().add(user.getEmail());
            Projet saved = projetService.save(projet, projet.getOwner());

            log.info("Membre ajouté - Projet: {} - Membres: {}", saved.getName(), saved.getMembers());

            String uniqueId = user.getEmail() + "_" + dto.getProjectId();

            Map<String, Object> response = new HashMap<>();
            response.put("id", uniqueId);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("projectId", dto.getProjectId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur ajout membre", e);
            return ResponseEntity.badRequest().body("Erreur lors de l'ajout du membre: " + e.getMessage());
        }
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> remove(@PathVariable String memberId) {
        try {
            log.info(" Suppression membre: {}", memberId);

            // Format: email_projectId
            String[] parts = memberId.split("_", 2);
            if (parts.length != 2) {
                return ResponseEntity.badRequest().body("Format d'ID invalide");
            }

            String email = parts[0];
            Long projectId = Long.parseLong(parts[1]);

            Optional<Projet> projetOpt = projetService.findById(projectId);

            if (projetOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Projet non trouvé");
            }

            Projet projet = projetOpt.get();
            boolean removed = projet.getMembers().remove(email);

            if (!removed) {
                return ResponseEntity.badRequest().body("Membre non trouvé dans le projet");
            }

            projetService.save(projet, projet.getOwner());
            log.info("Membre {} supprimé du projet {}", email, projet.getName());

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Erreur suppression", e);
            return ResponseEntity.badRequest().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}
