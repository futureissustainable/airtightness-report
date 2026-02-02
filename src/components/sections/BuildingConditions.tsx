'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Select } from '@/components/ui';

export default function BuildingConditions() {
  const {
    buildingConditions,
    updateBuildingConditions,
    volumeRows,
    addVolumeRow,
    removeVolumeRow,
    updateVolumeRow,
    getCalculatedResults,
  } = useReportStore();

  const { totalVolume } = getCalculatedResults();

  const calcMethodOptions = [
    { value: 'l_w', label: 'L × W' },
    { value: 'area', label: 'Area' },
  ];

  return (
    <Section title="Building & Test Conditions" sectionNumber={2}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Volume Calculation */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <h4>Internal Volume Calculation</h4>
          <div className="text-right">
            <span className="text-sm text-[var(--color-muted)] mr-2">Total:</span>
            <span className="font-mono font-medium text-[var(--color-title)]">
              {totalVolume.toFixed(2)} m³
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">Space/Room</th>
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">Method</th>
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">L (m)</th>
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">W (m)</th>
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">Area (m²)</th>
                <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">H (m)</th>
                <th className="text-right py-2 px-3 font-medium text-[var(--color-paragraph)]">Volume</th>
              </tr>
            </thead>
            <tbody>
              {volumeRows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--color-border-light)]">
                  <td className="py-1.5 px-2">
                    <Input
                      placeholder="Room name"
                      value={row.name}
                      onChange={(e) => updateVolumeRow(row.id, { name: e.target.value })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Select
                      options={calcMethodOptions}
                      value={row.method}
                      onChange={(e) =>
                        updateVolumeRow(row.id, { method: e.target.value as 'l_w' | 'area' })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    {row.method === 'l_w' ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={row.length || ''}
                        onChange={(e) =>
                          updateVolumeRow(row.id, { length: parseFloat(e.target.value) || 0 })
                        }
                        className="!py-1.5"
                      />
                    ) : (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2">
                    {row.method === 'l_w' ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={row.width || ''}
                        onChange={(e) =>
                          updateVolumeRow(row.id, { width: parseFloat(e.target.value) || 0 })
                        }
                        className="!py-1.5"
                      />
                    ) : (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2">
                    {row.method === 'area' ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={row.area || ''}
                        onChange={(e) =>
                          updateVolumeRow(row.id, { area: parseFloat(e.target.value) || 0 })
                        }
                        className="!py-1.5"
                      />
                    ) : (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.height || ''}
                      onChange={(e) =>
                        updateVolumeRow(row.id, { height: parseFloat(e.target.value) || 0 })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono text-[var(--color-title)]">
                    {row.subVolume.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-2 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <button
            onClick={removeVolumeRow}
            disabled={volumeRows.length <= 1}
            className="px-3 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-error)] disabled:opacity-40 transition-colors"
          >
            Remove
          </button>
          <button
            onClick={addVolumeRow}
            className="px-3 py-1 text-sm text-[var(--color-title)] hover:text-[var(--color-muted)] transition-colors"
          >
            Add Row
          </button>
        </div>
      </div>
    </Section>
  );
}
