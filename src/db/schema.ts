import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cubeSize: integer('cube_size').notNull(),
  totalCubes: integer('total_cubes').notNull(),
  cubesRemaining: integer('cubes_remaining').notNull(),
  prizesWon: integer('prizes_won').notNull().default(0),
  status: text('status', { enum: ['active', 'completed', 'abandoned'] })
    .notNull()
    .default('active'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  completedAt: text('completed_at'),
  synced: integer('synced').notNull().default(0),
});

export const clicks = sqliteTable('clicks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  z: integer('z').notNull(),
  isWinner: integer('is_winner').notNull().default(0),
  prizeName: text('prize_name'),
  clickedAt: text('clicked_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  synced: integer('synced').notNull().default(0),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Click = typeof clicks.$inferSelect;
export type NewClick = typeof clicks.$inferInsert;
