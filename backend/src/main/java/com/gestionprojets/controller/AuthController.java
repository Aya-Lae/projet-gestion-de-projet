package com.gestionprojets.controller;

import com.gestionprojets.dto.ApiResponse;
import com.gestionprojets.dto.LoginRequest;
import com.gestionprojets.dto.RegisterRequest;
import com.gestionprojets.entity.Utilisateur;
import com.gestionprojets.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            Utilisateur created = authService.register(req);
            Map<String, Object> data = new HashMap<>();
            data.put("id", created.getId());
            data.put("firstName", created.getFirstName());
            data.put("lastName", created.getLastName());
            data.put("email", created.getEmail());
            return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            return authService.authenticate(req.getEmail(), req.getPassword())
                    .map(token -> {
                        Map<String, Object> data = new HashMap<>();
                        authService.getUserFromToken(token).ifPresent(u -> {
                            data.put("user", Map.of(
                                    "id", u.getId(),
                                    "firstName", u.getFirstName(),
                                    "lastName", u.getLastName(),
                                    "email", u.getEmail()
                            ));
                        });
                        data.put("token", token);
                        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", data));
                    })
                    .orElseGet(() -> ResponseEntity.status(401)
                            .body(new ApiResponse<>(false, "Invalid email or password")));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "No authorization token provided"));
        }

        String token = auth.substring(7);
        return authService.getUserFromToken(token)
                .map(u -> ResponseEntity.ok(new ApiResponse<>(true, "User retrieved", Map.of(
                        "id", u.getId(),
                        "firstName", u.getFirstName(),
                        "lastName", u.getLastName(),
                        "email", u.getEmail()
                ))))
                .orElseGet(() -> ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Invalid or expired token")));
    }
}

