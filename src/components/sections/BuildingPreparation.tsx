'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Textarea, ImageUpload, Card } from '@/components/ui';
import { SealCheck, Trash } from '@phosphor-icons/react';

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
      addLabel="Add Seal"
      removeLabel="Remove"
    >
      <p className="text-sm text-[var(--color-paragraph)] mb-6">
        Document all temporary sealing measures applied for the test. This includes ventilation ducts,
        intentional openings, and any penetrations that were sealed.
      </p>

      {sealItems.length === 0 ? (
        <Card className="bg-[var(--color-surface)] text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
            <SealCheck weight="light" className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <p className="text-[var(--color-muted)]">
            No temporary seals documented yet.
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Click &quot;Add Seal&quot; to document a temporary seal.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sealItems.map((item, index) => (
            <Card key={item.id} className="relative group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-sm font-medium text-[var(--color-title)]">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Description of seal (e.g., Ventilation supply/exhaust ducts sealed with polyethylene and tape)"
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
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
