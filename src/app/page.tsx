'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import {
  GeneralInformation,
  BuildingConditions,
  BuildingPreparation,
  LeakageIdentification,
  MeasurementData,
  Results,
  Charts,
  SavedReports,
} from '@/components/sections';
import {
  Folder,
  DownloadSimple,
} from '@phosphor-icons/react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <>
      {/* Scroll Progress Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-border)] z-50 print:hidden">
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
          onClick={handlePrint}
          className="w-12 h-12 rounded-full bg-[var(--color-surface)] text-[var(--color-title)] shadow-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-background)] transition-colors"
          title="Print / Save as PDF"
        >
          <DownloadSimple weight="bold" className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="content-padding py-10 print:p-4">
        <div className="max-w-5xl mx-auto">
          {/* Title Strip */}
          <div className="bg-[var(--color-dark-bg)] p-8 mb-6 text-center">
            <h1 className="text-[var(--color-dark-title)] mb-2">Airtightness Report</h1>
            <p className="text-[var(--color-dark-paragraph)]">ISO 9972:2015 & Passive House Requirements</p>
          </div>

          {/* Report Sections */}
          <div className="space-y-6 print:space-y-4">
            <Card>
              <GeneralInformation />
            </Card>

            <Card>
              <BuildingConditions />
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
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .fixed { display: none !important; }
          .content-padding { padding: 1rem !important; }
          .collapse-content.collapsed {
            grid-template-rows: 1fr !important;
            opacity: 1 !important;
          }
          .space-y-6 > * + * { margin-top: 1rem !important; }
        }
      `}</style>
    </>
  );
}
