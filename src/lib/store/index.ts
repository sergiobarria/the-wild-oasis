export type CabinFormType = 'create' | 'edit';

export interface CabinForm {
	type: CabinFormType;
	isOpen: boolean;
}

// export const cabinModalStore =
