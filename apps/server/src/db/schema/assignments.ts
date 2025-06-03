import { pgTable, serial, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { users } from './users';
import { vehicles } from './vehicles';

export const assignments = pgTable('assignments', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id).notNull(),
    vehicle_id: integer('vehicle_id').references(() => vehicles.id).notNull(),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date'),
    notes: text('notes'),
});
