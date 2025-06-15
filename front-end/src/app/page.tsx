'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MapPin, Star, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import {
  CategoriaPrestador,
  FiltrosPrestador,
} from '@/types/prestador'
import { usePrestadores } from '@/hooks/usePrestadores'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtros, setFiltros] = useState<FiltrosPrestador>({})
  
  // Hook customizado para gerenciar prestadores
  const { prestadores, loading, error, carregarPrestadores, buscarPorTermo } = usePrestadores()

  // Mapeamento para categorias
  const categoriasDisplay = {
    [CategoriaPrestador.MANUTENCAO_REPARO]: 'Manutenção & Reparo',
    [CategoriaPrestador.CASA_LIMPEZA]: 'Casa & Limpeza',
    [CategoriaPrestador.MODA_COSTURA]: 'Moda & Costura',
    [CategoriaPrestador.EDUCACAO]: 'Educação',
    [CategoriaPrestador.TECNOLOGIA]: 'Tecnologia',
    [CategoriaPrestador.AUTOMOTIVO]: 'Automotivo',
    [CategoriaPrestador.BELEZA_BEM_ESTAR]: 'Beleza & Bem-estar',
  }

  // Filtros locais nos dados carregados
  const prestadoresFiltrados = useMemo(() => {
    return prestadores.filter((prestador) => {
      // Filtro por categoria (local)
      if (filtros.categoria && prestador.categoria !== filtros.categoria) {
        return false
      }

      // Filtro por preço (local)
      if (
        filtros.precoMin &&
        prestador.precoHora &&
        prestador.precoHora < filtros.precoMin
      ) {
        return false
      }
      if (
        filtros.precoMax &&
        prestador.precoHora &&
        prestador.precoHora > filtros.precoMax
      ) {
        return false
      }

      return true
    })
  }, [prestadores, filtros])

  // Funções para aplicar filtros
  const aplicarFiltroCategoria = useCallback((categoria: CategoriaPrestador | undefined) => {
    const novosFiltros = { ...filtros, categoria }
    setFiltros(novosFiltros)
    // Recarregar dados do backend com filtro
    carregarPrestadores(novosFiltros)
  }, [filtros, carregarPrestadores])

  const aplicarFiltroPreco = useCallback((min?: number, max?: number) => {
    const novosFiltros = { ...filtros, precoMin: min, precoMax: max }
    setFiltros(novosFiltros)
    carregarPrestadores(novosFiltros)
  }, [filtros, carregarPrestadores])

  // Função de busca
  const handleBuscar = useCallback(() => {
    if (searchTerm.trim()) {
      buscarPorTermo(searchTerm)
    } else {
      carregarPrestadores(filtros)
    }
  }, [searchTerm, filtros, buscarPorTermo, carregarPrestadores])

  // Enter na busca
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Seção de Busca */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ex: eletricista, diarista, professor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button onClick={handleBuscar} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="container mx-auto px-4 py-6">
        {/* Exibir erro se houver */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto"
                onClick={() => carregarPrestadores()}>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Filtros */}
          <div className="w-64 flex-shrink-0">
            <Card className='border-0 shadow-none bg-transparent'>
              <CardContent className="p-4">
                {/* Título Categorias */}
                <h3 className="font-bold text-gray-900 mb-3">Categorias</h3>
                <div className="space-y-1">
                  {/* Botão "Todos" */}
                  <button 
                    onClick={() => aplicarFiltroCategoria(undefined)}
                    disabled={loading}
                    className={`block w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      !filtros.categoria 
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    Todos
                  </button>
                  
                  {/* Botões dinâmicos das categorias */}
                  {Object.entries(categoriasDisplay).map(([categoria, display]) => (
                    <button 
                      key={categoria}
                      onClick={() => aplicarFiltroCategoria(categoria as CategoriaPrestador)}
                      disabled={loading}
                      className={`block w-full text-left  py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                        filtros.categoria === categoria 
                          ? 'text-blue-600 font-medium' 
                          : ''
                      }`}
                    >
                    {display}
                    </button>
                  ))}
                </div>

                <br></br>

                {/* Título Faixa de Preço */}
                <h3 className="font-bold text-gray-900 mb-3">Faixa de Preço</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => aplicarFiltroPreco(undefined, undefined)}
                    disabled={loading}
                    className={`block w-full text-left py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      !filtros.precoMin && !filtros.precoMax
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => aplicarFiltroPreco(0, 30)}
                    disabled={loading}
                    className={`block w-full text-left py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      filtros.precoMin === 0 && filtros.precoMax === 30
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    Até R$ 30/hora
                  </button>
                  <button 
                    onClick={() => aplicarFiltroPreco(30, 60)}
                    disabled={loading}
                    className={`block w-full text-left py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      filtros.precoMin === 30 && filtros.precoMax === 60
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    R$ 30-60/hora
                  </button>
                  <button 
                    onClick={() => aplicarFiltroPreco(60, 100)}
                    disabled={loading}
                    className={`block w-full text-left py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      filtros.precoMin === 60 && filtros.precoMax === 100
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    R$ 60-100/hora
                  </button>
                  <button 
                    onClick={() => aplicarFiltroPreco(100, undefined)}
                    disabled={loading}
                    className={`block w-full text-left py-0.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${
                      filtros.precoMin === 100 && !filtros.precoMax
                        ? 'text-blue-600 font-medium' 
                        : ''
                    }`}
                  >
                    Acima R$ 100/hora
                  </button>
                </div>

                {/* Contador de resultados */}
                <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-center text-gray-600">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  ) : (
                    `${prestadoresFiltrados.length} resultado${prestadoresFiltrados.length !== 1 ? 's' : ''} encontrado${prestadoresFiltrados.length !== 1 ? 's' : ''}`
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grid de Prestadores */}
          <div className="flex-1">
            {loading ? (
              /* Loading State */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : prestadoresFiltrados.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {error ? 'Erro ao carregar prestadores' : 'Nenhum prestador encontrado'}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setFiltros({})
                    carregarPrestadores()
                  }}
                >
                  {error ? 'Tentar Novamente' : 'Limpar Filtros'}
                </Button>
              </div>
            ) : (
              /* Prestadores Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {prestadoresFiltrados.map((prestador) => (
                  <Link key={prestador.id} href={`/prestador/${prestador.id}`} className="block">
                    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 relative aspect-square overflow-hidden cursor-pointer">
                      <CardContent className="p-4 h-full flex flex-col justify-center relative">
                       
                        {/* Avaliação - Canto Superior Direito */}
                        <div className="absolute top-1 right-3 flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-10">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">
                            {prestador.avaliacaoMedia}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({prestador.totalAvaliacoes})
                          </span>
                        </div>

                        {/* Conteúdo Principal - Centralizado */}
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                          {/* Avatar */}
                          <Avatar className="h-20 w-20 shadow-lg ring-2 ring-white">
                            <AvatarImage src={prestador.fotoPerfil || ''} />
                            <AvatarFallback className="text-base font-semibold bg-blue-100 text-blue-700">
                              {prestador.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          {/* Informações do Prestador */}
                          <div className="space-y-1 w-full px-1">
                            {/* Nome */}
                            <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                              {prestador.nome}
                            </h3>
                            
                            {/* Título */}
                            <p className="text-blue-600 text-sm font-medium line-clamp-1">
                              {prestador.titulo}
                            </p>

                            {/* Localização e Preço - Lado a Lado */}
                            <div className="flex items-center justify-between w-full pt-1">
                              {/* Localização - Lado Esquerdo */}
                              <div className="flex items-center gap-1 ml-3">
                                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-600 line-clamp-1">
                                  {prestador.cidade}, {prestador.estado}
                                </span>
                              </div>

                              {/* Preço - Lado Direito */}
                              <div className="text-right mr-3">
                                <span className="text-xs font-bold text-green-700">
                                  {prestador.precoHora ? `R$ ${prestador.precoHora}/h` : 'Consulta'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}