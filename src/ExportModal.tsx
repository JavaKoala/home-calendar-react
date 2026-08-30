import { useState } from 'react';
import type { HomeCalendarApiClient } from './HomeCalendarApiClient';

interface ExportModalProps {
  exportModalOpen: boolean;
  onClose: () => void;
  client: HomeCalendarApiClient;
  reloadEvents: () => Promise<void>;
};

export default function ExportModal(props: ExportModalProps) {
  const { onClose } = props;
  const { client } = props;
  const { reloadEvents } = props;

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");

  const readyToDownload = () =>
    start.trim().length > 0 &&
    end.trim().length > 0 &&
    start < end;

  const handleImport = async () => {
    if (!importFile) {
      return;
    }

    try {
      await client.importICalEvents(importFile);
      await reloadEvents();
      onClose();
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unable to import calendar file.",
      );
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
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-start justify-between gap-4 mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Export Calendar Events
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => { setStart(e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => { setEnd(e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <a href={client.exportICalLink(start, end)} target="_blank" rel="noopener noreferrer"
                onClick={onClose}
                className={
                  readyToDownload() ?
                  'px-4 py-2 text-base text-white bg-blue-600 hover:bg-blue-700 rounded-lg' :
                  'pointer-events-none opacity-50 cursor-not-allowed px-4 py-2 text-base text-white bg-blue-600 hover:bg-blue-700 rounded-lg'
                }
              >
                Download
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Import Calendar Events</h2>
          
          {importError && (
            <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {importError}
            </div>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); void handleImport(); }} className="space-y-4">
            <div>
              <label htmlFor="calendar-file" className="block text-base font-medium text-gray-700 mb-1">Calendar File</label>
              <input
                id="calendar-file"
                type="file"
                accept=".ics,text/calendar"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setImportFile(files[0]);
                  } else {
                    setImportFile(null);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!importFile}
                className={
                  importFile ?
                  'px-4 py-2 text-base text-white bg-blue-600 hover:bg-blue-700 rounded-lg' :
                  'px-4 py-2 text-base text-white bg-blue-600 opacity-50 cursor-not-allowed rounded-lg'
                }
              >
                Import
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
