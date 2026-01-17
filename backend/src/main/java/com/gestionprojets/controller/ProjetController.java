package com.gestionprojets.controller;

import com.gestionprojets.dto.ProjetDTO;
import com.gestionprojets.entity.Projet;
import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.service.AuthService;
import com.gestionprojets.service.ProjetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjetController {

    private static final Logger log = LoggerFactory.getLogger(ProjetController.class);
    private final ProjetService projetService;
    private final AuthService authService;

    public ProjetController(ProjetService projetService, AuthService authService) {
        this.projetService = projetService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Projet>> getAll(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);

        return authService.getUserFromToken(token)
                .map(user -> {
                    log.info(" Récupération des projets pour: {} ({})",
                            user.getFirstName() + " " + user.getLastName(),
                            user.getEmail());

                    List<Projet> projets = projetService.findAllByUser(user);

                    log.info(" Projets trouvés: {}", projets.size());
                    projets.forEach(p -> log.info("  {} - Membres: {}", p.getName(), p.getMembers()));

                    return ResponseEntity.ok(projets);
                })
                .orElseGet(() -> {
                    log.error("Utilisateur non authentifié");
                    return ResponseEntity.status(401).build();
                });
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return projetService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Projet> create(
            @RequestBody ProjetDTO dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);

        return authService.getUserFromToken(token)
                .map(user -> {
                    Projet p = new Projet(dto.getName(), dto.getDescription(), dto.getColor());
                    Projet saved = projetService.save(p, user);
                    log.info("Projet créé: {} par {}", saved.getName(), user.getEmail());
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ProjetDTO dto) {
        return projetService.findById(id).map(p -> {
            if (dto.getName() != null) p.setName(dto.getName());
            if (dto.getDescription() != null) p.setDescription(dto.getDescription());
            if (dto.getColor() != null) p.setColor(dto.getColor());
            projetService.save(p, p.getOwner());
            return ResponseEntity.ok(p);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        projetService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
