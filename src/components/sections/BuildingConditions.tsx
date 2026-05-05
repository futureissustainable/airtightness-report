'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input } from '@/components/ui';

export default function BuildingConditions() {
  const { buildingConditions, updateBuildingConditions } = useReportStore();

  return (
    <Section title="Conditions" sectionNumber={3}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {buildingConditions.envelopeHidden ? (
        <div className="flex items-center gap-3 mt-6 print:hidden">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <button
            type="button"
            onClick={() => updateBuildingConditions({ envelopeHidden: false })}
            className="text-[10px] uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-title)] transition-colors"
            title="Show envelope area (editor only)"
          >
            Show envelope area
          </button>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
      ) : (
        <div className="border border-[var(--color-border)] mt-6">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <h4 className="text-sm font-medium text-[var(--color-title)]">
              Envelope area
            </h4>
            <button
              type="button"
              onClick={() => updateBuildingConditions({ envelopeHidden: true })}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-title)] transition-colors print:hidden"
            >
              Hide
            </button>
          </div>

          <div className="p-4">
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
          </div>
        </div>
      )}
    </Section>
  );
}
