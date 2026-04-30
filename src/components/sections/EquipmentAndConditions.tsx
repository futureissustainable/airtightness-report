'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Input, Select } from '@/components/ui';

const WIND_SOURCE_OPTIONS = [
  { value: '', label: 'Select source…' },
  { value: 'anemometer', label: 'On-site anemometer' },
  { value: 'met_station', label: 'Nearest meteorological station' },
  { value: 'beaufort', label: 'Beaufort observation' },
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
    equipmentInfo.calibrationValidUntil &&
    generalInfo.testDate &&
    equipmentInfo.calibrationValidUntil < generalInfo.testDate;

  return (
    <Section title="Equipment & Test Conditions" sectionNumber={2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Calibration date"
          type="date"
          value={equipmentInfo.calibrationDate}
          onChange={(e) =>
            updateEquipmentInfo({ calibrationDate: e.target.value })
          }
        />
        <Input
          label="Calibration valid until"
          type="date"
          value={equipmentInfo.calibrationValidUntil}
          onChange={(e) =>
            updateEquipmentInfo({ calibrationValidUntil: e.target.value })
          }
          error={calibrationExpired ? 'Calibration expired before test date' : undefined}
        />
      </div>

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
    </Section>
  );
}
