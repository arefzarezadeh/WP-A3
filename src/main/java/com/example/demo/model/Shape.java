package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Shape {
    @Id
    @GeneratedValue
    private Long id;

    private String type;
    private double x;
    private double y;

    @ManyToOne
    @JoinColumn(name = "painting_id")
    private Painting painting;
}

