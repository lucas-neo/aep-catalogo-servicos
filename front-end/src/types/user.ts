export enum TipoUsuario {
  CLIENTE = 'cliente',
  PRESTADOR = 'prestador'
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface PerfilCliente {
  usuarioId: string;
  endereco?: string;
  cidade: string;
  estado: string;
}