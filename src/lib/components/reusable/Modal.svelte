<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		title?: string;
		children: Snippet;
	}

	let { isOpen = $bindable(false), title = 'Info', children }: Props = $props();

	function close() {
		isOpen = false;
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			close();
		}
	}

	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			close();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/50"
		role="button"
		tabindex="0"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
	>
		<div
			class="flex min-w-[300px] max-w-lg cursor-default flex-col gap-4 rounded-lg p-5 shadow-lg outline-none bg-gray-500"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">{title}</h2>
				<button
					class="cursor-pointer border-none bg-transparent p-0 text-2xl leading-none text-gray-500 hover:text-black"
					onclick={close}
					aria-label="Close modal"
				>
					&times;
				</button>
			</div>

			<div>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
