package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Painting {
    @Id
    @GeneratedValue
    private Long painting_id;

    private String title;

    @OneToMany(mappedBy = "painting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Shape> allShapes = new ArrayList<>();
}
