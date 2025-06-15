"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import axios from "axios";
import { User, Briefcase } from "lucide-react";
import { CategoriaPrestador, SubcategoriaPrestador } from "@/types/prestador";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Estado para tipo de usuário
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'prestador'>('cliente')
  
  // Estados básicos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  // Estados específicos para prestador
  const [cpf, setCpf] = useState("");
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaPrestador | "">("");
  const [subcategorias, setSubcategorias] = useState<SubcategoriaPrestador[]>([]);
  const [descricao, setDescricao] = useState("");
  const [anosExperiencia, setAnosExperiencia] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [endereco, setEndereco] = useState("");
  const [raioAtendimento, setRaioAtendimento] = useState("");
  const [precoHora, setPrecoHora] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Estados da UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mapeamento de categorias para exibição
  const categoriasDisplay = {
    [CategoriaPrestador.MANUTENCAO_REPARO]: 'Manutenção & Reparo',
    [CategoriaPrestador.CASA_LIMPEZA]: 'Casa & Limpeza',
    [CategoriaPrestador.MODA_COSTURA]: 'Moda & Costura',
    [CategoriaPrestador.EDUCACAO]: 'Educação',
    [CategoriaPrestador.TECNOLOGIA]: 'Tecnologia',
    [CategoriaPrestador.AUTOMOTIVO]: 'Automotivo',
    [CategoriaPrestador.BELEZA_BEM_ESTAR]: 'Beleza & Bem-estar',
  }

  // Subcategorias por categoria
  const subcategoriasPorCategoria = {
    [CategoriaPrestador.MANUTENCAO_REPARO]: [
      { value: SubcategoriaPrestador.ELETRICISTA, label: 'Eletricista' },
      { value: SubcategoriaPrestador.ENCANADOR, label: 'Encanador' },
      { value: SubcategoriaPrestador.AR_CONDICIONADO, label: 'Ar Condicionado' },
      { value: SubcategoriaPrestador.ELETRODOMESTICOS, label: 'Eletrodomésticos' },
    ],
    [CategoriaPrestador.CASA_LIMPEZA]: [
      { value: SubcategoriaPrestador.DIARISTA, label: 'Diarista' },
      { value: SubcategoriaPrestador.FAXINEIRA, label: 'Faxineira' },
      { value: SubcategoriaPrestador.JARDINEIRO, label: 'Jardineiro' },
      { value: SubcategoriaPrestador.PINTOR, label: 'Pintor' },
    ],
    [CategoriaPrestador.MODA_COSTURA]: [
      { value: SubcategoriaPrestador.COSTUREIRA, label: 'Costureira' },
      { value: SubcategoriaPrestador.ALFAIATE, label: 'Alfaiate' },
    ],
    [CategoriaPrestador.EDUCACAO]: [
      { value: SubcategoriaPrestador.PROFESSOR_PARTICULAR, label: 'Professor Particular' },
      { value: SubcategoriaPrestador.REFORCO_ESCOLAR, label: 'Reforço Escolar' },
    ],
    [CategoriaPrestador.TECNOLOGIA]: [
      { value: SubcategoriaPrestador.TECNICO_INFORMATICA, label: 'Técnico em Informática' },
    ],
    [CategoriaPrestador.AUTOMOTIVO]: [
      { value: SubcategoriaPrestador.MECANICO_AUTO, label: 'Mecânico Automotivo' },
    ],
    [CategoriaPrestador.BELEZA_BEM_ESTAR]: [
      { value: SubcategoriaPrestador.CABELEIREIRO, label: 'Cabeleireiro' },
      { value: SubcategoriaPrestador.MANICURE, label: 'Manicure' },
    ],
  }

  // Máscara para telefone
  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  }

  // Máscara para CPF
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return value
  }

  // Máscara para CEP
  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{5})(\d{3})$/)
    if (match) {
      return `${match[1]}-${match[2]}`
    }
    return value
  }

  // Buscar endereço por CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setCidade(data.localidade)
          setEstado(data.uf)
          setEndereco(`${data.logradouro}, ${data.bairro}`)
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  // Upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas')
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem deve ter no máximo 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('http://localhost:3001/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.url) {
        setFotoPerfil(`http://localhost:3001${response.data.url}`)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      setError('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  // Manipulador do FileUpload component
  const handleFileSelect = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('http://localhost:3001/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.fullUrl) {
        setFotoPerfil(response.data.fullUrl)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      setError('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  // Handle mudança de subcategoria
  const handleSubcategoriaChange = (subcategoria: SubcategoriaPrestador, checked: boolean) => {
    if (checked) {
      setSubcategorias(prev => [...prev, subcategoria])
    } else {
      setSubcategorias(prev => prev.filter(sub => sub !== subcategoria))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    // Validações específicas para prestador
    if (tipoUsuario === 'prestador') {
      if (!cpf) {
        setError("CPF é obrigatório para prestadores");
        return;
      }
      if (!titulo) {
        setError("Título profissional é obrigatório");
        return;
      }
      if (!categoria) {
        setError("Categoria é obrigatória");
        return;
      }
      if (subcategorias.length === 0) {
        setError("Selecione pelo menos uma subcategoria");
        return;
      }
    }

    setLoading(true);

    try {
      const dadosRegistro = {
        tipoUsuario,
        name,
        email,
        password,
        telefone,
        whatsapp,
        ...(tipoUsuario === 'prestador' && {
          cpf,
          titulo,
          categoria,
          subcategorias,
          descricao,
          anosExperiencia: parseInt(anosExperiencia) || 0,
          cep,
          cidade,
          estado,
          endereco,
          raioAtendimento: parseInt(raioAtendimento) || 10,
          precoHora: precoHora ? parseFloat(precoHora) : undefined,
          fotoPerfil,
        })
      }

      await axios.post(
        "http://localhost:3001/api/register",
        dadosRegistro,
        {
          withCredentials: true,
        }
      );
      setSuccess("Conta criada com sucesso! Você já pode fazer login.");
      // Opcional: redirecionar para login automaticamente
      window.location.href = "/login";
    } catch (err) {
      setError("Erro ao tentar registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
      <Card>
        <CardHeader>
          <CardTitle>Criar nova conta</CardTitle>
          <CardDescription>
            Escolha o tipo de conta e preencha seus dados
          </CardDescription>
          
          {/* Seletor de Tipo de Usuário */}
          <div className="flex gap-2 p-1  rounded-lg">
            <button
              type="button"
              onClick={() => setTipoUsuario('cliente')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tipoUsuario === 'cliente'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setTipoUsuario('prestador')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tipoUsuario === 'prestador'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Prestador
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                
                <div className="grid gap-3">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      required
                      value={telefone}
                      onChange={(e) => {
                        const formatted = formatTelefone(e.target.value)
                        setTelefone(formatted)
                      }}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => {
                        const formatted = formatTelefone(e.target.value)
                        setWhatsapp(formatted)
                      }}
                    />
                  </div>
                </div>

                {/* CPF - apenas para prestadores */}
                {tipoUsuario === 'prestador' && (
                  <div className="grid gap-3">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      required
                      value={cpf}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value)
                        setCpf(formatted)
                      }}
                      maxLength={14}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Campos específicos para Prestador */}
              {tipoUsuario === 'prestador' && (
                <>
                  {/* Informações Profissionais */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Informações Profissionais</h3>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="titulo">Título Profissional *</Label>
                      <Input
                        id="titulo"
                        type="text"
                        placeholder="Ex: Eletricista Residencial"
                        required
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </div>

                    {/* Upload de Foto de Perfil */}
                    <div className="grid gap-3">
                      <Label>Foto de Perfil</Label>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        preview={fotoPerfil}
                        loading={uploading}
                        onRemove={() => setFotoPerfil("")}
                        accept="image/*"
                        maxSize={5}
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="categoria">Categoria Principal *</Label>
                      <Select value={categoria} onValueChange={(value) => {
                        setCategoria(value as CategoriaPrestador)
                        setSubcategorias([]) // Limpar subcategorias quando muda categoria
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoriasDisplay).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subcategorias */}
                    {categoria && subcategoriasPorCategoria[categoria] && (
                      <div className="grid gap-3">
                        <Label>Especialidades *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {subcategoriasPorCategoria[categoria].map((sub) => (
                            <div key={sub.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={sub.value}
                                checked={subcategorias.includes(sub.value)}
                                onCheckedChange={(checked) => 
                                  handleSubcategoriaChange(sub.value, checked as boolean)
                                }
                              />
                              <Label htmlFor={sub.value} className="text-sm">
                                {sub.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid gap-3">
                      <Label htmlFor="descricao">Descrição dos Serviços</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva os serviços que você oferece..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Upload de Foto de Perfil */}
                    <div className="grid gap-3">
                      <Label htmlFor="fotoPerfil">Foto de Perfil</Label>
                      <div className="flex items-center gap-4">
                        {fotoPerfil && (
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={fotoPerfil} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            id="fotoPerfil"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="cursor-pointer"
                          />
                          {uploading && (
                            <p className="text-sm text-gray-500 mt-1">Fazendo upload...</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Aceita PNG, JPG ou JPEG até 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="anosExperiencia">Anos de Experiência</Label>
                        <Input
                          id="anosExperiencia"
                          type="number"
                          placeholder="0"
                          min="0"
                          value={anosExperiencia}
                          onChange={(e) => setAnosExperiencia(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="precoHora">Preço por Hora (R$)</Label>
                        <Input
                          id="precoHora"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={precoHora}
                          onChange={(e) => setPrecoHora(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Localização e Atendimento</h3>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        type="text"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value)
                          setCep(formatted)
                          if (formatted.length === 9) {
                            buscarEnderecoPorCEP(formatted)
                          }
                        }}
                        maxLength={9}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          type="text"
                          placeholder="Sua cidade"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                          id="estado"
                          type="text"
                          placeholder="UF"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          maxLength={2}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        type="text"
                        placeholder="Rua, número, bairro"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="raioAtendimento">Raio de Atendimento (km)</Label>
                      <Input
                        id="raioAtendimento"
                        type="number"
                        placeholder="10"
                        min="1"
                        max="100"
                        value={raioAtendimento}
                        onChange={(e) => setRaioAtendimento(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Registrar"}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="bg-green-100 border-green-400 text-green-900">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Faça login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
