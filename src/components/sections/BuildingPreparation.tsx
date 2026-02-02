'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Textarea, ImageUpload } from '@/components/ui';

export default function BuildingPreparation() {
  const {
    sealItems,
    addSealItem,
    removeSealItem,
    updateSealItem,
  } = useReportStore();

  return (
    <Section
      title="Building Preparation"
      sectionNumber={3}
      onAdd={addSealItem}
      onRemove={sealItems.length > 0 ? removeSealItem : undefined}
    >
      {sealItems.length === 0 ? (
        <p className="text-[var(--color-muted)] py-8 text-center">
          No temporary seals documented. Click + to add.
        </p>
      ) : (
        <div className="space-y-4">
          {sealItems.map((item, index) => (
            <div key={item.id} className="border border-[var(--color-border)] rounded-lg p-4">
              <p className="text-sm text-[var(--color-muted)] mb-3">Seal #{index + 1}</p>
              <div className="space-y-3">
                <Textarea
                  placeholder="Description of seal (e.g., Ventilation supply/exhaust ducts sealed)"
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateSealItem(item.id, { description: e.target.value })
                  }
                />
                <ImageUpload
                  imageData={item.imageData}
                  onImageChange={(data) =>
                    updateSealItem(item.id, { imageData: data })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
