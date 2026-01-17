package com.gestionprojets.repository;

import com.gestionprojets.entity.Projet;
import com.gestionprojets.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByOwner(Utilisateur owner);

    // ✅ Requête SQL native qui fonctionne
    @Query(value = "SELECT DISTINCT p.* FROM projets p " +
            "LEFT JOIN projet_members pm ON p.id = pm.projet_id " +
            "WHERE p.owner_id = :userId OR pm.member_name = :userEmail",
            nativeQuery = true)
    List<Projet> findByOwnerOrMember(@Param("userId") Long userId,
                                     @Param("userEmail") String userEmail);
}

