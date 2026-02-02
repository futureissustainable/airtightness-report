'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Card } from '@/components/ui';
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react';

export default function Results() {
  const { results, updateResults, getCalculatedResults, buildingConditions } = useReportStore();
  const calculated = getCalculatedResults();

  const complianceStatus = calculated.isPassing;

  return (
    <Section title="Results" sectionNumber={6}>
      {/* Required Target */}
      <div className="mb-8">
        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-xl">
          <div className="flex-1">
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
          </div>
          <p className="flex-1 text-sm text-[var(--color-paragraph)]">
            Standard value for Passive House: 0.60 h⁻¹. Adjust based on your requirements.
          </p>
        </div>
      </div>

      {/* Input Results */}
      <Card className="mb-8">
        <h4 className="mb-6">Test Results Input</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
            <p className="text-sm font-medium text-[var(--color-title)] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[var(--color-error)] text-white text-xs flex items-center justify-center">−</span>
              Depressurization
            </p>
            <Input
              label="Air Change Rate @ 50 Pa (n₅₀)"
              type="number"
              step="0.01"
              unit="h⁻¹"
              value={results.depN50 || ''}
              onChange={(e) =>
                updateResults({ depN50: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-[var(--color-title)] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-500 text-white text-xs flex items-center justify-center">+</span>
              Pressurization
            </p>
            <Input
              label="Air Change Rate @ 50 Pa (n₅₀)"
              type="number"
              step="0.01"
              unit="h⁻¹"
              value={results.preN50 || ''}
              onChange={(e) =>
                updateResults({ preN50: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </Card>

      {/* Calculated Results Summary */}
      <Card className="mb-8" padding="none">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h4>Calculated Results Summary</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)]">
                <th className="py-3 px-4 text-left font-medium text-[var(--color-title)]">Result</th>
                <th className="py-3 px-4 text-center font-medium text-[var(--color-title)]">Depressurization</th>
                <th className="py-3 px-4 text-center font-medium text-[var(--color-title)]">Pressurization</th>
                <th className="py-3 px-4 text-center font-medium text-[var(--color-title)] bg-[var(--color-title)]/5">Average</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="py-4 px-4 text-[var(--color-paragraph)]">
                  Air Change Rate @ 50 Pa (n₅₀)
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {results.depN50.toFixed(2)} h⁻¹
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {results.preN50.toFixed(2)} h⁻¹
                </td>
                <td className="py-4 px-4 text-center font-mono font-semibold text-lg text-[var(--color-title)] bg-[var(--color-title)]/5">
                  {calculated.avgN50.toFixed(2)} h⁻¹
                </td>
              </tr>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="py-4 px-4 text-[var(--color-paragraph)]">
                  Air Flow Rate @ 50 Pa (V₅₀)
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {calculated.depV50.toFixed(1)} m³/h
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {calculated.preV50.toFixed(1)} m³/h
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)] bg-[var(--color-title)]/5">
                  {calculated.avgV50.toFixed(1)} m³/h
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-[var(--color-paragraph)]">
                  Specific Leakage (Envelope) qE₅₀
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {calculated.depQe50.toFixed(2)} m³/(h·m²)
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)]">
                  {calculated.preQe50.toFixed(2)} m³/(h·m²)
                </td>
                <td className="py-4 px-4 text-center font-mono text-[var(--color-title)] bg-[var(--color-title)]/5">
                  {calculated.avgQe50.toFixed(2)} m³/(h·m²)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Declaration of Conformity */}
      <Card
        className={`text-center ${
          complianceStatus === true
            ? 'bg-[var(--color-success-light)] border-[var(--color-success)]'
            : complianceStatus === false
            ? 'bg-[var(--color-error-light)] border-[var(--color-error)]'
            : 'bg-[var(--color-surface)] border-[var(--color-border)]'
        }`}
      >
        <p className="text-sm text-[var(--color-paragraph)] mb-2">
          Declaration of Conformity
        </p>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Final Average Air Change Rate (n₅₀)
        </p>
        <p className="text-4xl font-semibold text-[var(--color-title)] mb-6">
          {calculated.avgN50.toFixed(2)} h⁻¹
        </p>

        {complianceStatus === true && (
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/50 rounded-xl">
            <CheckCircle weight="fill" className="w-8 h-8 text-[var(--color-success)]" />
            <div className="text-left">
              <p className="font-semibold text-[var(--color-success)]">PASS</p>
              <p className="text-sm text-[var(--color-paragraph)]">
                Meets the requirement of n₅₀ ≤ {results.requiredN50.toFixed(2)} h⁻¹
              </p>
            </div>
          </div>
        )}

        {complianceStatus === false && (
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/50 rounded-xl">
            <XCircle weight="fill" className="w-8 h-8 text-[var(--color-error)]" />
            <div className="text-left">
              <p className="font-semibold text-[var(--color-error)]">FAIL</p>
              <p className="text-sm text-[var(--color-paragraph)]">
                Does not meet the requirement of n₅₀ ≤ {results.requiredN50.toFixed(2)} h⁻¹
              </p>
            </div>
          </div>
        )}

        {complianceStatus === null && (
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/50 rounded-xl">
            <Clock weight="fill" className="w-8 h-8 text-[var(--color-muted)]" />
            <div className="text-left">
              <p className="font-semibold text-[var(--color-muted)]">Awaiting Results</p>
              <p className="text-sm text-[var(--color-paragraph)]">
                Enter test results to determine compliance
              </p>
            </div>
          </div>
        )}
      </Card>
    </Section>
  );
}
