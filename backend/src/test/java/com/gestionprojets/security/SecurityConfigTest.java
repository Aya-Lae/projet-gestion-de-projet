package com.gestionprojets.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads_andBeansPresent() {
        assertNotNull(passwordEncoder, "PasswordEncoder doit être présent dans le contexte");

        Map<String, SecurityFilterChain> chains = applicationContext.getBeansOfType(SecurityFilterChain.class);
        assertNotNull(chains, "Doit trouver des SecurityFilterChain dans le contexte");
        assertTrue(chains.size() >= 1, "Au moins un SecurityFilterChain doit être présent");
    }

    @Test
    void passwordEncoderEncodesAndMatches() {
        String raw = "test1234";
        String encoded = passwordEncoder.encode(raw);
        assertNotNull(encoded);
        assertNotEquals(raw, encoded);
        assertTrue(passwordEncoder.matches(raw, encoded));
    }

    @Configuration
    static class TestConfig {
        // Fournit un JwtFilter no-op pour éviter d'utiliser Mockito (ByteBuddy/Java 24 issue)
        @Bean
        @Primary
        public JwtFilter jwtFilter() {
            return new JwtFilter(new JwtUtil()) {
                @Override
                protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                        throws ServletException, IOException {
                    // no-op: passe la requete en avant
                    filterChain.doFilter(request, response);
                }
            };
        }

        // Fournit le HandlerMappingIntrospector requis par Spring Security pour requestMatchers
        @Bean
        public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
            return new HandlerMappingIntrospector();
        }
    }
}
