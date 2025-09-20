import { vi } from 'vitest'
import { mockGoogleMapsService } from './google-maps'

// Mock do módulo google-maps
vi.mock('../services/google-maps', () => ({
  googleMapsService: {
    get instance() {
      return mockGoogleMapsService
    }
  }
}))

// Mock do axios para evitar chamadas reais da API
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        result: {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
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
    }))
  }
}))
