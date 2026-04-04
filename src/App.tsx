import { useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, DatesSetArg } from '@fullcalendar/core'
import { HomeCalendarApiClient, type Event, type EventInput } from './HomeCalendarApiClient';
import EventModal from './EventModal';

function App() {
  const apiUrl = import.meta.env.VITE_HOME_CALENDAR_API_URL as string;
  const client = useMemo(() => new HomeCalendarApiClient(apiUrl), [apiUrl]);
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    void client.listEvents(dateInfo.startStr, dateInfo.endStr)
      .then(setEvents)
      .catch((err: unknown) => { console.error('Failed to load events', err); });
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo);
  };

  const handleDateClick = (clickInfo: DateClickArg) => {
    setSelectedDate(clickInfo.dateStr);
  };

  const handleEventSave = async (id: string, input: EventInput) => {
    await client.updateEvent(id, input);
  };

  const handleEventDelete = async (id: string) => {
    await client.deleteEvent(id);
  };

  const handleEventCreate = async (input: EventInput) => {
    const created = await client.createEvent(input);
    const api = calendarRef.current?.getApi();
    created.forEach((event) => {
      api?.addEvent({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.color,
      });
    });
  };

  return (
    <>
      {selectedEvent && (
        <EventModal
          mode="edit"
          clickInfo={selectedEvent}
          onClose={() => { setSelectedEvent(null); }}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      )}
      {selectedDate && (
        <EventModal
          mode="create"
          initialStart={selectedDate}
          onClose={() => { setSelectedDate(null); }}
          onCreate={handleEventCreate}
        />
      )}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        height="100%"
        timeZone={'UTC'}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: ''
        }}
        allDaySlot={false}
        slotMinTime={"08:00:00"}
        slotMaxTime={"23:00:00"}
        nowIndicator={true}
        events={events}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
    </>
  )
}

export default App
