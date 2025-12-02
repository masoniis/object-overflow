/**
 * Converts a mouse event into Game Container percentages (0-100).
 * @param e The mouse event
 * @param container The main game container element
 */
export default function getClickCoordinates(e: MouseEvent, container: HTMLElement) {
	const rect = container.getBoundingClientRect();

	const xPixels = e.clientX - rect.left;
	const yPixels = e.clientY - rect.top;

	return {
		x: (xPixels / rect.width) * 100,
		y: (yPixels / rect.height) * 100
	};
}
