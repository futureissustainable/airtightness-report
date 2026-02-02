'use client';

import { useState, useRef } from 'react';
import { Button, Card } from '@/components/ui';
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'airtightness-report.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="content-padding">
          <div className="flex items-center justify-between h-14 max-w-6xl mx-auto">
            <h4>Air Tightness Report</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
              >
                <DownloadSimple weight="bold" className="w-4 h-4 mr-1.5" />
                {isGeneratingPdf ? 'Generating...' : 'PDF'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Folder weight="bold" className="w-4 h-4 mr-1.5" />
                Reports
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-padding py-8">
        <div ref={reportRef} className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="mb-2">Air Tightness Test Report</h1>
            <p>ISO 9972:2015 & Passive House Requirements</p>
          </div>

          {/* Report Sections */}
          <div className="space-y-8">
            <GeneralInformation />
            <BuildingConditions />
            <BuildingPreparation />
            <LeakageIdentification />
            <MeasurementData />
            <Results />
            <Charts />
          </div>
        </div>
      </main>

      {/* Saved Reports Sidebar */}
      <SavedReports isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header { display: none !important; }
          .content-padding { padding: 1rem; }
        }
      `}</style>
    </>
  );
}
