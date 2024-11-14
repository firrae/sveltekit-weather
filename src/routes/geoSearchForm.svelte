<script lang="ts">
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { superForm, type FormResult } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	import type { ActionData, PageData } from "./$types";
	import { geoFormSchema } from "./geoSchema";

	// Props
	// Binds the value of the resulting weather data to the parent state
	// Recieves the units from the parent
	let {
		data = { latitude: 0, longitude: 0 },
		weatherData = $bindable(),
		units,
	} = $props<{
		data: PageData;
		weatherData?: any;
		units?: string;
	}>();

	const form = superForm(data, {
		validators: zodClient(geoFormSchema),
		dataType: "json",
		resetForm: false,
		onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.weatherData) {
				weatherData = {
					...action.weatherData,
					location: `${action.weatherData.name}, ${action.weatherData.sys.country}`,
				};
			}
		},
	});

	const { form: formData, enhance: geoEnhance } = form;

	$effect(() => {
		$formData.units = units; // This seems hacky, but I don't see a better option right now
	});
</script>

<Card.Root>
	<Card.Content class="space-y-2">
		<form method="POST" action="?/geoSearch" use:geoEnhance>
			<Form.Field {form} name="latitude">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Latitude</Form.Label>
						<Input
							{...props}
							step="any"
							type="number"
							bind:value={$formData.latitude}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="longitude">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Longitude</Form.Label>
						<Input
							{...props}
							step="any"
							type="number"
							bind:value={$formData.longitude}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>Submit</Form.Button>
		</form>
	</Card.Content>
</Card.Root>
