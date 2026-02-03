'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Select } from '@/components/ui';
import React from 'react';

export default function BuildingConditions() {
  const {
    buildingConditions,
    updateBuildingConditions,
    volumeRows,
    addVolumeRow,
    removeVolumeRow,
    updateVolumeRow,
    pasteVolumeRows,
    pasteColumnData,
    getCalculatedResults,
  } = useReportStore();

  const { totalVolume } = getCalculatedResults();

  const calcMethodOptions = [
    { value: 'l_w', label: 'L × W' },
    { value: 'area', label: 'Area' },
  ];

  // Handle paste in any input - if multi-line, fill down the column (creates rows if needed)
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    rowIndex: number,
    field: 'name' | 'length' | 'width' | 'area' | 'height'
  ) => {
    const text = e.clipboardData.getData('text');

    // Check if it's multi-row paste (has newlines or tabs)
    if (text.includes('\n') || text.includes('\t')) {
      e.preventDefault();

      const lines = text.trim().split(/\r?\n/);

      // If pasting into name field with tabs, treat as full row data
      if (field === 'name' && text.includes('\t')) {
        const count = pasteVolumeRows(text);
        if (count > 0) return;
      }

      // Extract values (take first cell if tabs present)
      const values = lines.map((line) => line.split('\t')[0].trim());

      // Use batch update function - safe, creates rows as needed, max 500
      pasteColumnData(field, rowIndex, values);
    }
  };

  return (
    <Section
      title="Conditions"
      sectionNumber={2}
      onAdd={addVolumeRow}
      onRemove={volumeRows.length > 1 ? removeVolumeRow : undefined}
    >
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

      {/* Volume Calculation Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)]">Space</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">Method</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">L (m)</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">W (m)</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">Area (m²)</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">H (m)</th>
              <th className="text-right py-2 px-3 font-medium text-[var(--color-paragraph)] w-24">Volume</th>
            </tr>
          </thead>
          <tbody>
            {volumeRows.map((row, index) => (
              <tr key={row.id} className="border-b border-[var(--color-border-light)]">
                <td className="py-1.5 px-2">
                  <Input
                    placeholder="Room name"
                    value={row.name}
                    onChange={(e) => updateVolumeRow(row.id, { name: e.target.value })}
                    onPaste={(e) => handlePaste(e, index, 'name')}
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
                      onPaste={(e) => handlePaste(e, index, 'length')}
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
                      onPaste={(e) => handlePaste(e, index, 'width')}
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
                      onPaste={(e) => handlePaste(e, index, 'area')}
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
                    onPaste={(e) => handlePaste(e, index, 'height')}
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

      {/* Total Volume */}
      <div className="flex justify-end mt-4 pt-3 border-t border-[var(--color-border)]">
        <div>
          <span className="text-sm text-[var(--color-muted)] mr-2">Total Volume:</span>
          <span className="font-mono font-medium text-[var(--color-title)]">
            {totalVolume.toFixed(2)} m³
          </span>
        </div>
      </div>
    </Section>
  );
}
