<script lang="ts">
	import type { NefariousObject } from '$lib/game/models/screen_objects/nefarious_object';

	let { onClick, object } = $props<{ onClick: () => void; object: NefariousObject }>();

	let top = $derived(object.y);
	let left = $derived(object.x);
</script>

<button class="nefarious-object" style="top: {top}%; left: {left}%" onclick={onClick}>
	Nefarious Object
</button>

<style>
	.nefarious-object {
		position: absolute;
		width: 80px;
		height: 80px;
		background-color: red;
		border-radius: 50%;
		cursor: pointer;
		z-index: 100;
	}
</style>
