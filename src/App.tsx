import { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { HomeCalendarApiClient, type Event } from './HomeCalendarApiClient';
import Modal from "./components/Modal";

function App() {
  const apiUrl = import.meta.env.VITE_HOME_CALENDAR_API_URL as string;
  const client = useMemo(() => new HomeCalendarApiClient(apiUrl), [apiUrl]);

  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

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
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
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
          dateClick={openModal}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold">Hello from the modal!</h2>
        <p className="mt-2 text-gray-700">
          You can put any content here - forms, images, etc.
        </p>
        <button
          className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
          onClick={closeModal}
        >
          Close
        </button>
      </Modal>
    </>
  )
}

export default App
