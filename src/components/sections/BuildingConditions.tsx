'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input } from '@/components/ui';

export default function BuildingConditions() {
  const { buildingConditions, updateBuildingConditions } = useReportStore();

  return (
    <Section title="Conditions" sectionNumber={2}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Envelope Area (Aₑ)"
          type="number"
          step="0.01"
          unit="m²"
          value={buildingConditions.envelopeArea || ''}
          onChange={(e) =>
            updateBuildingConditions({ envelopeArea: parseFloat(e.target.value) || 0 })
          }
        />
        <Input
          label="Floor Area (Aբ)"
          type="number"
          step="0.01"
          unit="m²"
          value={buildingConditions.floorArea || ''}
          onChange={(e) =>
            updateBuildingConditions({ floorArea: parseFloat(e.target.value) || 0 })
          }
        />
        <Input
          label="Internal Temp."
          type="number"
          step="0.1"
          unit="°C"
          value={buildingConditions.internalTemp || ''}
          onChange={(e) =>
            updateBuildingConditions({ internalTemp: parseFloat(e.target.value) || 0 })
          }
        />
        <Input
          label="External Temp."
          type="number"
          step="0.1"
          unit="°C"
          value={buildingConditions.externalTemp || ''}
          onChange={(e) =>
            updateBuildingConditions({ externalTemp: parseFloat(e.target.value) || 0 })
          }
        />
      </div>
    </Section>
  );
}
