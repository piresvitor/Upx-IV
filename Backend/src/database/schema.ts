import { relations } from "drizzle-orm"
import { pgTable, uniqueIndex, uuid, text, timestamp, doublePrecision, serial } from "drizzle-orm/pg-core"

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
  interestAreas: many(interestAreasToUsers),
}))

// Tabela de Relatos (Report)
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  photos: text("photos_url").array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: uuid('user_id').notNull().references(() => users.id),
})

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
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

// Tabela de Áreas de Interesse (InterestArea)
export const interestAreas = pgTable('interest_areas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
})

export const interestAreasRelations = relations(interestAreas, ({ many }) => ({
  users: many(interestAreasToUsers),
}))

// Tabela de Junção para a Relação Muitos-para-Muitos
export const interestAreasToUsers = pgTable('interest_areas_to_users', {
  userId: uuid('user_id').notNull().references(() => users.id),
  interestAreaId: uuid('interest_area_id').notNull().references(() => interestAreas.id),
}, table => ({
  pk: uniqueIndex('pk').on(table.userId, table.interestAreaId),
}))

export const interestAreasToUsersRelations = relations(interestAreasToUsers, ({ one }) => ({
  user: one(users, {
    fields: [interestAreasToUsers.userId],
    references: [users.id],
  }),
  interestArea: one(interestAreas, {
    fields: [interestAreasToUsers.interestAreaId],
    references: [interestAreas.id],
  }),
}))

