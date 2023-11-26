import { getCabins } from '@/services/cabins';
import { useEffect } from 'react';

export function Cabins() {
    useEffect(() => {
        getCabins().then(data => console.log(data));
    }, []);

    return (
        <div>
            CabinsPage
            <img src="http://127.0.0.1:54321/storage/v1/object/public/cabins/cabin-001.jpg" />
        </div>
    );
}
