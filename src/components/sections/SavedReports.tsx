'use client';

import { useState } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button, Card } from '@/components/ui';
import {
  FloppyDisk,
  Folder,
  FolderOpen,
  Trash,
  Plus,
  X,
  Clock,
  FileText,
} from '@phosphor-icons/react';

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
    lastSaved,
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-title)] flex items-center justify-center">
              <Folder weight="fill" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Saved Reports</h3>
              <p className="text-xs text-[var(--color-muted)]">
                {savedReports.length} report{savedReports.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X weight="bold" className="w-5 h-5" />
          </Button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={handleSave}>
              <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />
              {currentReportId ? 'Update Report' : 'Save Report'}
            </Button>
            <Button variant="secondary" onClick={createNewReport}>
              <Plus weight="bold" className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
          {lastSaved && (
            <p className="text-xs text-[var(--color-muted)] mt-2 flex items-center gap-1">
              <Clock weight="fill" className="w-3 h-3" />
              Last saved: {formatDate(lastSaved)}
            </p>
          )}
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] mx-auto mb-4 flex items-center justify-center">
                <FolderOpen weight="light" className="w-8 h-8 text-[var(--color-muted)]" />
              </div>
              <p className="text-[var(--color-muted)]">No saved reports yet.</p>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Save your current report to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReports
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((report) => (
                  <Card
                    key={report.id}
                    className={`cursor-pointer hover:border-[var(--color-title)] transition-colors ${
                      currentReportId === report.id
                        ? 'border-[var(--color-title)] bg-[var(--color-surface)]'
                        : ''
                    }`}
                    padding="sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                        <FileText
                          weight={currentReportId === report.id ? 'fill' : 'regular'}
                          className={`w-5 h-5 ${
                            currentReportId === report.id
                              ? 'text-[var(--color-title)]'
                              : 'text-[var(--color-muted)]'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => loadReport(report.id)}>
                        <p className="font-medium text-[var(--color-title)] truncate">
                          {report.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">
                          Updated: {formatDate(report.updatedAt)}
                        </p>
                        {currentReportId === report.id && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-[var(--color-title)] text-white text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {deleteConfirmId === report.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(report.id);
                            }}
                            className="text-[var(--color-muted)] hover:text-[var(--color-error)]"
                          >
                            <Trash weight="bold" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-muted)] text-center">
            Reports are saved locally in your browser.
          </p>
        </div>
      </div>
    </>
  );
}
