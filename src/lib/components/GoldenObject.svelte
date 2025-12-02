<script lang="ts">
	import type { GoldenObject } from '$lib/game/models/screen_objects/golden_object';

	let { onClick, object } = $props<{ onClick: () => void; object: GoldenObject }>();

	let top = $derived(object.y);
	let left = $derived(object.x);
</script>

<button class="golden-object" style="top: {top}%; left: {left}%" onclick={onClick}>
	Golden Object
</button>

<style>
	.golden-object {
		position: absolute;
		width: 80px;
		height: 80px;
		background-color: gold;
		border-radius: 50%;
		cursor: pointer;
		z-index: 100;
	}
</style>
