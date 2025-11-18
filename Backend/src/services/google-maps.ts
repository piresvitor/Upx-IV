import axios from 'axios'

export interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  rating?: number
  user_ratings_total?: number
  business_status?: string
}

export interface NearbySearchResponse {
  results: GooglePlace[]
  status: string
  next_page_token?: string
}

export interface PlaceDetailsResponse {
  result: GooglePlace & {
    opening_hours?: {
      open_now: boolean
      weekday_text: string[]
    }
    photos?: Array<{
      photo_reference: string
      height: number
      width: number
    }>
    reviews?: Array<{
      author_name: string
      rating: number
      text: string
      time: number
    }>
  }
  status: string
}

class GoogleMapsService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api'

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY não configurada nas variáveis de ambiente')
    }
  }

  /**
   * Busca locais próximos a uma localização específica
   */
  async searchNearby(
    latitude: number,
    longitude: number,
    radius: number = 1000,
    type?: string,
    keyword?: string
  ): Promise<GooglePlace[]> {
    try {
      const params = new URLSearchParams({
        location: `${latitude},${longitude}`,
        radius: radius.toString(),
        key: this.apiKey,
      })

      if (type) {
        params.append('type', type)
      }

      if (keyword) {
        params.append('keyword', keyword)
      }

      const response = await axios.get<NearbySearchResponse>(
        `${this.baseUrl}/place/nearbysearch/json?${params}`
      )

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Erro na API do Google Maps: ${response.data.status}`)
      }

      return response.data.results || []
    } catch (error) {
      console.error('Erro ao buscar locais próximos:', error)
      throw new Error('Falha ao buscar locais próximos')
    }
  }

  /**
   * Busca detalhes de um local específico pelo place_id
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponse['result'] | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        fields: 'place_id,name,formatted_address,geometry,types,rating,user_ratings_total,business_status,opening_hours,photos,reviews',
        key: this.apiKey,
      })

      const response = await axios.get<PlaceDetailsResponse>(
        `${this.baseUrl}/place/details/json?${params}`
      )

      if (response.data.status !== 'OK') {
        throw new Error(`Erro na API do Google Maps: ${response.data.status}`)
      }

      return response.data.result
    } catch (error) {
      console.error('Erro ao buscar detalhes do local:', error)
      throw new Error('Falha ao buscar detalhes do local')
    }
  }

  /**
   * Busca locais por texto (text search)
   */
  async searchByText(
    query: string,
    latitude?: number,
    longitude?: number,
    radius?: number
  ): Promise<GooglePlace[]> {
    try {
      // Adicionar "Sorocaba, SP" na query para limitar resultados à cidade
      const queryWithLocation = `${query} Sorocaba SP`
      
      const params = new URLSearchParams({
        query: queryWithLocation,
        key: this.apiKey,
      })

      if (latitude && longitude) {
        params.append('location', `${latitude},${longitude}`)
      }

      if (radius) {
        params.append('radius', radius.toString())
      }

      const response = await axios.get<NearbySearchResponse>(
        `${this.baseUrl}/place/textsearch/json?${params}`
      )

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Erro na API do Google Maps: ${response.data.status}`)
      }

      // Filtrar resultados para garantir que estão em Sorocaba
      const results = response.data.results || []
      
      // Bounds aproximados de Sorocaba
      const sorocabaBounds = {
        north: -23.400,
        south: -23.600,
        east: -47.300,
        west: -47.600,
      }

      // Filtrar por coordenadas e endereço
      const filteredResults = results.filter(place => {
        const lat = place.geometry.location.lat
        const lng = place.geometry.location.lng
        
        // Verificar se está dentro dos bounds de Sorocaba
        const withinBounds = 
          lat >= sorocabaBounds.south &&
          lat <= sorocabaBounds.north &&
          lng >= sorocabaBounds.west &&
          lng <= sorocabaBounds.east
        
        // Verificar se o endereço contém "Sorocaba" (case insensitive)
        const addressContainsSorocaba = 
          place.formatted_address?.toLowerCase().includes('sorocaba') ||
          place.formatted_address?.toLowerCase().includes('sorocaba, sp') ||
          place.formatted_address?.toLowerCase().includes('sorocaba - sp')
        
        return withinBounds && (addressContainsSorocaba || !place.formatted_address)
      })

      return filteredResults
    } catch (error) {
      console.error('Erro ao buscar locais por texto:', error)
      throw new Error('Falha ao buscar locais por texto')
    }
  }

  /**
   * Obtém URL da foto do Google Maps
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`
  }
}

let googleMapsServiceInstance: GoogleMapsService | null = null

export const googleMapsService = {
  get instance() {
    if (!googleMapsServiceInstance) {
      googleMapsServiceInstance = new GoogleMapsService()
    }
    return googleMapsServiceInstance
  }
}
