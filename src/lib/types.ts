import type { cabins } from './server/db/schema/cabin';
import type { settings } from './server/db/schema/settings';
import type { bookings } from './server/db/schema/booking';
import type { media } from './server/db/schema/media';

export type Cabin = typeof cabins.$inferSelect;
export type InsertCabin = typeof cabins.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;
