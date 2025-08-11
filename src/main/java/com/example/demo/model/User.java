package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String username;

    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    private Painting painting;
}
