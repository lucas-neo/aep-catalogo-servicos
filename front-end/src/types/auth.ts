import { Prestador } from "./prestador";
import { TipoUsuario, Usuario } from "./user";

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface RegisterRequest {
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    telefone?: string;
}

export interface AuthResponse{
    usuario: Usuario;
    token: string;
    prestador?: Prestador;
}