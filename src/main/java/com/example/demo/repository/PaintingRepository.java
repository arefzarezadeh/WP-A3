package com.example.demo.repository;

import com.example.demo.model.Painting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaintingRepository extends JpaRepository<Painting, Long> {
}
