import type { EventClickArg } from '@fullcalendar/interaction';

interface EventModalProps {
  clickInfo: EventClickArg;
  onClose: () => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}

export default function EventModal({ clickInfo, onClose }: EventModalProps) {
  const { event } = clickInfo;
  const start = event.startStr;
  const end = event.endStr;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 break-words">
            {event.title || '(No title)'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <dl className="space-y-2 text-sm text-gray-700">
          {start && (
            <>
              <div className="flex gap-2">
                <dt className="font-medium w-12 flex-shrink-0">Start</dt>
                <dd>{formatDateTime(start)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium w-12 flex-shrink-0">End</dt>
                <dd>{formatDateTime(end)}</dd>
              </div>
            </>
          )}
          {event.backgroundColor && (
            <div className="flex items-center gap-2 pt-1">
              <dt className="font-medium w-12 flex-shrink-0">Color</dt>
              <dd className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: event.backgroundColor }}
                />
                <span>{event.backgroundColor}</span>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
