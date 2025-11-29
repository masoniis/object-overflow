<script lang="ts">
	import type { NefariousObject } from '$lib/game/models/screen_objects/nefarious_object';

	let { onClick, object } = $props<{ onClick: () => void; object: NefariousObject }>();

	let top = $derived(object.y);
	let left = $derived(object.x);
</script>

<button
	class="absolute z-40 h-20 w-20 cursor-pointer rounded-full bg-red-500"
	style="top: {top}%; left: {left}%"
	onclick={onClick}
>
	Nefarious Object
</button>
