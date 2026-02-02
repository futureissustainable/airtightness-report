'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input } from '@/components/ui';
import { Check, X } from '@phosphor-icons/react';

export default function Results() {
  const { results, updateResults, getCalculatedResults } = useReportStore();
  const calculated = getCalculatedResults();
  const complianceStatus = calculated.isPassing;

  return (
    <Section title="Results" sectionNumber={6}>
      {/* Test Results Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          label="Required Target (n₅₀)"
          type="number"
          step="0.01"
          unit="h⁻¹"
          value={results.requiredN50 || ''}
          onChange={(e) =>
            updateResults({ requiredN50: parseFloat(e.target.value) || 0 })
          }
        />
        <Input
          label="Depressurization (n₅₀)"
          type="number"
          step="0.01"
          unit="h⁻¹"
          value={results.depN50 || ''}
          onChange={(e) =>
            updateResults({ depN50: parseFloat(e.target.value) || 0 })
          }
        />
        <Input
          label="Pressurization (n₅₀)"
          type="number"
          step="0.01"
          unit="h⁻¹"
          value={results.preN50 || ''}
          onChange={(e) =>
            updateResults({ preN50: parseFloat(e.target.value) || 0 })
          }
        />
      </div>

      {/* Results Summary Table */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface)]">
              <th className="py-2 px-4 text-left font-medium text-[var(--color-paragraph)]">Result</th>
              <th className="py-2 px-4 text-center font-medium text-[var(--color-paragraph)]">Dep.</th>
              <th className="py-2 px-4 text-center font-medium text-[var(--color-paragraph)]">Pres.</th>
              <th className="py-2 px-4 text-center font-medium text-[var(--color-title)] bg-[var(--color-title)]/5">Avg</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--color-border-light)]">
              <td className="py-3 px-4 text-[var(--color-paragraph)]">n₅₀ (h⁻¹)</td>
              <td className="py-3 px-4 text-center font-mono">{results.depN50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono">{results.preN50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono font-medium text-lg bg-[var(--color-title)]/5">
                {calculated.avgN50.toFixed(2)}
              </td>
            </tr>
            <tr className="border-t border-[var(--color-border-light)]">
              <td className="py-3 px-4 text-[var(--color-paragraph)]">V₅₀ (m³/h)</td>
              <td className="py-3 px-4 text-center font-mono">{calculated.depV50.toFixed(1)}</td>
              <td className="py-3 px-4 text-center font-mono">{calculated.preV50.toFixed(1)}</td>
              <td className="py-3 px-4 text-center font-mono bg-[var(--color-title)]/5">{calculated.avgV50.toFixed(1)}</td>
            </tr>
            <tr className="border-t border-[var(--color-border-light)]">
              <td className="py-3 px-4 text-[var(--color-paragraph)]">qE₅₀ (m³/h·m²)</td>
              <td className="py-3 px-4 text-center font-mono">{calculated.depQe50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono">{calculated.preQe50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono bg-[var(--color-title)]/5">{calculated.avgQe50.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Compliance */}
      <div className={`rounded-lg p-6 text-center ${
        complianceStatus === true
          ? 'bg-green-50 border border-green-200'
          : complianceStatus === false
          ? 'bg-red-50 border border-red-200'
          : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
      }`}>
        <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide mb-1">
          Final Average n₅₀
        </p>
        <p className="text-3xl font-medium text-[var(--color-title)] mb-4">
          {calculated.avgN50.toFixed(2)} h⁻¹
        </p>

        {complianceStatus === true && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
            <Check weight="bold" className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              PASS — n₅₀ ≤ {results.requiredN50.toFixed(2)}
            </span>
          </div>
        )}

        {complianceStatus === false && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
            <X weight="bold" className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              FAIL — n₅₀ &gt; {results.requiredN50.toFixed(2)}
            </span>
          </div>
        )}

        {complianceStatus === null && (
          <p className="text-sm text-[var(--color-muted)]">
            Enter results to determine compliance
          </p>
        )}
      </div>
    </Section>
  );
}
