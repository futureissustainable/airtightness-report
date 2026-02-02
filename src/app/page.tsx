'use client';

import { useState } from 'react';
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
  Wind,
  Folder,
  Printer,
  Info,
} from '@phosphor-icons/react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="content-padding">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-title)] flex items-center justify-center">
                <Wind weight="bold" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="leading-tight">Air Tightness Test</h4>
                <p className="text-xs text-[var(--color-muted)]">ISO 9972:2015 Report</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="hidden sm:flex"
              >
                <Printer weight="bold" className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Folder weight="bold" className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Saved Reports</span>
                <span className="sm:hidden">Reports</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-padding py-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="mb-4">Air Tightness Test Report</h1>
            <p className="text-lg max-w-2xl mx-auto">
              In accordance with ISO 9972:2015 & Passive House Requirements
            </p>
          </div>

          {/* Info Banner */}
          <Card className="mb-10 bg-[var(--color-surface)] border-none">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Info weight="fill" className="w-5 h-5 text-[var(--color-title)]" />
              </div>
              <div>
                <h4 className="mb-1">Automated Calculations</h4>
                <p className="text-sm">
                  This report automatically calculates volumes, flow rates, and compliance status based on your inputs.
                  All data is saved locally in your browser - no account required. Use the &quot;Saved Reports&quot; button to manage your reports.
                </p>
              </div>
            </div>
          </Card>

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
              <Results />
            </Card>

            <Card>
              <Charts />
            </Card>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Air Tightness Test Report Generator
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              ISO 9972:2015 Compliant • Passive House Standard
            </p>
          </footer>
        </div>
      </main>

      {/* Saved Reports Sidebar */}
      <SavedReports isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header,
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .content-padding {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </>
  );
}
