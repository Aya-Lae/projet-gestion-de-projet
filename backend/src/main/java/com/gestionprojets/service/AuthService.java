package com.gestionprojets.service;

import com.gestionprojets.dto.RegisterRequest;
import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    private final UtilisateurService utilisateurService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UtilisateurService utilisateurService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.utilisateurService = utilisateurService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Utilisateur register(RegisterRequest req) {
        Utilisateur u = new Utilisateur(req.getFirstName(), req.getLastName(), req.getEmail(),
                passwordEncoder.encode(req.getPassword()));
        return utilisateurService.save(u);
    }

    public Optional<String> authenticate(String email, String password) {
        return utilisateurService.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> jwtUtil.generateToken(u.getId().toString(), u.getEmail()));
    }

    public void logout(String token) {
        // Token invalidation can be implemented using a blacklist if needed
    }

    public Optional<Utilisateur> getUserFromToken(String token) {
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            return utilisateurService.findById(Long.parseLong(userId));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
