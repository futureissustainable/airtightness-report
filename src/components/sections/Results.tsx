'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input } from '@/components/ui';
import { Check, X } from '@phosphor-icons/react';

export default function Results() {
  const { results, updateResults, getCalculatedResults } = useReportStore();
  const calculated = getCalculatedResults();
  const complianceStatus = calculated.isPassing;

  return (
    <Section title="Results" sectionNumber={7} dark>
      {/* Test Results Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
      <div className="rounded-lg overflow-hidden mb-8 border border-[var(--color-dark-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-dark-border)]">
              <th className="py-3 px-4 text-left font-medium text-[var(--color-dark-paragraph)]">Result</th>
              <th className="py-3 px-4 text-center font-medium text-[var(--color-dark-paragraph)]">Dep.</th>
              <th className="py-3 px-4 text-center font-medium text-[var(--color-dark-paragraph)]">Pres.</th>
              <th className="py-3 px-4 text-center font-medium text-[var(--color-dark-title)]">Average</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--color-dark-border)]">
              <td className="py-3 px-4 text-[var(--color-dark-paragraph)]">n₅₀ (h⁻¹)</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{results.depN50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{results.preN50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono font-medium text-lg text-[var(--color-dark-title)]">
                {calculated.avgN50.toFixed(2)}
              </td>
            </tr>
            <tr className="border-t border-[var(--color-dark-border)]">
              <td className="py-3 px-4 text-[var(--color-dark-paragraph)]">V₅₀ (m³/h)</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.depV50.toFixed(1)}</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.preV50.toFixed(1)}</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.avgV50.toFixed(1)}</td>
            </tr>
            <tr className="border-t border-[var(--color-dark-border)]">
              <td className="py-3 px-4 text-[var(--color-dark-paragraph)]">qE₅₀ (m³/h·m²)</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.depQe50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.preQe50.toFixed(2)}</td>
              <td className="py-3 px-4 text-center font-mono text-[var(--color-dark-title)]">{calculated.avgQe50.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Compliance */}
      <div className={`rounded-xl p-8 text-center ${
        complianceStatus === true
          ? 'bg-green-500/10 border border-green-500/30'
          : complianceStatus === false
          ? 'bg-red-500/10 border border-red-500/30'
          : 'bg-[var(--color-dark-border)] border border-[var(--color-dark-border)]'
      }`}>
        <p className="text-xs text-[var(--color-dark-paragraph)] uppercase tracking-wider mb-2">
          Final Average n₅₀
        </p>
        <p className="text-4xl font-medium text-[var(--color-dark-title)] mb-6">
          {calculated.avgN50.toFixed(2)} h⁻¹
        </p>

        {complianceStatus === true && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/20 rounded-full">
            <Check weight="bold" className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              PASS — n₅₀ ≤ {results.requiredN50.toFixed(2)}
            </span>
          </div>
        )}

        {complianceStatus === false && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/20 rounded-full">
            <X weight="bold" className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">
              FAIL — n₅₀ &gt; {results.requiredN50.toFixed(2)}
            </span>
          </div>
        )}

        {complianceStatus === null && (
          <p className="text-sm text-[var(--color-dark-paragraph)]">
            Enter results to determine compliance
          </p>
        )}
      </div>
    </Section>
  );
}
