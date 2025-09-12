import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

function App() {
  const apiEvents = `${import.meta.env.VITE_HOME_CALENDAR_API_URL as string}/events`

  return (
    <FullCalendar
      plugins={[ dayGridPlugin, timeGridPlugin ]}
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
      events={apiEvents}
    />
  )
}

export default App
