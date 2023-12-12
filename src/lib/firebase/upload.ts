import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { v4 } from 'uuid';

export async function uploadFile(file: File, collection: string) {
	const path = collection + '/' + file.name.split('.').at(0) + '/' + v4();
	const storageRef = ref(storage, path);

	await uploadBytes(storageRef, file);
	const url = await getDownloadURL(storageRef);

	return url;
}
