import { useState, useEffect, useCallback } from 'react'
import { Prestador, FiltrosPrestador } from '@/types/prestador'
import { prestadoresService } from '@/lib/prestadores'

export function usePrestadores() {
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar prestadores
  const carregarPrestadores = useCallback(async (filtros?: FiltrosPrestador) => {
    try {
      setLoading(true)
      setError(null)
      const dados = await prestadoresService.buscarPrestadores(filtros)
      setPrestadores(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setPrestadores([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar por termo
  const buscarPorTermo = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      carregarPrestadores()
      return
    }

    try {
      setLoading(true)
      setError(null)
      const dados = await prestadoresService.buscarPorTermo(termo)
      setPrestadores(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca')
      setPrestadores([])
    } finally {
      setLoading(false)
    }
  }, [carregarPrestadores])

  // Carregar dados na inicialização
  useEffect(() => {
    carregarPrestadores()
  }, [carregarPrestadores])

  return {
    prestadores,
    loading,
    error,
    carregarPrestadores,
    buscarPorTermo,
    recarregar: () => carregarPrestadores()
  }
}