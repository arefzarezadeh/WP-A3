import api from "./axios";
import { type PaintingDTO, type UserDTO } from "../types";

export async function login(user: UserDTO): Promise<void> {
  await api.post("/login", user);
}

export async function signup(user: UserDTO): Promise<void> {
  await api.post("/register", user);
}

export async function getPainting(): Promise<PaintingDTO> {
  const response = await api.get<PaintingDTO>("/my_painting");
  return response.data;
}

export async function savePainting(painting: PaintingDTO): Promise<void> {
  await api.post("/save_painting", painting);
}

export async function logout(): Promise<void> {
  await api.post("/logout");
}
