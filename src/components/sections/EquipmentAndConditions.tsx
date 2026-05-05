'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Select, ImageUpload } from '@/components/ui';

const WIND_SOURCE_OPTIONS = [
  { value: '', label: 'Select source…' },
  { value: 'anemometer', label: 'On-site anemometer' },
  { value: 'met_station', label: 'Nearest meteorological station' },
  { value: 'beaufort', label: 'Beaufort observation' },
];

const TEST_METHOD_OPTIONS = [
  { value: '', label: 'Select method…' },
  { value: '1', label: 'Method 1: Test of the building in use' },
  { value: '2', label: 'Method 2: Test of the building envelope' },
  { value: '3', label: 'Method 3: Test for a specific purpose (e.g., Passivhaus)' },
];

const CALIBRATION_VALIDITY_OPTIONS = [
  { value: 'date', label: 'Specify date' },
  { value: 'within_interval', label: "Within RETROTEC's official recommended calibration interval." },
];

export default function EquipmentAndConditions() {
  const {
    equipmentInfo,
    updateEquipmentInfo,
    testConditions,
    updateTestConditions,
    generalInfo,
  } = useReportStore();

  const calibrationExpired =
    !equipmentInfo.calibrationHidden &&
    !equipmentInfo.calibrationNotApplicable &&
    equipmentInfo.calibrationValidUntil &&
    generalInfo.testDate &&
    equipmentInfo.calibrationValidUntil < generalInfo.testDate;

  return (
    <Section title="Equipment & Test Conditions" sectionNumber={2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Testing company"
          placeholder="e.g., Acme Airtightness Ltd."
          value={equipmentInfo.companyName}
          onChange={(e) => updateEquipmentInfo({ companyName: e.target.value })}
        />
        <Select
          label="Test method (ISO 9972)"
          options={TEST_METHOD_OPTIONS}
          value={equipmentInfo.testMethod}
          onChange={(e) =>
            updateEquipmentInfo({
              testMethod: e.target.value as typeof equipmentInfo.testMethod,
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Equipment manufacturer"
          placeholder="e.g., Retrotec, Minneapolis"
          value={equipmentInfo.manufacturer}
          onChange={(e) => updateEquipmentInfo({ manufacturer: e.target.value })}
        />
        <Input
          label="Equipment model"
          placeholder="e.g., DM32 / Model 6"
          value={equipmentInfo.model}
          onChange={(e) => updateEquipmentInfo({ model: e.target.value })}
        />
      </div>

      {equipmentInfo.calibrationHidden ? (
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <button
            type="button"
            onClick={() => updateEquipmentInfo({ calibrationHidden: false })}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-title)] transition-colors"
          >
            + Add fan calibration
          </button>
        </div>
      ) : (
        <div className="border border-[var(--color-border)] mt-6">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <h4 className="text-sm font-medium text-[var(--color-title)]">
              Fan calibration
            </h4>
            <button
              type="button"
              onClick={() => updateEquipmentInfo({ calibrationHidden: true })}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-title)] transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Input
              label="Fan calibration date"
              type="date"
              value={equipmentInfo.calibrationDate}
              onChange={(e) =>
                updateEquipmentInfo({ calibrationDate: e.target.value })
              }
            />
            <div className="flex flex-col gap-1.5 w-full">
              <Select
                label="Fan calibration valid until"
                options={CALIBRATION_VALIDITY_OPTIONS}
                value={equipmentInfo.calibrationNotApplicable ? 'within_interval' : 'date'}
                onChange={(e) =>
                  updateEquipmentInfo({
                    calibrationNotApplicable: e.target.value === 'within_interval',
                  })
                }
              />
              {!equipmentInfo.calibrationNotApplicable && (
                <Input
                  type="date"
                  value={equipmentInfo.calibrationValidUntil}
                  onChange={(e) =>
                    updateEquipmentInfo({ calibrationValidUntil: e.target.value })
                  }
                  error={calibrationExpired ? 'Calibration expired before test date' : undefined}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Wind speed during test"
          type="number"
          step="0.1"
          unit="m/s"
          value={testConditions.windSpeed || ''}
          onChange={(e) =>
            updateTestConditions({ windSpeed: parseFloat(e.target.value) || 0 })
          }
        />
        <Select
          label="Wind speed source"
          options={WIND_SOURCE_OPTIONS}
          value={testConditions.windSpeedSource}
          onChange={(e) =>
            updateTestConditions({ windSpeedSource: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-sm font-medium text-[var(--color-title)] mb-1.5">
            Blower door installed in opening
          </p>
          <ImageUpload
            imageData={equipmentInfo.blowerDoorPhoto}
            onImageChange={(data) =>
              updateEquipmentInfo({ blowerDoorPhoto: data })
            }
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-title)] mb-1.5">
            Sketch of blower door position
          </p>
          <ImageUpload
            imageData={equipmentInfo.blowerDoorSketch}
            onImageChange={(data) =>
              updateEquipmentInfo({ blowerDoorSketch: data })
            }
          />
        </div>
      </div>
    </Section>
  );
}
