import { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { HomeCalendarApiClient, type Event } from './HomeCalendarApiClient';
import { getStartOfSundayISO, getEndOfSaturdayISO } from './utils/date-utils';

function App() {
  const apiUrl = import.meta.env.VITE_HOME_CALENDAR_API_URL as string;
  const client = useMemo(() => new HomeCalendarApiClient(apiUrl), [apiUrl]);

  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async (start: string, end: string) => {
      try {
        const data = await client.listEvents(start, end);
        setEvents(data);
        setInitialLoaded(true);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };

    void fetchEvents(getStartOfSundayISO(), getEndOfSaturdayISO());
  }, [client]);

  return (
    <>
      {initialLoaded && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          height="100%"
          timeZone={'UTC'}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth,dayGridDay'
          }}
          allDaySlot={false}
          slotMinTime={"08:00:00"}
          slotMaxTime={"23:00:00"}
          nowIndicator={true}
          initialEvents={events}
        />
      )}
    </>
  )
}

export default App
