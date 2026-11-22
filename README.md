# Weather Dashboard

A React + Vite + Tailwind weather app powered by the free OpenWeather APIs.

## Features

- **City search with autocomplete**: suggestions as you type, keyboard navigation (↑ ↓ Enter Esc), recent searches, and `/` to focus search from anywhere.
- **Use my location**: one tap to load your current position, with reverse-geocoded place names.
- **Current conditions**: large animated icon, temperature, high/low, feels-like, local date and live clock, and a plain-English summary.
- **Hourly forecast chart**: 5 days in 3-hour steps, scrollable, with Temperature, Rain chance and Wind views.
- **5–6 day forecast**: temperature range bars on a shared scale, rain probability, and a "now" marker. Click a day to jump the hourly chart to it.
- **Highlights**: wind compass with gusts and Beaufort scale, sunrise/sunset arc with daylight left, air quality index with pollutants, humidity with dew point, pressure, visibility and cloud cover.
- **Favourites**: save cities with the heart button. The menu shows each one's live temperature.
- **°C / °F toggle**, which also switches wind to mph and visibility to miles.
- **Living background**: photo per condition with a cross-fade, plus animated rain, drizzle, snow, lightning, stars, sun glow or drifting cloud and fog.
- **Polish**: skeleton loading, error state with retry, toasts, share/copy summary, auto-refresh every 10 minutes, tab title with the current temperature, responsive layout, and respect for `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev
```

Create a `.env` file with your OpenWeather key:

```
VITE_WEATHER_API_KEY=your_key_here
```

## Structure

```
src/
  lib/          API calls, formatting helpers, condition → background/effect mapping
  hooks/        useWeather (current + forecast + air quality), useLocalStorage, small UI hooks
  provider/     Toast, Settings (units), Location, Weather and Favourite providers
  components/   Header, Search, Hero, Forecast, Highlights, Ambience (background + effects), States
```
