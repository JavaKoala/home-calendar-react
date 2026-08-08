interface ExportModalProps {
  exportModalOpen: boolean;
  onClose: () => void;
};

export default function ExportModal(props: ExportModalProps) {
  const { onClose } = props;

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
      </div>
    </div>
  )
}