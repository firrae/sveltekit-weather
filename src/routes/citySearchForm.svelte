<script lang="ts">
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { cityFormSchema } from "./citySchema";
	import { superForm, type FormResult } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	// Ideally this would be in a DB and fetched from the server as it's so large
	import { Country, State, type IState } from "country-state-city";

	import type { ActionData, PageData } from "./$types";

	// Props
	// Binds the value of the resulting weather data to the parent state
	// Recieves the units from the parent
	let {
		data = { country: "", province: "", city: "" },
		weatherData = $bindable(),
		units,
	} = $props<{
		data: PageData;
		weatherData?: any;
		units?: string;
	}>();

	const form = superForm(data, {
		validators: zodClient(cityFormSchema),
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

	const { form: formData, enhance: cityEnhance } = form;

	$effect(() => {
		$formData.units = units; // This seems hacky, but I don't see a better option right now
	});

	let countryList = Country.getAllCountries();
	let provinceList: IState[] = $derived(
		State.getStatesOfCountry($formData.country) ?? []
	);

	const triggerContent = $derived(
		countryList.find((c) => {
			return c.isoCode === $formData.country;
		})?.name ?? "Select a country"
	);

	const triggerContentProvince = $derived(
		provinceList.find((s) => {
			return s.isoCode === $formData.province;
		})?.name ?? "Select a province"
	);
</script>

<Card.Root>
	<Card.Content class="space-y-2">
		<form method="POST" action="?/citySearch" use:cityEnhance>
			<Form.Field {form} name="country">
				<Form.Control>
					<Form.Label>Country</Form.Label>
					<Select.Root
						type="single"
						name="country"
						bind:value={$formData.country}
					>
						<Select.Trigger class="w-[180px]">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each countryList as country}
									<Select.Item value={country.isoCode} label={country.name}
										>{country.name}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="province">
				<Form.Control>
					<Form.Label>State/Province</Form.Label>
					<Select.Root
						type="single"
						name="province"
						bind:value={$formData.province}
					>
						<Select.Trigger class="w-[180px]">
							{triggerContentProvince}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each provinceList as province}
									<Select.Item value={province.isoCode} label={province.name}
										>{province.name}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="city">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>City</Form.Label>
						<Input {...props} bind:value={$formData.city} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>Submit</Form.Button>
		</form>
	</Card.Content>
</Card.Root>
