'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Textarea, ImageUpload } from '@/components/ui';

const WATER_PIPE_PATTERN = /water|pipe|plumb|apă|apa|ţeavă|teava|conductă|conducta/i;

export default function BuildingPreparation() {
  const {
    sealItems,
    addSealItem,
    removeSealItem,
    updateSealItem,
  } = useReportStore();

  return (
    <Section
      title="Preparation"
      sectionNumber={5}
      onAdd={addSealItem}
      onRemove={sealItems.length > 0 ? removeSealItem : undefined}
    >
      {sealItems.length === 0 ? (
        <p className="text-[var(--color-muted)] py-8 text-center">
          No temporary seals documented. Click + to add.
        </p>
      ) : (
        <div className="space-y-4">
          {sealItems.map((item, index) => {
            const missingPhoto = !item.imageData;
            const waterPipeFlag = WATER_PIPE_PATTERN.test(item.description);
            return (
              <div key={item.id} className="border border-[var(--color-border)] p-4">
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
                  {waterPipeFlag && (
                    <p className="text-xs text-[var(--color-error)]">
                      Water/plumbing pipes are normally not sealed for the final
                      acceptance test under SR EN ISO 9972:2016. Confirm this seal
                      is appropriate before submitting.
                    </p>
                  )}
                  <ImageUpload
                    imageData={item.imageData}
                    onImageChange={(data) =>
                      updateSealItem(item.id, { imageData: data })
                    }
                  />
                  {missingPhoto && (
                    <p className="text-xs text-[var(--color-error)]">
                      Photo required — every temporary seal must be documented
                      with a photo for traceability.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
