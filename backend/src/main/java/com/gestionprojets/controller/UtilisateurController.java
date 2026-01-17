package com.gestionprojets.controller;

import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return utilisateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Utilisateur> add(@RequestBody Utilisateur u) {
        Utilisateur saved = utilisateurService.save(u);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Utilisateur user) {
        return utilisateurService.findById(id).map(u -> {
            if (user.getFirstName() != null) u.setFirstName(user.getFirstName());
            if (user.getLastName() != null) u.setLastName(user.getLastName());
            if (user.getEmail() != null) u.setEmail(user.getEmail());
            utilisateurService.save(u);
            return ResponseEntity.ok(u);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        utilisateurService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
