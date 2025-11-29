<script lang="ts">
	import type { GoldenObject } from '$lib/game/models/screen_objects/golden_object';

	let { onClick, object } = $props<{ onClick: () => void; object: GoldenObject }>();

	let top = $derived(object.y);
	let left = $derived(object.x);
</script>

<button
	class="absolute z-40 h-20 w-20 cursor-pointer rounded-full bg-amber-500"
	style="top: {top}%; left: {left}%"
	onclick={onClick}
>
	Golden Object
</button>
