package com.example.demo.repository;

import com.example.demo.model.Shape;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShapeRepository extends JpaRepository<Shape, Long> {
}

