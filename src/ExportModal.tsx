import { useState } from 'react';

interface ExportModalProps {
  exportModalOpen: boolean;
  onClose: () => void;
};

export default function ExportModal(props: ExportModalProps) {
  const { onClose } = props;

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = () => {
    console.log(start);
    console.log(end);
    return null;
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

        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className="space-y-4">
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
              <button
                type="submit"
                className="px-4 py-2 text-base text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}