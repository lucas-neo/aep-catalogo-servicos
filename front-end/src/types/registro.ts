import { CategoriaPrestador, SubcategoriaPrestador } from "./prestador"

export interface DadosPessoais {
  nome: string
  email: string
  telefone: string
  whatsapp?: string
  senha: string
  confirmSenha: string
  cpf: string
}

export interface DadosProfissionais {
  titulo: string
  categoria: CategoriaPrestador
  subcategorias: SubcategoriaPrestador[]
  descricao: string
  anosExperiencia: number
  certificacoes?: string[]
}

export interface DadosLocalizacao {
  cep: string
  endereco: string
  cidade: string
  estado: string
  bairro?: string
  raioAtendimento: number
  bairrosPreferenciais?: string[]
}

export type DiaSemana = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

export interface DadosComerciais {
  precoHora?: number
  precoServico?: number
  disponivel: boolean
  diasDisponiveis: DiaSemana[]
  horarioInicio: string
  horarioFim: string
}

export interface DadosPortfolio {
  fotoPerfil?: File
  fotosTrabalhos: File[]
  documentos: File[]
}

export interface RegistroPrestadorCompleto {
  dadosPessoais: DadosPessoais
  dadosProfissionais: DadosProfissionais
  dadosLocalizacao: DadosLocalizacao
  dadosComerciais: DadosComerciais
  dadosPortfolio: DadosPortfolio
}