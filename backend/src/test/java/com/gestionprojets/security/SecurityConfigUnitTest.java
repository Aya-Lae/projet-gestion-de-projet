package com.gestionprojets.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigUnitTest {

    // Test unitaire simple sans Spring: instancie SecurityConfig et vérifie PasswordEncoder
    @Test
    void passwordEncoderProducesMatchingHash() {
        JwtFilter noOpFilter = new JwtFilter(new JwtUtil()) {
            @Override
            protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain chain) throws java.io.IOException, jakarta.servlet.ServletException {
                // no-op
            }
        };

        SecurityConfig config = new SecurityConfig(noOpFilter);
        PasswordEncoder encoder = config.passwordEncoder();
        assertNotNull(encoder);

        String raw = "unit-test-123";
        String encoded = encoder.encode(raw);
        assertNotNull(encoded);
        assertNotEquals(raw, encoded);
        assertTrue(encoder.matches(raw, encoded));
    }
}
