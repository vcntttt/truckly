import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const vehicles = pgTable('vehicles', {
    id: serial('id').primaryKey(),
    license_plate: varchar('license_plate', { length: 20 }).notNull().unique(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    status: text('status').notNull(), // 'available', 'assigned', etc.
    created_at: timestamp('created_at').defaultNow(),
});
