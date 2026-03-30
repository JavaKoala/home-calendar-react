# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173/
npm run build        # TypeScript compile + Vite production build
npm run lint         # ESLint check
docker compose up    # Run production build at http://localhost:8080/
```

There are no tests in this project.

## Environment Setup

Copy the sample env file before running locally:
```bash
cp .env.development.sample .env.development
```

The only env variable is `VITE_HOME_CALENDAR_API_URL` — the base URL for the backend API (defaults to `http://localhost:3000/api/v1` if unset).

## Architecture

This is a single-page React 19 app that renders a FullCalendar weekly view backed by a REST API.

**Data flow:** `App.tsx` initializes `HomeCalendarApiClient` with the API URL from env, fetches events for the current week on mount using `date-utils.ts` helpers, and passes them to FullCalendar as the initial event set. The home_calendar API is defined in `home_calendar_swagger.yaml`

**API client** (`src/HomeCalendarApiClient.ts`): Typed REST client with methods for CRUD on events. Events support recurring series via `recurring_uuid` and an `applyToSeries` flag on delete.

**Calendar** (`src/App.tsx`): FullCalendar configured for `timeGridWeek` default view (dayGridMonth and timeGridDay also available), showing 08:00–23:00 UTC with no all-day slot.

**Styling**: Tailwind CSS v4 via the Vite plugin — imported as a single `@import "tailwindcss"` in `index.css`.

**Production deploy**: Multi-stage Docker build (Node 24 builder → Nginx alpine), served on port 8080.
