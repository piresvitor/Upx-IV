import { relations } from "drizzle-orm"
import { pgTable, uniqueIndex, uuid, text, timestamp, doublePrecision, serial, boolean } from "drizzle-orm/pg-core"

// Tabela de Usuários (User)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'), 
})

// Relações para a tabela de Usuários
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  votes: many(votes),
}))

// Tabela de Locais (Places)
export const places = pgTable('places', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: text('place_id').notNull().unique(), // Google Maps Place ID
  name: text('name').notNull(),
  address: text('address'),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  types: text('types').array().notNull().default([]), // Tipos do Google Maps (restaurant, hospital, etc.)
  rating: doublePrecision('rating'),
  userRatingsTotal: doublePrecision('user_ratings_total'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Tabela de Relatos (Report)
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: uuid('user_id').notNull().references(() => users.id),
  placeId: uuid('place_id').references(() => places.id), // Referência opcional ao local
  rampaAcesso: boolean('rampa_acesso').notNull().default(false),
  banheiroAcessivel: boolean('banheiro_acessivel').notNull().default(false),
  estacionamentoAcessivel: boolean('estacionamento_acessivel').notNull().default(false),
  acessibilidadeVisual: boolean('acessibilidade_visual').notNull().default(false),
})

// Relações para a tabela de Locais
export const placesRelations = relations(places, ({ many }) => ({
  reports: many(reports),
}))

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [reports.placeId],
    references: [places.id],
  }),
  votes: many(votes),
}))

// Tabela de Votos (Vote/Like)
export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  reportId: uuid('report_id').notNull().references(() => reports.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, table => ({
  uniqueVote: uniqueIndex('unique_vote_index').on(table.userId, table.reportId),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  report: one(reports, {
    fields: [votes.reportId],
    references: [reports.id],
  }),
}))
