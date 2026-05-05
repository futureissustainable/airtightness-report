'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, ImageUpload } from '@/components/ui';

export default function GeneralInformation() {
  const { generalInfo, updateGeneralInfo } = useReportStore();

  return (
    <Section title="Info" sectionNumber={1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Project Name"
          placeholder="Enter project name"
          value={generalInfo.projectName}
          onChange={(e) => updateGeneralInfo({ projectName: e.target.value })}
        />
        <Input
          label="Report Number"
          placeholder="e.g., 2025-001"
          value={generalInfo.reportNumber}
          onChange={(e) => updateGeneralInfo({ reportNumber: e.target.value })}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Project Address"
          placeholder="Full Address, City, Postal Code, Country"
          value={generalInfo.projectAddress}
          onChange={(e) => updateGeneralInfo({ projectAddress: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Input
          label="Tester full name"
          placeholder="Full name of the tester performing the measurement"
          value={generalInfo.technicianName}
          onChange={(e) => updateGeneralInfo({ technicianName: e.target.value })}
        />
        <Input
          label="Test Date"
          type="date"
          value={generalInfo.testDate}
          onChange={(e) => updateGeneralInfo({ testDate: e.target.value })}
        />
        <Input
          label="Software"
          placeholder="e.g., FanTestic 5.15"
          value={generalInfo.softwareVersion}
          onChange={(e) => updateGeneralInfo({ softwareVersion: e.target.value })}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-[var(--color-title)] mb-1.5 block">
          Tester signature
        </label>
        <ImageUpload
          imageData={generalInfo.testerSignatureImage}
          onImageChange={(data) => updateGeneralInfo({ testerSignatureImage: data })}
        />
        {!generalInfo.testerSignatureImage && (
          <p className="text-xs text-[var(--color-error)] mt-1.5">
            Required by SR EN ISO 9972:2016. Upload a scanned or photographed signature.
          </p>
        )}
      </div>
    </Section>
  );
}
