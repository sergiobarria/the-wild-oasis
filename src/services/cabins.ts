import { supabase, supabaseUrl } from '@/lib/supabase';
import { Cabin } from '@/types/database';

type CabinWithFileImage = Omit<Partial<Cabin>, 'image'> & {
    image: File | null;
};

export async function createCabin(cabin: CabinWithFileImage) {
    const imageName = `${Math.random()}-${cabin.image?.name}`.replace('/', '');
    // Example url: http://127.0.0.1:54321/storage/v1/object/public/cabins/cabin-001.jpg
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabins/${imageName}`;

    // create cabin
    const { data, error } = await supabase
        .from('cabins')
        .insert([{ ...cabin, image: imagePath }])
        .select();

    if (error) {
        console.error('Error creating cabin', error);
        throw new Error('Error creating cabin');
    }

    // upload image
    const { error: storageError } = await supabase.storage
        .from('cabins')
        .upload(imageName, cabin.image!);

    // delete cabin if image upload failed
    if (storageError) {
        await supabase.from('cabins').delete().eq('id', data![0].id);
        console.error('Error uploading cabin image', storageError);
        throw new Error('Error uploading cabin image. Cabin was not created.');
    }

    return data;
}

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
