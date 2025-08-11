package com.example.demo.controller;

import com.example.demo.dto.PaintingDTO;
import com.example.demo.dto.ShapeDTO;
import com.example.demo.model.Painting;
import com.example.demo.model.Shape;
import com.example.demo.model.User;
import com.example.demo.repository.PaintingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PaintController {
    private final UserRepository userRepository;
    private final PaintingRepository paintingRepository;

    public PaintController(UserRepository userRepository,  PaintingRepository paintingRepository) {
        this.userRepository = userRepository;
        this.paintingRepository = paintingRepository;
    }

    @GetMapping("/my_painting")
    public ResponseEntity<?> getUserPainting() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User user = userOpt.get();
        Painting painting = user.getPainting();

        if (painting == null) {
            return ResponseEntity.ok().body(null);
        }

        PaintingDTO paintingDTO = new PaintingDTO();
        paintingDTO.setTitle(painting.getTitle());

        List<ShapeDTO> shapeDTOs = painting.getAllShapes().stream().map(shape -> {
            ShapeDTO dto = new ShapeDTO();
            dto.setX(shape.getX());
            dto.setY(shape.getY());
            dto.setType(shape.getType());
            return dto;
        }).toList();

        paintingDTO.setAllShapes(shapeDTOs);

        return ResponseEntity.ok(paintingDTO);
    }

    @PostMapping("/save_painting")
    public ResponseEntity<?> savePainting(@RequestBody PaintingDTO paintingDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        if (user.getPainting() != null) {
            Painting oldPainting = user.getPainting();
            user.setPainting(null);
            userRepository.save(user);
            paintingRepository.delete(oldPainting);
        }

        Painting painting = new Painting();
        painting.setTitle(paintingDTO.getTitle());

        List<Shape> shapes = paintingDTO.getAllShapes().stream().map(dto -> {
            Shape s = new Shape();
            s.setX(dto.getX());
            s.setY(dto.getY());
            s.setType(dto.getType());
            s.setPainting(painting);
            return s;
        }).toList();

        painting.setAllShapes(shapes);
        user.setPainting(painting);

        userRepository.save(user);
        return ResponseEntity.ok("Painting saved");
    }
}
