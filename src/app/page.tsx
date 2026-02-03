'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import {
  GeneralInformation,
  BuildingConditions,
  VolumeCalculation,
  BuildingPreparation,
  LeakageIdentification,
  MeasurementData,
  Results,
  Charts,
  SavedReports,
} from '@/components/sections';
import { useReportStore } from '@/store/reportStore';
import {
  Folder,
  DownloadSimple,
  FloppyDisk,
  Broom,
} from '@phosphor-icons/react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { hasUnsavedChanges, currentReportId, generalInfo, saveReport, cleanupEmptyRows } = useReportStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    saveReport(generalInfo.projectName || 'Untitled Report');
  };

  return (
    <>
      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-title)] text-white px-4 py-2 flex items-center gap-4 shadow-lg print:hidden">
          <span className="text-sm">
            {currentReportId ? 'Unsaved changes' : 'New report'}
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-sm transition-colors"
          >
            <FloppyDisk weight="bold" className="w-4 h-4" />
            Save
          </button>
        </div>
      )}

      {/* Scroll Progress Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-border)] z-40 print:hidden">
        <div
          className="h-full bg-[var(--color-title)] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 print:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-full bg-[var(--color-title)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--color-paragraph)] transition-colors"
          title="Saved Reports"
        >
          <Folder weight="bold" className="w-5 h-5" />
        </button>
        <button
          onClick={() => cleanupEmptyRows()}
          className="w-12 h-12 rounded-full bg-[var(--color-surface)] text-[var(--color-title)] shadow-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-background)] transition-colors"
          title="Clean up empty rows"
        >
          <Broom weight="bold" className="w-5 h-5" />
        </button>
        <button
          onClick={handlePrint}
          className="w-12 h-12 rounded-full bg-[var(--color-surface)] text-[var(--color-title)] shadow-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-background)] transition-colors"
          title="Print / Save as PDF"
        >
          <DownloadSimple weight="bold" className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="content-padding py-10 print:p-0">
        <div className="max-w-5xl mx-auto print:max-w-none">
          {/* Title Strip */}
          <div style={{ backgroundColor: '#0a0b0d', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <h1 style={{ color: '#e6e8ea', marginBottom: '0.5rem' }}>Airtightness Report</h1>
            <p style={{ color: '#77787a' }}>ISO 9972:2015 & Passive House Requirements</p>
          </div>

          {/* Report Sections */}
          <div className="space-y-6 print:space-y-3">
            <Card>
              <GeneralInformation />
            </Card>

            <Card>
              <BuildingConditions />
            </Card>

            <Card>
              <VolumeCalculation />
            </Card>

            <Card>
              <BuildingPreparation />
            </Card>

            <Card>
              <LeakageIdentification />
            </Card>

            <Card>
              <MeasurementData />
            </Card>

            <Card>
              <Charts />
            </Card>

            <Card variant="dark">
              <Results />
            </Card>
          </div>
        </div>
      </main>

      {/* Saved Reports Sidebar */}
      <SavedReports isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Print Styles */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 10pt;
          }
          .fixed { display: none !important; }
          .content-padding { padding: 0 !important; }
          .collapse-content.collapsed {
            grid-template-rows: 1fr !important;
            opacity: 1 !important;
          }
          .space-y-6 > * + * { margin-top: 0.75rem !important; }
          h1 { font-size: 24pt !important; }
          h3 { font-size: 12pt !important; }
          h4 { font-size: 11pt !important; }
          p, td, th, input, select, textarea, label, span { font-size: 9pt !important; }
        }
      `}</style>
    </>
  );
}
