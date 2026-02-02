'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Card } from '@/components/ui';
import { Table } from '@phosphor-icons/react';
import { useMemo } from 'react';

export default function MeasurementData() {
  const {
    measurementRows,
    addMeasurementRow,
    removeMeasurementRow,
    updateMeasurementRow,
    getCalculatedResults,
  } = useReportStore();

  const { totalVolume } = getCalculatedResults();

  // Calculate flows based on ACH and total volume
  const rowsWithFlows = useMemo(() => {
    return measurementRows.map((row) => ({
      ...row,
      depFlow: row.depAch * totalVolume,
      preFlow: row.preAch * totalVolume,
    }));
  }, [measurementRows, totalVolume]);

  return (
    <Section
      title="Measurement Data"
      sectionNumber={5}
      onAdd={addMeasurementRow}
      onRemove={measurementRows.length > 1 ? removeMeasurementRow : undefined}
      addLabel="Add Row"
      removeLabel="Remove"
    >
      <Card className="overflow-hidden" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)]">
                <th colSpan={3} className="py-3 px-4 text-center font-medium text-[var(--color-title)] border-b border-r border-[var(--color-border)]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded bg-[var(--color-error)] text-white text-xs flex items-center justify-center">−</span>
                    Depressurization Test
                  </div>
                </th>
                <th colSpan={3} className="py-3 px-4 text-center font-medium text-[var(--color-title)] border-b border-[var(--color-border)]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-500 text-white text-xs flex items-center justify-center">+</span>
                    Pressurization Test
                  </div>
                </th>
              </tr>
              <tr className="bg-[var(--color-surface)]">
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">
                  Pressure (Pa)
                </th>
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">
                  ACH (h⁻¹)
                </th>
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-r border-[var(--color-border)]">
                  Flow (m³/h)
                </th>
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">
                  Pressure (Pa)
                </th>
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">
                  ACH (h⁻¹)
                </th>
                <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">
                  Flow (m³/h)
                </th>
              </tr>
            </thead>
            <tbody>
              {rowsWithFlows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface)]/30'}>
                  <td className="py-2 px-3 border-b border-[var(--color-border-light)]">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--color-muted)]">−</span>
                      <Input
                        type="number"
                        step="1"
                        value={row.depPressure || ''}
                        onChange={(e) =>
                          updateMeasurementRow(row.id, {
                            depPressure: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="!py-1.5 !px-2 text-center"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 border-b border-[var(--color-border-light)]">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.depAch || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          depAch: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5 !px-2 text-center"
                    />
                  </td>
                  <td className="py-2 px-3 border-b border-r border-[var(--color-border-light)] bg-[var(--color-surface)]/50">
                    <span className="font-mono text-[var(--color-title)]">
                      {row.depFlow.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2 px-3 border-b border-[var(--color-border-light)]">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">+</span>
                      <Input
                        type="number"
                        step="1"
                        value={row.prePressure || ''}
                        onChange={(e) =>
                          updateMeasurementRow(row.id, {
                            prePressure: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="!py-1.5 !px-2 text-center"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 border-b border-[var(--color-border-light)]">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.preAch || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          preAch: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5 !px-2 text-center"
                    />
                  </td>
                  <td className="py-2 px-3 border-b border-[var(--color-border-light)] bg-[var(--color-surface)]/50">
                    <span className="font-mono text-[var(--color-title)]">
                      {row.preFlow.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted)]">
            Flow rate is automatically calculated: Flow = ACH × Total Volume ({totalVolume.toFixed(2)} m³)
          </p>
        </div>
      </Card>
    </Section>
  );
}
