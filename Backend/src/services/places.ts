import { eq } from 'drizzle-orm'
import { db } from '../database/cliente'
import { places } from '../database/schema'
import { googleMapsService, GooglePlace } from './google-maps'

export interface CreatePlaceData {
  placeId: string
  name: string
  address?: string
  latitude: number
  longitude: number
  types: string[]
  rating?: number
  userRatingsTotal?: number
}

export interface PlaceWithReports {
  id: string
  placeId: string
  name: string
  address: string | null
  latitude: number
  longitude: number
  types: string[]
  rating: number | null
  userRatingsTotal: number | null
  createdAt: Date
  updatedAt: Date
  reportsCount?: number
}

class PlacesService {
  /**
   * Busca um local pelo place_id do Google Maps
   */
  async findByPlaceId(placeId: string): Promise<PlaceWithReports | null> {
    try {
      const result = await db
        .select()
        .from(places)
        .where(eq(places.placeId, placeId))
        .limit(1)

      return result[0] || null
    } catch (error) {
      console.error('Erro ao buscar local pelo place_id:', error)
      throw new Error('Falha ao buscar local')
    }
  }

  /**
   * Cria um novo local no banco de dados
   */
  async create(data: CreatePlaceData): Promise<PlaceWithReports> {
    try {
      const result = await db
        .insert(places)
        .values({
          placeId: data.placeId,
          name: data.name,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          types: data.types,
          rating: data.rating,
          userRatingsTotal: data.userRatingsTotal,
        })
        .returning()

      return result[0]
    } catch (error) {
      console.error('Erro ao criar local:', error)
      throw new Error('Falha ao criar local')
    }
  }

  /**
   * Busca ou cria um local baseado nos dados do Google Maps
   */
  async findOrCreateFromGooglePlace(googlePlace: GooglePlace): Promise<PlaceWithReports> {
    try {
      // Primeiro, tenta encontrar o local existente
      const existingPlace = await this.findByPlaceId(googlePlace.place_id)
      
      if (existingPlace) {
        return existingPlace
      }

      // Se não existe, cria um novo local
      const placeData: CreatePlaceData = {
        placeId: googlePlace.place_id,
        name: googlePlace.name,
        address: googlePlace.formatted_address,
        latitude: googlePlace.geometry.location.lat,
        longitude: googlePlace.geometry.location.lng,
        types: googlePlace.types,
        rating: googlePlace.rating,
        userRatingsTotal: googlePlace.user_ratings_total,
      }

      return await this.create(placeData)
    } catch (error) {
      console.error('Erro ao buscar ou criar local:', error)
      throw new Error('Falha ao processar local')
    }
  }

  /**
   * Busca locais próximos usando a API do Google Maps e verifica quais já existem no banco
   */
  async searchNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 1000,
    type?: string,
    keyword?: string
  ): Promise<{
    places: PlaceWithReports[]
    googlePlaces: GooglePlace[]
  }> {
    try {
      // Busca locais no Google Maps
      const googlePlaces = await googleMapsService.instance.searchNearby(
        latitude,
        longitude,
        radius,
        type,
        keyword
      )

      // Para cada local do Google Maps, verifica se já existe no banco
      const places: PlaceWithReports[] = []
      
      for (const googlePlace of googlePlaces) {
        const place = await this.findOrCreateFromGooglePlace(googlePlace)
        places.push(place)
      }

      return {
        places,
        googlePlaces,
      }
    } catch (error) {
      console.error('Erro ao buscar locais próximos:', error)
      throw new Error('Falha ao buscar locais próximos')
    }
  }

  /**
   * Busca um local pelo ID interno
   */
  async findById(id: string): Promise<PlaceWithReports | null> {
    try {
      const result = await db
        .select()
        .from(places)
        .where(eq(places.id, id))
        .limit(1)

      return result[0] || null
    } catch (error) {
      console.error('Erro ao buscar local pelo ID:', error)
      throw new Error('Falha ao buscar local')
    }
  }

  /**
   * Atualiza informações de um local
   */
  async update(id: string, data: Partial<CreatePlaceData>): Promise<PlaceWithReports> {
    try {
      const result = await db
        .update(places)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(places.id, id))
        .returning()

      if (!result[0]) {
        throw new Error('Local não encontrado')
      }

      return result[0]
    } catch (error) {
      console.error('Erro ao atualizar local:', error)
      throw new Error('Falha ao atualizar local')
    }
  }
}

export const placesService = new PlacesService()
