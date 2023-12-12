import {
	collection,
	getDocs,
	addDoc,
	serverTimestamp,
	deleteDoc,
	doc,
	updateDoc
} from 'firebase/firestore';

import { db } from './firebase';
import type { CabinInsert } from '$lib/schemas/cabin';

export interface Cabin {
	id: string;
	name: string;
	maxCapacity: number;
	price: number;
	discount: number;
	description: string;
	image?: string;
	createdAt: Date;
	updatedAt?: Date;
}

export async function getCabins() {
	const coll = collection(db, 'cabins');
	const snapshot = await getDocs(coll);

	return snapshot.docs
		.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				...data,
				createdAt: data.createdAt?.toDate(),
				updatedAt: data.updatedAt?.toDate() ?? null
			};
		})
		.sort((a, b) => a.createdAt?.getTime() - b.createdAt?.getTime()) as Cabin[];
}

export async function createCabin(data: CabinInsert) {
	try {
		const docRef = await addDoc(collection(db, 'cabins'), {
			...data,
			createdAt: serverTimestamp()
		});
		return docRef.id;
	} catch (err: unknown) {
		console.error('Error adding document: ', err);
		return null;
	}
}

export async function updateCabin(id: string, data: Partial<Cabin>) {
	if (!id) return { success: false, message: 'No id provided' };

	const docRef = doc(db, 'cabins', id);

	try {
		await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
		return { success: true };
	} catch (err: unknown) {
		console.error('Error updating document: ', err);
		return { success: false, message: 'Error updating document' };
	}
}

export async function deleteCabin(id: string) {
	if (!id) return { success: false, message: 'No id provided' };

	try {
		const docRef = doc(db, 'cabins', id);
		await deleteDoc(docRef);

		return { success: true };
	} catch (err: unknown) {
		console.error('Error deleting document: ', err);
		return { success: false, message: 'Error deleting document' };
	}
}
