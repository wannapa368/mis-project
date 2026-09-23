import { useEffect } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

// กล่องยืนยันก่อนลบ
export default function ConfirmDialog({ title, message, confirmLabel = 'ลบ', busy = false, error = '', onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm card p-6 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <Trash2 size={22} />
        </div>
        <h3 id="confirm-title" className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{message}</p>
        {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel} disabled={busy} className="btn-ghost text-xs px-4">
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
