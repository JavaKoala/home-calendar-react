import { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { HomeCalendarApiClient, type Event } from './HomeCalendarApiClient';

function App() {
  const apiUrl = import.meta.env.VITE_HOME_CALENDAR_API_URL as string;
  const client = useMemo(() => new HomeCalendarApiClient(apiUrl), [apiUrl]);

  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const start = new Date().toISOString().split('T')[0];
        const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const data = await client.listEvents(start, end);
        setEvents(data);
        setInitialLoaded(true);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };

    void fetchEvents();
  }, [client]);

  return (
    <>
      {initialLoaded && (
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin ]}
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
