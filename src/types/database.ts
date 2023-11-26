import { Database } from './schemas';
export type { Database } from './schemas';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
// export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Cabin = Tables<'cabins'>;
export type Booking = Tables<'bookings'>;
export type Guest = Tables<'guests'>;
export type Settings = Tables<'settings'>;
// etc...
