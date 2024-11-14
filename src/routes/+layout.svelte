<script lang="ts">
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";
	import { Button } from "$lib/components/ui/button/index.js";

	import "../app.css";
	import { error } from "@sveltejs/kit";
	let { children } = $props();
</script>

<ModeWatcher defaultMode={"dark"} />
<div class="hidden flex-col md:flex">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<nav class={"flex items-center space-x-4 lg:space-x-6 mx-6"}>
				<a
					href="/"
					class="hover:text-primary text-sm font-medium transition-colors"
				>
					Home
				</a>

				<!-- A second link if needed -->
				<!-- <a
					href="/about"
					class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
				>
					About
				</a> -->
			</nav>
			<div class="ml-auto flex items-center space-x-4">
				<Button onclick={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</div>

	<div class="container pt-8 items-center">
		{#if children}
			{@render children()}
		{:else}
			{error(404, "Not found here")}
		{/if}
	</div>
</div>
