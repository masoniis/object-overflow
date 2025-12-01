<script lang="ts">
	import type { GoldenObject } from '$lib/game/models/screen_objects/interactive/golden_object';

	let { onClick, object } = $props<{ onClick: () => void; object: GoldenObject }>();

	let top = $derived(object.y_pos);
	let left = $derived(object.x_pos);
</script>

<button
	class="absolute z-40 h-20 w-20 cursor-pointer rounded-full bg-amber-500"
	style="top: {top}%; left: {left}%"
	onclick={onClick}
>
	Golden Object
</button>
