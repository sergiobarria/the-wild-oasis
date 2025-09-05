import type { cabins } from './server/db/schema/cabin';
import type { settings } from './server/db/schema/settings';
import type { bookings } from './server/db/schema/booking';

export type Cabin = typeof cabins.$inferSelect;
export type InsertCabin = typeof cabins.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
