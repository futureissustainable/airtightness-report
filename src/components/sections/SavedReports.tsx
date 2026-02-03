'use client';

import { useState, useRef, useEffect } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button, Textarea } from '@/components/ui';
import { FloppyDisk, Plus, X, Trash, Upload, Export } from '@phosphor-icons/react';

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
    importLegacyReport,
    exportLegacyCode,
  } = useReportStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState(false);
  const [exportedReportId, setExportedReportId] = useState<string | null>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    saveReport(generalInfo.projectName || 'Untitled Report');
  };

  const handleDelete = (id: string) => {
    deleteReport(id);
    setDeleteConfirmId(null);
  };

  const handleImport = () => {
    if (!importCode.trim()) return;

    const success = importLegacyReport(importCode);
    if (success) {
      setImportCode('');
      setShowImport(false);
      setImportError(false);
      onClose();
    } else {
      setImportError(true);
    }
  };

  const handleExport = async (reportId: string) => {
    try {
      // Load the report first if not current
      if (currentReportId !== reportId) {
        loadReport(reportId);
      }
      // Small delay to ensure state is updated
      setTimeout(async () => {
        const code = exportLegacyCode();
        await navigator.clipboard.writeText(code);
        setExportedReportId(reportId);
        setTimeout(() => setExportedReportId(null), 2000);
      }, 50);
    } catch {
      // Failed silently
    }
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
          <h4>Reports</h4>
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
            <div className="relative" ref={newMenuRef}>
              <Button variant="secondary" onClick={() => setShowNewMenu(!showNewMenu)}>
                <Plus weight="bold" className="w-4 h-4 mr-1.5" />
                New
              </Button>
              {showNewMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[var(--color-border)] shadow-lg z-10">
                  <button
                    onClick={() => { createNewReport(); setShowNewMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-surface)]"
                  >
                    Blank Report
                  </button>
                  <button
                    onClick={() => { setShowImport(true); setShowNewMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-surface)] border-t border-[var(--color-border)]"
                  >
                    Import Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showImport && (
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <Textarea
              placeholder="Paste legacy report code here..."
              value={importCode}
              onChange={(e) => {
                setImportCode(e.target.value);
                setImportError(false);
              }}
              rows={3}
              className="text-xs font-mono"
            />
            {importError && (
              <p className="text-xs text-[var(--color-error)] mt-2">
                Invalid code format. Please check and try again.
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Button variant="primary" className="flex-1" onClick={handleImport} disabled={!importCode.trim()}>
                Import
              </Button>
              <Button variant="secondary" onClick={() => { setShowImport(false); setImportCode(''); setImportError(false); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

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
                      {exportedReportId === report.id ? (
                        <span className="text-xs text-[var(--color-muted)]">Copied Code</span>
                      ) : deleteConfirmId === report.id ? (
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(report.id);
                            }}
                            className="p-1 text-[var(--color-muted)] hover:text-[var(--color-title)]"
                            title="Export code"
                          >
                            <Export weight="bold" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(report.id);
                            }}
                            className="p-1 text-[var(--color-muted)] hover:text-[var(--color-error)]"
                            title="Delete"
                          >
                            <Trash weight="bold" className="w-4 h-4" />
                          </button>
                        </div>
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
