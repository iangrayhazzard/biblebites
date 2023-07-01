export default function Reference({
	params,
}: {
	params: { book: string; chapter: string; verse: string };
}) {
	const { book, chapter, verse } = params;
	return (
		<div>
			Current Reference: {book} {chapter}:{verse}
		</div>
	);
}
