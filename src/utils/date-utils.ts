export function getStartOfSundayISO(date: Date | string | number = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Subtract current day index to get back to Sunday (0)
    d.setDate(diff);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
}

export function getEndOfSaturdayISO(date: Date | string | number = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();

    // Calculate difference to get to Saturday (Index 6)
    // If today is Sunday (0), diff is 6.
    // If today is Saturday (6), diff is 0.
    const diff = 6 - day;

    d.setDate(d.getDate() + diff);

    // Set to the last millisecond of the day in UTC
    d.setUTCHours(23, 59, 59, 999);

    return d.toISOString();
}
