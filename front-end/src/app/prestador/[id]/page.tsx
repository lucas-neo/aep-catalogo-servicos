'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Mail, 
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Prestador, CategoriaPrestador } from '@/types/prestador'
import { prestadoresService } from '@/lib/prestadores'

export default function PrestadorPerfilPage() {
  const params = useParams()
  const router = useRouter()
  const [prestador, setPrestador] = useState<Prestador | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const prestadorId = params.id as string

  // Mapeamento para categorias
  const categoriasDisplay = {
    [CategoriaPrestador.MANUTENCAO_REPARO]: '🔧 Manutenção & Reparo',
    [CategoriaPrestador.CASA_LIMPEZA]: '🏠 Casa & Limpeza',
    [CategoriaPrestador.MODA_COSTURA]: '👗 Moda & Costura',
    [CategoriaPrestador.EDUCACAO]: '📚 Educação',
    [CategoriaPrestador.TECNOLOGIA]: '💻 Tecnologia',
    [CategoriaPrestador.AUTOMOTIVO]: '🚗 Automotivo',
    [CategoriaPrestador.BELEZA_BEM_ESTAR]: '✨ Beleza & Bem-estar',
  }

  useEffect(() => {
    const carregarPrestador = async () => {
      try {
        setLoading(true)
        setError(null)
        const dados = await prestadoresService.buscarPrestadorPorId(prestadorId)
        setPrestador(dados)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar prestador')
        console.error('Erro ao carregar prestador:', err)
      } finally {
        setLoading(false)
      }
    }

    if (prestadorId) {
      carregarPrestador()
    }
  }, [prestadorId])

  const handleWhatsApp = () => {
    const numero = prestador?.whatsapp || prestador?.telefone
    if (numero) {
      const numeroLimpo = numero.replace(/\D/g, '')
      const mensagem = `Olá ${prestador?.nome}, vi seu perfil e gostaria de contratar seus serviços!`
      const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`
      window.open(url, '_blank')
    }
  }

  const handleTelefone = () => {
    if (prestador?.telefone) {
      window.open(`tel:${prestador.telefone}`, '_self')
    }
  }

  const handleEmail = () => {
    if (prestador?.email) {
      const assunto = `Interesse em seus serviços - ${prestador.titulo}`
      const corpo = `Olá ${prestador.nome},\n\nVi seu perfil e gostaria de saber mais sobre seus serviços.\n\nObrigado!`
      window.open(`mailto:${prestador.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`, '_self')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !prestador) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Prestador não encontrado'}
            </h3>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botão voltar */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - Informações do prestador */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card principal do prestador */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                      <AvatarImage src={prestador.fotoPerfil} alt={prestador.nome} />
                      <AvatarFallback className="text-lg">
                        {prestador.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Informações principais */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {prestador.nome}
                    </h1>
                    
                    <p className="text-lg text-gray-700 mb-3">
                      {prestador.titulo}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {categoriasDisplay[prestador.categoria]}
                      </Badge>
                      
                      {prestador.disponivel && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Disponível
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{prestador.cidade}, {prestador.estado}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{prestador.avaliacaoMedia.toFixed(1)}</span>
                        <span>({prestador.totalAvaliacoes} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {prestador.descricao}
                </p>
              </CardContent>
            </Card>

            {/* Galeria de fotos */}
            {prestador.fotos && prestador.fotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Galeria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {prestador.fotos.map((foto, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={foto} 
                          alt={`Trabalho ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Informações de contato e preços */}
          <div className="space-y-6">
            {/* Card de preços */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prestador.precoHora && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Por hora:</span>
                    <span className="font-semibold text-lg">
                      R$ {prestador.precoHora.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {prestador.precoServico && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Serviço completo:</span>
                    <span className="font-semibold text-lg">
                      R$ {prestador.precoServico.toFixed(2)}
                    </span>
                  </div>
                )}

                <Separator />
                
                <div className="text-xs text-gray-500">
                  * Preços podem variar conforme a complexidade do serviço
                </div>
              </CardContent>
            </Card>

            {/* Card de contato */}
            <Card>
              <CardHeader>
                <CardTitle>Entre em contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* WhatsApp */}
                {(prestador.whatsapp || prestador.telefone) && (
                  <Button 
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}

                {/* Telefone */}
                {prestador.telefone && (
                  <Button 
                    variant="outline" 
                    onClick={handleTelefone}
                    className="w-full"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                )}

                {/* Email */}
                <Button 
                  variant="outline" 
                  onClick={handleEmail}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </CardContent>
            </Card>

            {/* Informações adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Raio de atendimento:</span>
                  <span>{prestador.raioAtentimento} km</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Membro desde:</span>
                  <span>{new Date(prestador.criadoEm).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Última atualização:</span>
                  <span>{new Date(prestador.atualizadoEm).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}