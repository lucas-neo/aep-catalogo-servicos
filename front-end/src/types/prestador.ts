export enum CategoriaPrestador {
    MANUTENCAO_REPARO = 'manutencao_reparo',
    CASA_LIMPEZA = 'casa_limpeza',
    MODA_COSTURA = 'moda_costura',
    EDUCACAO = 'educacao',
    TECNOLOGIA = 'tecnologia',
    AUTOMOTIVO = 'automotivo',
    BELEZA_BEM_ESTAR = 'beleza_bem_estar'
}

export enum SubcategoriaPrestador {

    MECANICO = 'mecanico',
    ELETRICISTA = 'eletricista',
    ENCANADOR = 'encanador',
    AR_CONDICIONADO = 'ar_condicionado',
    ELETRODOMESTICOS = 'eletrodomesticos',
 
    DIARISTA = 'diarista',
    FAXINEIRA = 'faxineira',
    JARDINEIRO = 'jardineiro',
    PINTOR = 'pintor',


    COSTUREIRA = 'costureira',
    ALFAIATE = 'alfaiate',


    PROFESSOR_PARTICULAR = 'professor_particular',
    REFORCO_ESCOLAR = 'reforco_escolar',


    TECNICO_INFORMATICA = 'tecnico_informatica',


    MECANICO_AUTO = 'mecanico_auto',


    CABELEIREIRO = 'cabeleireiro',
    MANICURE = 'manicure'
}

export interface Prestador {
    id: string;
    usuarioId: string;
    nome: string;
    email: string;
    telefone: string;
    whatsapp?: string

    titulo: string;
    descricao: string;
    categoria: CategoriaPrestador;
    subcategoria: SubcategoriaPrestador[];

    cidade: string;
    estado: string;
    endereco?: string;
    raioAtentimento: number; // Aqui é em Km

    precoHora?: number;
    precoServico?: number;
    disponivel: boolean;

    avaliacaoMedia: number;
    totalAvaliacoes: number;

    fotoPerfil?: string;
    fotos: string[];

    criadoEm: Date;
    atualizadoEm: Date;
}

export interface FiltrosPrestador {
    categoria?: CategoriaPrestador;
    subcategoria?: SubcategoriaPrestador;
    cidade?: string;
    precoMin?: number;
    precoMax?: number;
    avaliacaoMin?: number;
    disponivel?: boolean;
}