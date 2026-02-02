'use client';

import { useState, useRef, useEffect } from 'react';
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
      <header className="sticky top-0 z-30 bg-[var(--color-surface)]/95 backdrop-blur-sm">
        <div className="content-padding">
          <div className="flex items-center justify-between h-16 max-w-5xl mx-auto">
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
        {/* Scroll Progress Bar */}
        <div className="h-[2px] bg-[var(--color-border)]">
          <div
            className="h-full bg-[var(--color-title)] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="content-padding py-10">
        <div ref={reportRef} className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="mb-3">Air Tightness Test Report</h1>
            <p className="text-lg">ISO 9972:2015 & Passive House Requirements</p>
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

            <Card variant="dark">
              <Results />
            </Card>

            <Card>
              <Charts />
            </Card>
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
          .collapse-content.collapsed {
            grid-template-rows: 1fr !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  );
}
