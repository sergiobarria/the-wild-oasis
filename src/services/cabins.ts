import { supabase } from '@/lib/supabase';

export async function getCabins() {
    const { data, error } = await supabase.from('cabins').select('*');

    if (error) {
        console.error('Error getting cabins', error);
        throw new Error('Error getting cabins');
    }

    return data;
}
