import type { Actions, PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms";
import { cityFormSchema } from "./citySchema";
import { geoFormSchema } from "./geoSchema";
import { zipFormSchema } from "./zipSchema";
import { zod } from "sveltekit-superforms/adapters";
import { error, fail } from '@sveltejs/kit';

import { open_weather_map_api } from '$env/static/private';

export const load: PageServerLoad = async () => {
    return {
        cityForm: await superValidate(zod(cityFormSchema)),
        geoForm: await superValidate(zod(geoFormSchema)),
        zipForm: await superValidate(zod(zipFormSchema)),
    };
};

export const actions = {
    citySearch: async (event) => {
        const form = await superValidate(event, zod(cityFormSchema));

        // Get the geo coords for the city
        const { country, province, city, units } = form.data;
        const locQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${province},${country}&limit=1&appid=${open_weather_map_api}`;
        const locRes = await fetch(locQuery);
        if (!locRes.ok) {
            return fail(locRes.status, {
                error: await locRes.text(),
            });
        }

        const locData = await locRes.json();
        if (!locData.length) {
            return error(404, "City not found");
        }

        const { lat, lon } = locData[0];

        // Get the weather for the city
        const weatherQuery = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${open_weather_map_api}`;
        const weatherRes = await fetch(weatherQuery);
        if (!weatherRes.ok) {
            return fail(weatherRes.status, {
                error: await weatherRes.text(),
            });
        }

        const weatherData = await weatherRes.json();

        return {
            form,
            weatherData: { ...weatherData, date: new Date(), },
        };
    },
    zipSearch: async (event) => {
        const form = await superValidate(event, zod(zipFormSchema));

        // Get the geo coords for the city
        const { zipCode, country, units } = form.data;

        const locQuery = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${country}&limit=1&appid=${open_weather_map_api}`;
        const locRes = await fetch(locQuery);
        if (!locRes.ok) {
            return fail(locRes.status, {
                error: await locRes.text(),
            });
        }

        const locData = await locRes.json();
        if (!locData.name) {
            return error(404, "Location not found");
        }

        const { lat, lon } = locData;

        // Get the weather for the city
        const weatherQuery = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${open_weather_map_api}`;
        const weatherRes = await fetch(weatherQuery);
        if (!weatherRes.ok) {
            return fail(weatherRes.status, {
                error: await weatherRes.text(),
            });
        }

        const weatherData = await weatherRes.json();

        return {
            form,
            weatherData: { ...weatherData, date: new Date(), },
        };
    },
    geoSearch: async (event) => {
        const form = await superValidate(event, zod(geoFormSchema));

        // Get the weather for the geo coords
        const { latitude, longitude, units } = form.data;
        const weatherQuery = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${open_weather_map_api}`;
        const weatherRes = await fetch(weatherQuery);
        if (!weatherRes.ok) {
            return fail(weatherRes.status, {
                error: await weatherRes.text(),
            });
        }

        const weatherData = await weatherRes.json();

        // Get the location data for the geo coords
        const locQuery = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${open_weather_map_api}`;
        const locRes = await fetch(locQuery);
        if (!locRes.ok) {
            return fail(locRes.status, {
                error: await locRes.text(),
            });
        }

        const locData = await locRes.json();

        return {
            form,
            weatherData: { ...weatherData, location: locData[0], date: new Date(), },
        };
    }
} satisfies Actions;