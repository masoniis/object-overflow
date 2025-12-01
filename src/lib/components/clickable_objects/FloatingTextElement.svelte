<script lang="ts">
	import type { FloatingText } from '$lib/game/models/screen_objects/visual/floating_text';

	let { object } = $props<{ object: FloatingText }>();

	let top = $derived(object.y_pos);
	let left = $derived(object.x_pos);
	let durationStr = $derived(`${object.duration}ms`);
</script>

<div
	class="pointer-events-none absolute z-50 animate-float-up select-none whitespace-nowrap font-bold"
	style="top: {top}%; left: {left}%; --lifespan: {durationStr};"
>
	{object.text}
</div>

<style>
	@keyframes floatUp {
		0% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-50px) scale(1.15);
		}
	}

	.animate-float-up {
		animation: floatUp var(--lifespan) ease-out forwards;
	}
</style>
