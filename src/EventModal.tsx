import { useState } from 'react';
import type { EventClickArg } from '@fullcalendar/core';
import type { EventInput } from './HomeCalendarApiClient';

type EventModalProps =
  | {
      mode: 'create';
      initialStart: string;
      onClose: () => void;
      onCreate: (input: EventInput) => Promise<void>;
    }
  | {
      mode: 'edit';
      clickInfo: EventClickArg;
      onClose: () => void;
      onSave: (id: string, input: EventInput) => Promise<void>;
      onDelete: (id: string) => Promise<void>;
    };

function toDateTimeLocal(iso: string): string {
  // Handle date-only strings (e.g. "2024-01-15") from day grid clicks
  if (!iso.includes('T')) {
    return `${iso}T12:00`;
  }
  return iso.replace('Z', '').slice(0, 16);
}

function addOneHour(dateTimeLocal: string): string {
  const d = new Date(`${dateTimeLocal}:00Z`);
  d.setUTCHours(d.getUTCHours() + 1);
  return toDateTimeLocal(d.toISOString());
}

function toISO(local: string): string {
  return `${local}:00Z`;
}

export default function EventModal(props: EventModalProps) {
  const isCreate = props.mode === 'create';

  const initialStart = isCreate
    ? toDateTimeLocal(props.initialStart)
    : toDateTimeLocal(props.clickInfo.event.startStr);

  const [title, setTitle] = useState(isCreate ? '' : props.clickInfo.event.title);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(
    isCreate ? addOneHour(initialStart) : toDateTimeLocal(props.clickInfo.event.endStr)
  );
  const [color, setColor] = useState(
    isCreate ? '#3b82f6' : props.clickInfo.event.backgroundColor
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onClose } = props;

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    setDeleting(true);
    setError(null);
    try {
      const { event } = props.clickInfo;
      await props.onDelete(event.id);
      event.remove();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const input: EventInput = { event: { title, start: toISO(start), end: toISO(end), color } };
      if (isCreate) {
        await props.onCreate(input);
      } else {
        const { event } = props.clickInfo;
        await props.onSave(event.id, input);
        event.setProp('title', title);
        event.setStart(toISO(start));
        event.setEnd(toISO(end));
        event.setProp('color', color);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => { e.stopPropagation(); }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {isCreate ? 'New Event' : 'Edit Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void handleSave(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => { setStart(e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => { setEnd(e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => { setColor(e.target.value); }}
                className="h-9 w-16 cursor-pointer rounded border border-gray-300 p-0.5"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>

          {error !== null && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between gap-3 pt-2">
            <div>
              {!isCreate && (
                <button
                  type="button"
                  onClick={() => { void handleDelete(); }}
                  disabled={deleting || saving}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
              >
                {saving ? 'Saving…' : isCreate ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
