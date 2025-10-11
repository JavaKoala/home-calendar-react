export interface Event {
  id: number;
  title?: string;
  start: string; // ISO 8601 date‑time
  end: string;   // ISO 8601 date‑time
  color?: string;
  created_at?: string;
  updated_at?: string;
  recurring_uuid?: string | null;
}

export interface EventInput {
  event: {
    title?: string;
    start: string; // ISO 8601 date‑time
    end: string;   // ISO 8601 date‑time
    color?: string;
    recurring_times?: number;
    apply_to_series?: "0" | "1" | null;
    recurring_schedule?: "null" | "daily" | "weekly" | "monthly" | "every 2 weeks" | "every other day";
  };
}

export type ValidationError = Record<string, string[]>;

export class HomeCalendarApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Default to localhost:3000 if not provided
    this.baseUrl = baseUrl ?? "http://localhost:3000";
  }

  /** List events in a date range */
  async listEvents(start: string, end: string): Promise<Event[]> {
    const url = new URL(`${this.baseUrl}/api/v1/events`);
    url.searchParams.append("start", start);
    url.searchParams.append("end", end);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status.toString()}: ${text}`);
    }

    return res.json() as Promise<Event[]>;
  }

  /** Create a new event (or series) */
  async createEvent(input: EventInput): Promise<Event[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      let errorMessage: string;
      try {
        const errors = (await res.json()) as ValidationError;
        errorMessage = `Validation error: ${JSON.stringify(errors)}`;
      } catch {
        const text = await res.text();
        errorMessage = `Error ${String(res.status)}: ${text}`;
      }
      throw new Error(errorMessage);
    }

    return res.json() as Promise<Event[]>;
  }

  /** Retrieve a single event */
  async getEvent(id: number): Promise<Event> {
    const res = await fetch(`${this.baseUrl}/api/v1/events/${String(id)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Event ${String(id)} not found`);
      }
      const text = await res.text();
      throw new Error(`Error ${String(res.status)}: ${text}`);
    }

    return res.json() as Promise<Event>;
  }

  /** Update an event (or series) */
  async updateEvent(id: number, input: EventInput): Promise<Event[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/events/${String(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Event ${String(id)} not found`);
      }
      let errorMessage: string;
      try {
        const errors = (await res.json()) as ValidationError;
        errorMessage = `Validation error: ${JSON.stringify(errors)}`;
      } catch {
        const text = await res.text();
        errorMessage = `Error ${String(res.status)}: ${text}`;
      }
      throw new Error(errorMessage);
    }

    return res.json() as Promise<Event[]>;
  }

  /** Delete an event (or series) */
  async deleteEvent(id: number, applyToSeries?: boolean): Promise<void> {
    const url = new URL(`${this.baseUrl}/api/v1/events/${String(id)}`);
    if (applyToSeries !== undefined) {
      url.searchParams.append("apply_to_series", applyToSeries ? "1" : "0");
    }

    const res = await fetch(url.toString(), {
      method: "DELETE",
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Event ${String(id)} not found`);
      }
      const text = await res.text();
      throw new Error(`Error ${String(res.status)}: ${text}`);
    }
  }
}
