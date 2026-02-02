'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Textarea, ImageUpload } from '@/components/ui';

export default function LeakageIdentification() {
  const {
    leakageItems,
    addLeakageItem,
    removeLeakageItem,
    updateLeakageItem,
  } = useReportStore();

  return (
    <Section
      title="Leakage"
      sectionNumber={4}
      onAdd={addLeakageItem}
      onRemove={leakageItems.length > 0 ? removeLeakageItem : undefined}
    >
      {leakageItems.length === 0 ? (
        <p className="text-[var(--color-muted)] py-8 text-center">
          No leakage points identified. Click + to add.
        </p>
      ) : (
        <div className="space-y-4">
          {leakageItems.map((item, index) => (
            <div key={item.id} className="border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted)] mb-3">Leakage #{index + 1}</p>
              <div className="space-y-3">
                <Textarea
                  label="Description"
                  placeholder="Location and description of air leakage"
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateLeakageItem(item.id, { description: e.target.value })
                  }
                />
                <Textarea
                  label="Remedial Solution"
                  placeholder="Recommended fix"
                  rows={2}
                  value={item.solution}
                  onChange={(e) =>
                    updateLeakageItem(item.id, { solution: e.target.value })
                  }
                />
                <div>
                  <label className="text-sm font-medium text-[var(--color-title)] block mb-2">
                    Photo
                  </label>
                  <ImageUpload
                    imageData={item.imageData}
                    onImageChange={(data) =>
                      updateLeakageItem(item.id, { imageData: data })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
