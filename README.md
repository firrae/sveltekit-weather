## How to run

- Download the code to a machine with an LTS release of Node, this was written with Node 22.11.0.
- Create a `.env` file with your OpenWeatherMap API key like so: `open_weather_map_api=XXXXXXXXXXX`.
- Run NPM install to install dependencies.
- Run `npm run dev` to start the application in development mode.

### Resources Used

- Node 22.11.0
- SvelteKit 5
- Tailwind CSS
- [shadcn-svelte](https://next.shadcn-svelte.com)
- [country-state-city](https://www.npmjs.com/package/country-state-city)
- [superforms](https://superforms.rocks)
- [formsnap](https://formsnap.dev/)

### Example Inputs
#### City Search

- Canada, Ontario, Sarnia
- United States, Washington, Seattle

#### Zip/Postal Code Search

- Canada, A0E2M0
- United States, 90210
- United Kingdom, E14

#### Geo Coordinates

- lat: 31.222220, lon: 121.458060
- lat: -6.21462, lon: 106.84513
- lat: 72.6992, lon: -77.9595
- lat: -77.84632, lon: 166.66824
