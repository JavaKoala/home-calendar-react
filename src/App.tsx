import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function App() {
  const apiEvents = `${import.meta.env.VITE_HOME_CALENDAR_API_URL as string}/events`

  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridWeek,dayGridMonth,dayGridDay'
      }}
      events={apiEvents}
    />
  )
}

export default App
