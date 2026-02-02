'use client';

import { useReportStore } from '@/store/reportStore';
import { Section, Textarea, ImageUpload, Card } from '@/components/ui';
import { MagnifyingGlass, Warning } from '@phosphor-icons/react';

export default function LeakageIdentification() {
  const {
    leakageItems,
    addLeakageItem,
    removeLeakageItem,
    updateLeakageItem,
  } = useReportStore();

  return (
    <Section
      title="Visual Leakage Identification"
      sectionNumber={4}
      onAdd={addLeakageItem}
      onRemove={leakageItems.length > 0 ? removeLeakageItem : undefined}
      addLabel="Add Leakage"
      removeLabel="Remove"
    >
      <p className="text-sm text-[var(--color-paragraph)] mb-6">
        Document any air leakage points identified during the test. Include the location,
        description, and recommended remedial solution.
      </p>

      {leakageItems.length === 0 ? (
        <Card className="bg-[var(--color-surface)] text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
            <MagnifyingGlass weight="light" className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <p className="text-[var(--color-muted)]">
            No leakage points identified yet.
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Click &quot;Add Leakage&quot; to document a leakage observation.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {leakageItems.map((item, index) => (
            <Card key={item.id} className="relative group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-error-light)] flex items-center justify-center">
                  <Warning weight="fill" className="w-4 h-4 text-[var(--color-error)]" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[var(--color-title)]">
                      Leakage Point #{index + 1}
                    </span>
                  </div>
                  <Textarea
                    label="Leakage Description"
                    placeholder="e.g., Air leakage detected at the NW corner window frame joint"
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      updateLeakageItem(item.id, { description: e.target.value })
                    }
                  />
                  <Textarea
                    label="Remedial Solution"
                    placeholder="e.g., Seal with appropriate weather-resistant sealant, ensure complete coverage"
                    rows={2}
                    value={item.solution}
                    onChange={(e) =>
                      updateLeakageItem(item.id, { solution: e.target.value })
                    }
                  />
                  <div>
                    <label className="text-sm font-medium text-[var(--color-title)] block mb-2">
                      Evidence Photo
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
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
