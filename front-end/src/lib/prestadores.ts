import axios from 'axios'
import { Prestador, FiltrosPrestador } from '@/types/prestador'

// URL base da API (você pode configurar no .env depois)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Instância do axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Para cookies de autenticação
})

// Serviço para buscar prestadores
export const prestadoresService = {
  // Buscar todos os prestadores com filtros
  async buscarPrestadores(filtros?: FiltrosPrestador): Promise<Prestador[]> {
    try {
      const params = new URLSearchParams()
      
      if (filtros?.categoria) {
        params.append('categoria', filtros.categoria)
      }
      if (filtros?.subcategoria) {
        params.append('subcategoria', filtros.subcategoria)
      }
      if (filtros?.cidade) {
        params.append('cidade', filtros.cidade)
      }
      if (filtros?.precoMin) {
        params.append('precoMin', filtros.precoMin.toString())
      }
      if (filtros?.precoMax) {
        params.append('precoMax', filtros.precoMax.toString())
      }
      if (filtros?.avaliacaoMin) {
        params.append('avaliacaoMin', filtros.avaliacaoMin.toString())
      }
      if (filtros?.disponivel !== undefined) {
        params.append('disponivel', filtros.disponivel.toString())
      }

      const response = await api.get(`/prestadores?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      throw new Error('Falha ao carregar prestadores')
    }
  },

  // Buscar prestador por ID
  async buscarPrestadorPorId(id: string): Promise<Prestador> {
    try {
      const response = await api.get(`/prestadores/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar prestador:', error)
      throw new Error('Prestador não encontrado')
    }
  },

  // Buscar prestadores por termo de busca
  async buscarPorTermo(termo: string): Promise<Prestador[]> {
    try {
      const response = await api.get(`/prestadores/busca?q=${encodeURIComponent(termo)}`)
      return response.data
    } catch (error) {
      console.error('Erro na busca:', error)
      throw new Error('Falha na busca')
    }
  }
}

export default prestadoresService