package com.gestionprojets.controller;

import com.gestionprojets.dto.TacheDTO;
import com.gestionprojets.entity.Tache;
import com.gestionprojets.enums.EtatTache;
import com.gestionprojets.service.TacheService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TacheController {

    private final TacheService tacheService;

    public TacheController(TacheService tacheService) {
        this.tacheService = tacheService;
    }

    @GetMapping
    public ResponseEntity<List<Tache>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(tacheService.findByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<Tache> create(@PathVariable Long projectId, @RequestBody TacheDTO dto) {
        Tache t = new Tache();
        t.setTitle(dto.getTitle());
        t.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            try {
                t.setStatus(EtatTache.valueOf(dto.getStatus()));
            } catch (Exception ignored) {
            }
        }
        t.setAssignee(dto.getAssignee());
        if (dto.getDueDate() != null) {
            try { t.setDueDate(LocalDate.parse(dto.getDueDate())); } catch (Exception ignored) {}
        }
        Tache created = tacheService.createForProject(projectId, t);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> update(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody TacheDTO dto) {
        Tache updated = new Tache();
        updated.setTitle(dto.getTitle());
        updated.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            try { updated.setStatus(EtatTache.valueOf(dto.getStatus())); } catch (Exception ignored) {}
        }
        updated.setAssignee(dto.getAssignee());
        if (dto.getDueDate() != null) {
            try { updated.setDueDate(LocalDate.parse(dto.getDueDate())); } catch (Exception ignored) {}
        }
        Tache saved = tacheService.update(taskId, updated);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long taskId) {
        tacheService.delete(taskId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody Map<String, String> body) {
        String text = body.get("text");
        Map<String, Object> resp = new HashMap<>();
        resp.put("taskId", taskId);
        resp.put("text", text);
        // Comments are not persisted in this simple implementation
        return ResponseEntity.ok(resp);
    }
}
