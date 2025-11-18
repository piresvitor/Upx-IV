// Mock para o Google Maps Service para testes
export const mockGoogleMapsService = {
  async getPlaceDetails(placeId: string) {
    // Mock de resposta para placeId válido
    if (placeId === 'ChIJN1t_tDeuEmsRUsoyG83frY4') {
      return {
        place_id: placeId,
        name: 'Mock Place',
        formatted_address: 'Mock Address, Sorocaba, SP, Brazil',
        geometry: {
          location: {
            lat: -23.5015,
            lng: -47.4526
          }
        },
        types: ['restaurant', 'food'],
        rating: 4.5,
        user_ratings_total: 100,
        business_status: 'OPERATIONAL'
      }
    }
    
    // Para placeId inválido, simular erro
    throw new Error('Erro na API do Google Maps: NOT_FOUND')
  },

  async searchNearby(latitude: number, longitude: number, radius: number = 1000, type?: string, keyword?: string) {
    // Mock de resposta para busca nearby - retorna array diretamente
    return [
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        name: 'Mock Restaurant',
        formatted_address: 'Mock Address, Sorocaba, SP, Brazil',
        geometry: {
          location: {
            lat: latitude + 0.001,
            lng: longitude + 0.001
          }
        },
        types: ['restaurant', 'food'],
        rating: 4.2,
        user_ratings_total: 50,
        business_status: 'OPERATIONAL'
      }
    ]
  },

  async searchByText(query: string, latitude?: number, longitude?: number, radius?: number) {
    // Mock de resposta para busca por texto - retorna array de lugares em Sorocaba
    // Se a query contém termos que indicam "não encontrado", retorna vazio
    if (query.toLowerCase().includes('xyzabc123nonexistentplace999')) {
      return []
    }

    // Retorna lugares mockados dentro dos bounds de Sorocaba
    return [
      {
        place_id: 'ChIJTestPlace123456789',
        name: `Mock ${query}`,
        formatted_address: 'Rua Teste, Sorocaba, SP, Brazil',
        geometry: {
          location: {
            lat: latitude ? latitude : -23.529,
            lng: longitude ? longitude : -47.4686
          }
        },
        types: ['establishment'],
        rating: 4.0,
        user_ratings_total: 25,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'ChIJTestPlace987654321',
        name: `Another Mock ${query}`,
        formatted_address: 'Av. Teste, Sorocaba, SP, Brazil',
        geometry: {
          location: {
            lat: latitude ? latitude + 0.01 : -23.519,
            lng: longitude ? longitude + 0.01 : -47.4586
          }
        },
        types: ['establishment'],
        rating: 4.5,
        user_ratings_total: 50,
        business_status: 'OPERATIONAL'
      }
    ]
  }
}

// Mock da instância singleton
export const mockGoogleMapsInstance = {
  get instance() {
    return mockGoogleMapsService
  }
}
