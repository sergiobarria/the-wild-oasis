import { useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '~/_generated/api'
import { Id } from '~/_generated/dataModel'
import { Input } from './input'
import { Button } from './button'

interface ImageUploadProps {
	storageId?: Id<'_storage'>
	imageUrl?: string
	onImageUpload: (storageId: Id<'_storage'>) => void
	onDeleteImage: () => void
}

export function ImageUpload({
	storageId,
	imageUrl,
	onImageUpload,
	onDeleteImage,
}: ImageUploadProps) {
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const generateUploadUrl = useMutation(api.files.generateUploadUrl)
	const deleteImageMutation = useMutation(api.files.deleteById)
	const imageInputRef = useRef<HTMLInputElement>(null)

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files) return

		const file = files[0]
		const reader = new FileReader()
		reader.onload = () => {
			setSelectedImage(file)
		}
		reader.readAsDataURL(file)

		const url = await generateUploadUrl()
		const result = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': file.type },
			body: file,
		})

		const { storageId } = (await result.json()) as { storageId: Id<'_storage'> }

		onImageUpload(storageId)
	}

	async function handleDeleteImage() {
		if (!storageId) return

		await deleteImageMutation({ storageId })

		setSelectedImage(null)
		onDeleteImage()
		imageInputRef.current!.value = ''
		toast.info('Image removed successfully.')
	}

	return (
		<>
			{(selectedImage || imageUrl) && (
				<div className="mb-6 flex items-center gap-4">
					{selectedImage && (
						<img
							src={URL.createObjectURL(selectedImage)}
							alt="Cabin"
							className="h-32 w-32 rounded-lg object-cover"
						/>
					)}
					{imageUrl && (
						<img
							src={imageUrl}
							alt="Cabin"
							className="h-32 w-32 rounded-lg object-cover"
						/>
					)}
					<Button type="button" variant="ghost" onClick={handleDeleteImage}>
						Remove Image
					</Button>
				</div>
			)}
			<Input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} />
		</>
	)
}
