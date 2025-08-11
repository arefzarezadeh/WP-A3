export interface ShapeDTO {
  x: number;
  y: number;
  type: string;
}

export interface PaintingDTO {
  title: string;
  allShapes: ShapeDTO[];
}

export interface UserDTO {
  username: string;
  password: string;
}