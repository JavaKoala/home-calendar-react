import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function App() {
  const apiEvents = `${import.meta.env.VITE_HOME_CALENDAR_API_URL}/events`

  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={apiEvents}
    />
  )
}

export default App
