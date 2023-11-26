import { supabase } from '@/lib/supabase';

export async function getCabins() {
    const { data, error } = await supabase.from('cabins').select('*');

    if (error) {
        console.error('Error getting cabins', error);
        throw new Error('Error getting cabins');
    }

    return data;
}

export async function deleteCabin(id: number) {
    const { error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.error('Error deleting cabin', error);
        throw new Error('Error deleting cabin');
    }
}
