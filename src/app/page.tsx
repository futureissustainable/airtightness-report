'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: 'airtightness-report.pdf',
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: false,
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
      {/* Scroll Progress Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-border)] z-50">
        <div
          className="h-full bg-[var(--color-title)] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-full bg-[var(--color-title)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--color-paragraph)] transition-colors"
          title="Saved Reports"
        >
          <Folder weight="bold" className="w-5 h-5" />
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-12 h-12 rounded-full bg-[var(--color-surface)] text-[var(--color-title)] shadow-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-background)] transition-colors disabled:opacity-50"
          title={isGeneratingPdf ? 'Generating...' : 'Download PDF'}
        >
          <DownloadSimple weight="bold" className={`w-5 h-5 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <main className="content-padding py-10">
        <div ref={reportRef} className="max-w-5xl mx-auto">
          {/* Title Strip */}
          <div className="bg-[#0a0b0d] p-8 mb-6 text-center">
            <h1 style={{ color: '#e6e8ea' }} className="mb-2">Airtightness Report</h1>
            <p style={{ color: '#77787a' }}>ISO 9972:2015 & Passive House Requirements</p>
          </div>

          {/* Report Sections */}
          <div className="space-y-6">
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
          .fixed { display: none !important; }
          .content-padding { padding: 1rem; }
          .collapse-content.collapsed {
            grid-template-rows: 1fr !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  );
}
