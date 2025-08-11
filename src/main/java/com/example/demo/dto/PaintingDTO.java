package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PaintingDTO {
    private String title;
    private List<ShapeDTO> allShapes;
}
