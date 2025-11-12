import { vi, beforeAll } from 'vitest'
import { mockGoogleMapsService } from './google-maps'
import { db } from '../database/cliente'
import { sql } from 'drizzle-orm'

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

// Criar tabela favorites antes de todos os testes (se não existir)
beforeAll(async () => {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "place_id" uuid NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `)
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "favorites" ADD CONSTRAINT "favorites_place_id_places_id_fk" 
        FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_favorite_index" ON "favorites" USING btree ("user_id","place_id")
    `)
  } catch (error) {
    // Ignorar erro se já existir ou se houver algum problema
    console.warn('Aviso ao criar tabela favorites no setup:', error)
  }
})
