import { useRef } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Copy, ImagePlus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const statusConfig = {
  pending:    { icon: null,           color: 'text-gray-400',   bg: 'bg-gray-50',    border: 'border-gray-200', label: 'Pending'    },
  processing: { icon: Loader2,        color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200', label: 'Processing' },
  done:       { icon: CheckCircle2,   color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Saved'   },
  duplicate:  { icon: Copy,           color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200', label: 'Duplicate'},
  error:      { icon: AlertCircle,    color: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-200',  label: 'Failed'  },
};

export default function UploadModal({ onClose }) {
  const fileInputRef = useRef(null);
  const { uploadQueue, isUploading, setBulkQueue, startBulkUpload, clearUploadQueue } = useAppStore();

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((f) =>
      ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(f.type)
    );
    if (imageFiles.length > 0) {
      setBulkQueue(imageFiles);
    }
  };

  const done = uploadQueue.filter((q) => q.status === 'done').length;
  const failed = uploadQueue.filter((q) => q.status === 'error').length;
  const dupes = uploadQueue.filter((q) => q.status === 'duplicate').length;
  const total = uploadQueue.length;

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploadQueue.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Bulk Upload Screenshots</h3>
          <p className="text-xs text-gray-500 mb-6 px-4">
            Upload up to 50 screenshots (PNG, JPG, WEBP). AI will extract the data automatically.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ImagePlus className="w-4 h-4" />
            <span>Select Screenshots</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress summary */}
          {isUploading && (
            <div className="border border-blue-200 rounded-xl p-3 bg-blue-50 flex items-center space-x-3">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-medium text-blue-800 mb-1">
                  <span>Processing images...</span>
                  <span>{done + failed + dupes}/{total}</span>
                </div>
                <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? ((done + failed + dupes) / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isUploading && uploadQueue.some((q) => q.status !== 'pending') && (
            <div className="flex items-center space-x-3 text-xs py-1">
              {done > 0 && <span className="text-emerald-700 font-medium">✓ {done} saved</span>}
              {dupes > 0 && <span className="text-amber-700 font-medium">⊘ {dupes} duplicate</span>}
              {failed > 0 && <span className="text-rose-700 font-medium">✗ {failed} failed</span>}
            </div>
          )}

          {/* File queue list */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {uploadQueue.map((item, idx) => {
              const cfg = statusConfig[item.status];
              const Icon = cfg.icon;
              return (
                <div key={idx} className={`flex items-center space-x-3 border ${cfg.border} rounded-xl px-3 py-2.5 ${cfg.bg}`}>
                  {Icon ? (
                    <Icon className={`w-4 h-4 shrink-0 ${cfg.color} ${item.status === 'processing' ? 'animate-spin' : ''}`} />
                  ) : (
                    <div className="w-4 h-4 shrink-0 rounded-full border-2 border-gray-300" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.file.name}</p>
                    {item.result && (
                      <p className="text-[10px] text-gray-500 truncate">{item.result.company} — {item.result.position}</p>
                    )}
                    {item.error && (
                      <p className="text-[10px] text-rose-600 truncate">{item.error}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 pt-2">
            {uploadQueue.every((q) => q.status === 'pending') && (
              <button
                onClick={startBulkUpload}
                disabled={isUploading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Extract & Save {uploadQueue.length} File{uploadQueue.length > 1 ? 's' : ''}
              </button>
            )}
            {!isUploading && uploadQueue.some((q) => q.status !== 'pending') && (
              <button
                onClick={() => {
                  clearUploadQueue();
                  onClose();
                }}
                className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            )}
            {!isUploading && (
              <button
                onClick={() => {
                  clearUploadQueue();
                  fileInputRef.current?.click();
                }}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors border border-gray-200"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
