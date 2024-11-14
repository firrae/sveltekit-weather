<script lang="ts">
	import * as Select from "$lib/components/ui/select/index.js";

	let { units = $bindable(""), ...props } = $props();

	const unitsList = [
		{ value: "imperial", label: "Imperial" },
		{ value: "metric", label: "Metric" },
		{ value: "standard", label: "Standard" },
	];

	const triggerContent = $derived(
		unitsList.find((u) => {
			return u.value === units;
		})?.label
	);
</script>

<Select.Root type="single" name="country" {...props} bind:value={units}>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each unitsList as unit}
				<Select.Item value={unit.value} label={unit.label}
					>{unit.label}</Select.Item
				>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
