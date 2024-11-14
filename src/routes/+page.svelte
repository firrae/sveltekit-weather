<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { UnitsDropdown } from "$lib/components/ui/units-dropdown/index.js";

	import type { PageData } from "./$types";
	import CitySearchForm from "./citySearchForm.svelte";
	import ZipSearchForm from "./zipSearchForm.svelte";
	import GeoSearchForm from "./geoSearchForm.svelte";

	let { data } = $props<{ data: PageData }>();

	// Default weather data
	let weatherData = $state({
		location: "Unknown",
		date: new Date(),
		main: { temp: 0, temp_max: 0, temp_min: 0 },
		weather: [{ description: "unknown", icon: "03d" }],
	});

	// Defaults measurement units
	let units = $state("imperial");
</script>

<svelte:head>
	<title>Weather Lookup</title>
</svelte:head>

<!-- This isn't overly pretty, but it works -->
<div class="flex flex-row items-center justify-center px-8">
	<div class="flex-1">
		<UnitsDropdown class="pt-3" bind:units />
		<Tabs.Root value="city" class="w-[600px]">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="city">By City</Tabs.Trigger>
				<Tabs.Trigger value="zip">By Zip/Postal Code</Tabs.Trigger>
				<Tabs.Trigger value="geo">By Geo Coordinates</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="city">
				<CitySearchForm data={data.cityForm} bind:weatherData {units} />
			</Tabs.Content>
			<Tabs.Content value="zip">
				<ZipSearchForm data={data.zipForm} bind:weatherData {units} />
			</Tabs.Content>
			<Tabs.Content value="geo">
				<GeoSearchForm data={data.geoForm} bind:weatherData {units} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<div class="flex-1" id="weatherBox">
		<!-- This is for debugging purposes only -->
		<!-- <pre class="text-sm dark:text-gray-600">{JSON.stringify(
				weatherData,
				null,
				2
			)}</pre> -->
		<div class="flex flex-col items-center p-8 rounded-md w-60 sm:px-12">
			<div class="text-center">
				<h2 class="text-xl font-semibold" id="location">
					{weatherData?.location ?? "Unknown"}
				</h2>
				<p class="text-sm dark:text-gray-600" id="weatherDate">
					{weatherData?.date}
				</p>
			</div>
			<img
				src={`https://openweathermap.org/img/wn/${weatherData?.weather ? weatherData?.weather[0]?.icon : "03d"}@2x.png`}
				alt="weather"
				class="w-20 h-20"
				id="weatherIcon"
			/>
			<div class="mb-2 font-semibold" id="current">
				Currently: <spam class="text-2xl"
					>{Math.round(weatherData?.main?.temp)}°</spam
				>
			</div>
			<div class="mb-2 font-semibold" id="highLow">
				High: <span class="text-xl"
					>{Math.round(weatherData?.main?.temp_max)}°</span
				>
				<br />
				Low:
				<span class="text-xl">{Math.round(weatherData?.main?.temp_min)}°</span>
			</div>
			<p class="dark:text-gray-600">
				{weatherData?.weather
					? weatherData?.weather[0]?.description.charAt(0).toUpperCase() +
						weatherData?.weather[0]?.description.slice(1)
					: "unknown"}
			</p>
		</div>
	</div>
</div>
