import { pgTable, serial, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';

export const maintenances = pgTable('maintenances', {
    id: serial('id').primaryKey(),
    vehicle_id: integer('vehicle_id').references(() => vehicles.id).notNull(),
    date: timestamp('date').notNull(),
    type: text('type').notNull(), // 'preventive' | 'corrective'
    description: text('description'),
    cost: integer('cost'),
});
