'use client';

import { useState } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui';
import { FloppyDisk, Plus, X, Trash } from '@phosphor-icons/react';

interface SavedReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedReports({ isOpen, onClose }: SavedReportsProps) {
  const {
    currentReportId,
    generalInfo,
    savedReports,
    saveReport,
    loadReport,
    deleteReport,
    createNewReport,
  } = useReportStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSave = () => {
    saveReport(generalInfo.projectName || 'Untitled Report');
  };

  const handleDelete = (id: string) => {
    deleteReport(id);
    setDeleteConfirmId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h4>Saved Reports</h4>
          <button onClick={onClose} className="p-1 text-[var(--color-muted)] hover:text-[var(--color-title)]">
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={handleSave}>
              <FloppyDisk weight="bold" className="w-4 h-4 mr-1.5" />
              {currentReportId ? 'Update' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={createNewReport}>
              <Plus weight="bold" className="w-4 h-4 mr-1.5" />
              New
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {savedReports.length === 0 ? (
            <p className="text-[var(--color-muted)] text-center py-8">
              No saved reports yet.
            </p>
          ) : (
            <div className="space-y-2">
              {savedReports
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 border cursor-pointer transition-colors ${
                      currentReportId === report.id
                        ? 'border-[var(--color-title)] bg-[var(--color-surface)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-title)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0" onClick={() => loadReport(report.id)}>
                        <p className="font-medium text-[var(--color-title)] truncate text-sm">
                          {report.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {formatDate(report.updatedAt)}
                        </p>
                      </div>
                      {deleteConfirmId === report.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="px-2 py-1 text-xs bg-[var(--color-error)] text-white"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-xs text-[var(--color-muted)]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(report.id);
                          }}
                          className="p-1 text-[var(--color-muted)] hover:text-[var(--color-error)]"
                        >
                          <Trash weight="bold" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-muted)] text-center">
            Saved locally in browser
          </p>
        </div>
      </div>
    </>
  );
}
