export function FormField({ children }: { children: React.ReactNode }) {
	return <div className="mb-3 space-y-1">{children}</div>;
}

export function FieldErrors({ errors }: { errors: string[] | undefined }) {
	if (!errors) return null;

	return (
		<div>
			{errors.map((error, index) => (
				<p key={index} className="text-xs italic text-red-500">
					*{error}
				</p>
			))}
		</div>
	);
}

export function FieldDescription({ children }: { children: React.ReactNode }) {
	return <p className="text-xs text-muted-foreground">{children}</p>;
}
