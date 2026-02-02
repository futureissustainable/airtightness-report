'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input } from '@/components/ui';
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
    >
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)]">
                <th colSpan={3} className="py-2 px-3 text-center font-medium text-[var(--color-title)] border-b border-r border-[var(--color-border)]">
                  Depressurization (−)
                </th>
                <th colSpan={3} className="py-2 px-3 text-center font-medium text-[var(--color-title)] border-b border-[var(--color-border)]">
                  Pressurization (+)
                </th>
              </tr>
              <tr className="bg-[var(--color-surface)]">
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">Pa</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">ACH</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-r border-[var(--color-border)]">m³/h</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">Pa</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">ACH</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--color-paragraph)] border-b border-[var(--color-border)]">m³/h</th>
              </tr>
            </thead>
            <tbody>
              {rowsWithFlows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--color-border-light)]">
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      step="1"
                      value={row.depPressure || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          depPressure: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.depAch || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          depAch: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2 border-r border-[var(--color-border-light)] bg-[var(--color-surface)]/50">
                    <span className="font-mono text-[var(--color-title)]">
                      {row.depFlow.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      step="1"
                      value={row.prePressure || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          prePressure: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.preAch || ''}
                      onChange={(e) =>
                        updateMeasurementRow(row.id, {
                          preAch: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="!py-1.5"
                    />
                  </td>
                  <td className="py-1.5 px-2 bg-[var(--color-surface)]/50">
                    <span className="font-mono text-[var(--color-title)]">
                      {row.preFlow.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted)]">
            Flow = ACH × Volume ({totalVolume.toFixed(2)} m³)
          </p>
        </div>
      </div>
    </Section>
  );
}
