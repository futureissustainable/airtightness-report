import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Report,
  GeneralInfo,
  BuildingConditions,
  VolumeRow,
  SealItem,
  LeakageItem,
  MeasurementRow,
  Results,
  CalculatedResults,
  SavedReport,
} from '@/types/report';

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create default values
const createDefaultVolumeRow = (): VolumeRow => ({
  id: generateId(),
  name: '',
  method: 'area',
  length: 0,
  width: 0,
  area: 0,
  height: 0,
  subVolume: 0,
});

const createDefaultSealItem = (): SealItem => ({
  id: generateId(),
  description: '',
  imageData: null,
});

const createDefaultLeakageItem = (): LeakageItem => ({
  id: generateId(),
  description: '',
  solution: '',
  imageData: null,
});

const createDefaultMeasurementRow = (pressure: number = 0): MeasurementRow => ({
  id: generateId(),
  depPressure: pressure,
  depAch: 0,
  depFlow: 0,
  prePressure: pressure,
  preAch: 0,
  preFlow: 0,
});

const defaultPressures = [50, 40, 30, 20, 10];

const getDefaultGeneralInfo = (): GeneralInfo => ({
  projectName: '',
  reportNumber: '',
  projectAddress: '',
  technicianName: '',
  testDate: new Date().toISOString().split('T')[0],
  softwareVersion: '',
});

const getDefaultBuildingConditions = (): BuildingConditions => ({
  envelopeArea: 0,
  floorArea: 0,
  internalTemp: 0,
  externalTemp: 0,
});

const getDefaultResults = (): Results => ({
  requiredN50: 0.6,
  depN50: 0,
  preN50: 0,
});

interface ReportState {
  // Current Report Data
  currentReportId: string | null;
  hasUnsavedChanges: boolean;
  generalInfo: GeneralInfo;
  buildingConditions: BuildingConditions;
  volumeRows: VolumeRow[];
  sealItems: SealItem[];
  leakageItems: LeakageItem[];
  measurementRows: MeasurementRow[];
  results: Results;

  // Saved Reports
  savedReports: Report[];

  // Actions - General Info
  updateGeneralInfo: (info: Partial<GeneralInfo>) => void;

  // Actions - Building Conditions
  updateBuildingConditions: (conditions: Partial<BuildingConditions>) => void;

  // Actions - Volume Rows
  addVolumeRow: () => void;
  removeVolumeRow: () => void;
  updateVolumeRow: (id: string, data: Partial<VolumeRow>) => void;
  pasteVolumeRows: (text: string) => number;
  pasteColumnData: (field: 'name' | 'length' | 'width' | 'area' | 'height', startIndex: number, values: string[]) => number;

  // Actions - Seal Items
  addSealItem: () => void;
  removeSealItem: () => void;
  updateSealItem: (id: string, data: Partial<SealItem>) => void;

  // Actions - Leakage Items
  addLeakageItem: () => void;
  removeLeakageItem: () => void;
  updateLeakageItem: (id: string, data: Partial<LeakageItem>) => void;

  // Actions - Measurement Rows
  addMeasurementRow: () => void;
  removeMeasurementRow: () => void;
  updateMeasurementRow: (id: string, data: Partial<MeasurementRow>) => void;
  pasteMeasurementColumnData: (field: 'depPressure' | 'depAch' | 'prePressure' | 'preAch', startIndex: number, values: string[]) => number;

  // Actions - Results
  updateResults: (results: Partial<Results>) => void;

  // Actions - Report Management
  saveReport: (name?: string) => void;
  loadReport: (id: string) => void;
  deleteReport: (id: string) => void;
  createNewReport: () => void;
  importLegacyReport: (code: string) => boolean;
  exportLegacyCode: () => string;
  cleanupEmptyRows: () => number;

  // Computed Values
  getCalculatedResults: () => CalculatedResults;
  getSavedReportsList: () => SavedReport[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentReportId: null,
      hasUnsavedChanges: false,
      generalInfo: getDefaultGeneralInfo(),
      buildingConditions: getDefaultBuildingConditions(),
      volumeRows: [createDefaultVolumeRow()],
      sealItems: [createDefaultSealItem()],
      leakageItems: [createDefaultLeakageItem()],
      measurementRows: defaultPressures.map((p) => createDefaultMeasurementRow(p)),
      results: getDefaultResults(),
      savedReports: [],

      // Actions - General Info
      updateGeneralInfo: (info) =>
        set((state) => ({
          generalInfo: { ...state.generalInfo, ...info },
          hasUnsavedChanges: true,
        })),

      // Actions - Building Conditions
      updateBuildingConditions: (conditions) =>
        set((state) => ({
          buildingConditions: { ...state.buildingConditions, ...conditions },
          hasUnsavedChanges: true,
        })),

      // Actions - Volume Rows
      addVolumeRow: () =>
        set((state) => ({
          volumeRows: [...state.volumeRows, createDefaultVolumeRow()],
          hasUnsavedChanges: true,
        })),

      removeVolumeRow: () =>
        set((state) => ({
          volumeRows: state.volumeRows.length > 1
            ? state.volumeRows.slice(0, -1)
            : state.volumeRows,
          hasUnsavedChanges: true,
        })),

      updateVolumeRow: (id, data) =>
        set((state) => ({
          volumeRows: state.volumeRows.map((row) => {
            if (row.id !== id) return row;
            const updated = { ...row, ...data };
            if (updated.method === 'l_w') {
              updated.subVolume = updated.length * updated.width * updated.height;
            } else {
              updated.subVolume = updated.area * updated.height;
            }
            return updated;
          }),
          hasUnsavedChanges: true,
        })),

      pasteVolumeRows: (text: string): number => {
        const lines = text.trim().split(/\r?\n/).filter((line) => line.trim());
        if (lines.length === 0) return 0;

        const newRows: VolumeRow[] = [];

        for (const line of lines) {
          const cols = line.split('\t').map((c) => c.trim());
          if (cols.length < 3) continue;

          // Try to parse as numbers (skip header rows)
          const nums = cols.slice(1).map((c) => parseFloat(c) || 0);
          const hasValidNumbers = nums.some((n) => n > 0);
          if (!hasValidNumbers) continue;

          let row: VolumeRow;

          if (cols.length >= 4) {
            // 4+ columns: Name, Length, Width, Height (L×W method)
            const [name, ...rest] = cols;
            const [length, width, height] = rest.map((c) => parseFloat(c) || 0);
            row = {
              id: generateId(),
              name,
              method: 'l_w',
              length,
              width,
              area: 0,
              height,
              subVolume: length * width * height,
            };
          } else {
            // 3 columns: Name, Area, Height (area method)
            const [name, areaStr, heightStr] = cols;
            const area = parseFloat(areaStr) || 0;
            const height = parseFloat(heightStr) || 0;
            row = {
              id: generateId(),
              name,
              method: 'area',
              length: 0,
              width: 0,
              area,
              height,
              subVolume: area * height,
            };
          }

          newRows.push(row);
        }

        if (newRows.length === 0) return 0;

        set((state) => {
          // If there's only one empty row, replace it; otherwise append
          const hasOnlyEmptyRow =
            state.volumeRows.length === 1 &&
            !state.volumeRows[0].name &&
            state.volumeRows[0].subVolume === 0;

          return {
            volumeRows: hasOnlyEmptyRow ? newRows : [...state.volumeRows, ...newRows],
            hasUnsavedChanges: true,
          };
        });

        return newRows.length;
      },

      pasteColumnData: (field, startIndex, values): number => {
        // Safety: limit to 500 rows max to prevent accidents
        const safeValues = values.slice(0, 500);
        if (safeValues.length === 0) return 0;

        set((state) => {
          // Clone existing rows
          const newVolumeRows = [...state.volumeRows];

          // Calculate how many new rows we need
          const totalNeeded = startIndex + safeValues.length;
          const rowsToAdd = Math.max(0, totalNeeded - newVolumeRows.length);

          // Add new rows if needed (all at once, not in a loop with state updates)
          for (let i = 0; i < rowsToAdd; i++) {
            newVolumeRows.push(createDefaultVolumeRow());
          }

          // Now update the values
          safeValues.forEach((value, i) => {
            const targetIndex = startIndex + i;
            const row = newVolumeRows[targetIndex];

            if (field === 'name') {
              row.name = value;
            } else {
              const num = parseFloat(value) || 0;
              if (field === 'length') row.length = num;
              else if (field === 'width') row.width = num;
              else if (field === 'area') row.area = num;
              else if (field === 'height') row.height = num;

              // Recalculate subVolume
              if (row.method === 'l_w') {
                row.subVolume = row.length * row.width * row.height;
              } else {
                row.subVolume = row.area * row.height;
              }
            }
          });

          return {
            volumeRows: newVolumeRows,
            hasUnsavedChanges: true,
          };
        });

        return safeValues.length;
      },

      // Actions - Seal Items
      addSealItem: () =>
        set((state) => ({
          sealItems: [...state.sealItems, createDefaultSealItem()],
          hasUnsavedChanges: true,
        })),

      removeSealItem: () =>
        set((state) => ({
          sealItems: state.sealItems.length > 0
            ? state.sealItems.slice(0, -1)
            : state.sealItems,
          hasUnsavedChanges: true,
        })),

      updateSealItem: (id, data) =>
        set((state) => ({
          sealItems: state.sealItems.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
          hasUnsavedChanges: true,
        })),

      // Actions - Leakage Items
      addLeakageItem: () =>
        set((state) => ({
          leakageItems: [...state.leakageItems, createDefaultLeakageItem()],
          hasUnsavedChanges: true,
        })),

      removeLeakageItem: () =>
        set((state) => ({
          leakageItems: state.leakageItems.length > 0
            ? state.leakageItems.slice(0, -1)
            : state.leakageItems,
          hasUnsavedChanges: true,
        })),

      updateLeakageItem: (id, data) =>
        set((state) => ({
          leakageItems: state.leakageItems.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
          hasUnsavedChanges: true,
        })),

      // Actions - Measurement Rows
      addMeasurementRow: () =>
        set((state) => ({
          measurementRows: [...state.measurementRows, createDefaultMeasurementRow()],
          hasUnsavedChanges: true,
        })),

      removeMeasurementRow: () =>
        set((state) => ({
          measurementRows: state.measurementRows.length > 1
            ? state.measurementRows.slice(0, -1)
            : state.measurementRows,
          hasUnsavedChanges: true,
        })),

      updateMeasurementRow: (id, data) =>
        set((state) => ({
          measurementRows: state.measurementRows.map((row) =>
            row.id === id ? { ...row, ...data } : row
          ),
          hasUnsavedChanges: true,
        })),

      pasteMeasurementColumnData: (field, startIndex, values): number => {
        // Safety: limit to 500 rows max
        const safeValues = values.slice(0, 500);
        if (safeValues.length === 0) return 0;

        set((state) => {
          const newRows = [...state.measurementRows];

          // Calculate how many new rows we need
          const totalNeeded = startIndex + safeValues.length;
          const rowsToAdd = Math.max(0, totalNeeded - newRows.length);

          // Add new rows if needed
          for (let i = 0; i < rowsToAdd; i++) {
            newRows.push(createDefaultMeasurementRow());
          }

          // Update the values
          safeValues.forEach((value, i) => {
            const targetIndex = startIndex + i;
            const row = newRows[targetIndex];
            const num = parseFloat(value) || 0;

            if (field === 'depPressure') row.depPressure = num;
            else if (field === 'depAch') row.depAch = num;
            else if (field === 'prePressure') row.prePressure = num;
            else if (field === 'preAch') row.preAch = num;
          });

          return {
            measurementRows: newRows,
            hasUnsavedChanges: true,
          };
        });

        return safeValues.length;
      },

      // Actions - Results
      updateResults: (results) =>
        set((state) => ({
          results: { ...state.results, ...results },
          hasUnsavedChanges: true,
        })),

      // Actions - Report Management
      saveReport: (name) => {
        const state = get();
        const now = new Date().toISOString();
        const reportName = name || state.generalInfo.projectName || 'Untitled Report';

        const report: Report = {
          id: state.currentReportId || generateId(),
          name: reportName,
          createdAt: state.currentReportId
            ? state.savedReports.find((r) => r.id === state.currentReportId)?.createdAt || now
            : now,
          updatedAt: now,
          generalInfo: state.generalInfo,
          buildingConditions: state.buildingConditions,
          volumeRows: state.volumeRows,
          sealItems: state.sealItems,
          leakageItems: state.leakageItems,
          measurementRows: state.measurementRows,
          results: state.results,
        };

        set((state) => ({
          currentReportId: report.id,
          hasUnsavedChanges: false,
          savedReports: state.currentReportId
            ? state.savedReports.map((r) => (r.id === report.id ? report : r))
            : [...state.savedReports, report],
        }));
      },

      loadReport: (id) => {
        const state = get();
        const report = state.savedReports.find((r) => r.id === id);
        if (!report) return;

        set({
          currentReportId: report.id,
          hasUnsavedChanges: false,
          generalInfo: report.generalInfo,
          buildingConditions: report.buildingConditions,
          volumeRows: report.volumeRows,
          sealItems: report.sealItems,
          leakageItems: report.leakageItems,
          measurementRows: report.measurementRows,
          results: report.results,
        });
      },

      deleteReport: (id) =>
        set((state) => ({
          savedReports: state.savedReports.filter((r) => r.id !== id),
          currentReportId: state.currentReportId === id ? null : state.currentReportId,
        })),

      createNewReport: () =>
        set({
          currentReportId: null,
          hasUnsavedChanges: false,
          generalInfo: getDefaultGeneralInfo(),
          buildingConditions: getDefaultBuildingConditions(),
          volumeRows: [createDefaultVolumeRow()],
          sealItems: [createDefaultSealItem()],
          leakageItems: [createDefaultLeakageItem()],
          measurementRows: defaultPressures.map((p) => createDefaultMeasurementRow(p)),
          results: getDefaultResults(),
        }),

      importLegacyReport: (code: string): boolean => {
        try {
          const decoded = atob(code.trim());
          const data = JSON.parse(decoded);
          const inputs = data.staticInputs || {};

          // Map general info
          const generalInfo: GeneralInfo = {
            projectName: inputs['project-name'] || '',
            reportNumber: inputs['report-number'] || '',
            projectAddress: inputs['project-address'] || '',
            technicianName: inputs['technician-name'] || '',
            testDate: inputs['test-date'] || new Date().toISOString().split('T')[0],
            softwareVersion: inputs['software-version'] || '',
          };

          // Map building conditions
          const buildingConditions: BuildingConditions = {
            envelopeArea: parseFloat(inputs['envelope-area']) || 0,
            floorArea: parseFloat(inputs['floor-area']) || 0,
            internalTemp: parseFloat(inputs['internal-temp']) || 0,
            externalTemp: parseFloat(inputs['external-temp']) || 0,
          };

          // Map volume rows
          const volumeRows: VolumeRow[] = (data.volumeRows || []).map((row: { name?: string; method?: string; l?: string; w?: string; a?: string; h?: string }) => {
            const length = parseFloat(row.l || '0') || 0;
            const width = parseFloat(row.w || '0') || 0;
            const area = parseFloat(row.a || '0') || 0;
            const height = parseFloat(row.h || '0') || 0;
            const method = row.method === 'area' ? 'area' : 'l_w';
            const subVolume = method === 'area' ? area * height : length * width * height;

            return {
              id: generateId(),
              name: row.name || '',
              method: method as 'l_w' | 'area',
              length,
              width,
              area,
              height,
              subVolume,
            };
          });

          // Map seal items
          const sealItems: SealItem[] = (data.sealItems || []).map((item: { desc?: string; img?: string }) => ({
            id: generateId(),
            description: item.desc || '',
            imageData: item.img && item.img.startsWith('data:') ? item.img : null,
          }));

          // Map leakage items
          const leakageItems: LeakageItem[] = (data.leakageItems || []).map((item: { desc?: string; sol?: string; img?: string }) => ({
            id: generateId(),
            description: item.desc || '',
            solution: item.sol || '',
            imageData: item.img && item.img.startsWith('data:') ? item.img : null,
          }));

          // Map measurement rows
          const measurementRows: MeasurementRow[] = (data.measurementRows || []).map((row: { dep_p?: string; dep_ach?: string; pre_p?: string; pre_ach?: string }) => ({
            id: generateId(),
            depPressure: parseFloat(row.dep_p || '0') || 0,
            depAch: parseFloat(row.dep_ach || '0') || 0,
            depFlow: 0,
            prePressure: parseFloat(row.pre_p || '0') || 0,
            preAch: parseFloat(row.pre_ach || '0') || 0,
            preFlow: 0,
          }));

          // Map results
          const results: Results = {
            requiredN50: parseFloat(inputs['required-n50']) || 0.6,
            depN50: parseFloat(inputs['dep-n50']) || 0,
            preN50: parseFloat(inputs['pre-n50']) || 0,
          };

          // Ensure we have at least one row for each section
          if (volumeRows.length === 0) volumeRows.push(createDefaultVolumeRow());
          if (sealItems.length === 0) sealItems.push(createDefaultSealItem());
          if (leakageItems.length === 0) leakageItems.push(createDefaultLeakageItem());
          if (measurementRows.length === 0) {
            defaultPressures.forEach((p) => measurementRows.push(createDefaultMeasurementRow(p)));
          }

          set({
            currentReportId: null,
            hasUnsavedChanges: true,
            generalInfo,
            buildingConditions,
            volumeRows,
            sealItems,
            leakageItems,
            measurementRows,
            results,
          });

          return true;
        } catch {
          return false;
        }
      },

      exportLegacyCode: (): string => {
        const state = get();

        const data = {
          staticInputs: {
            'project-name': state.generalInfo.projectName,
            'report-number': state.generalInfo.reportNumber,
            'project-address': state.generalInfo.projectAddress,
            'technician-name': state.generalInfo.technicianName,
            'test-date': state.generalInfo.testDate,
            'software-version': state.generalInfo.softwareVersion,
            'envelope-area': String(state.buildingConditions.envelopeArea),
            'floor-area': String(state.buildingConditions.floorArea),
            'internal-temp': String(state.buildingConditions.internalTemp),
            'external-temp': String(state.buildingConditions.externalTemp),
            'required-n50': String(state.results.requiredN50),
            'dep-n50': String(state.results.depN50),
            'pre-n50': String(state.results.preN50),
          },
          volumeRows: state.volumeRows.map((row) => ({
            name: row.name,
            method: row.method,
            l: String(row.length),
            w: String(row.width),
            a: String(row.area),
            h: String(row.height),
          })),
          sealItems: state.sealItems.map((item) => ({
            desc: item.description,
            img: item.imageData || '',
          })),
          leakageItems: state.leakageItems.map((item) => ({
            desc: item.description,
            sol: item.solution,
            img: item.imageData || '',
          })),
          measurementRows: state.measurementRows.map((row) => ({
            dep_p: String(row.depPressure),
            dep_ach: String(row.depAch),
            pre_p: String(row.prePressure),
            pre_ach: String(row.preAch),
          })),
        };

        return btoa(JSON.stringify(data));
      },

      cleanupEmptyRows: (): number => {
        const state = get();
        let removedCount = 0;

        // Filter empty volume rows (keep at least 1)
        const cleanVolumeRows = state.volumeRows.filter(
          (row) => row.name || row.subVolume > 0
        );
        if (cleanVolumeRows.length === 0) cleanVolumeRows.push(createDefaultVolumeRow());
        removedCount += state.volumeRows.length - cleanVolumeRows.length;

        // Filter empty seal items (keep at least 0)
        const cleanSealItems = state.sealItems.filter(
          (item) => item.description || item.imageData
        );
        removedCount += state.sealItems.length - cleanSealItems.length;

        // Filter empty leakage items (keep at least 0)
        const cleanLeakageItems = state.leakageItems.filter(
          (item) => item.description || item.solution || item.imageData
        );
        removedCount += state.leakageItems.length - cleanLeakageItems.length;

        // Filter empty measurement rows (keep at least 1)
        const cleanMeasurementRows = state.measurementRows.filter(
          (row) => row.depPressure > 0 || row.depAch > 0 || row.prePressure > 0 || row.preAch > 0
        );
        if (cleanMeasurementRows.length === 0) cleanMeasurementRows.push(createDefaultMeasurementRow());
        removedCount += state.measurementRows.length - cleanMeasurementRows.length;

        if (removedCount > 0) {
          set({
            volumeRows: cleanVolumeRows,
            sealItems: cleanSealItems.length > 0 ? cleanSealItems : [createDefaultSealItem()],
            leakageItems: cleanLeakageItems.length > 0 ? cleanLeakageItems : [createDefaultLeakageItem()],
            measurementRows: cleanMeasurementRows,
            hasUnsavedChanges: true,
          });
        }

        return removedCount;
      },

      // Computed Values
      getCalculatedResults: () => {
        const state = get();
        const totalVolume = state.volumeRows.reduce(
          (sum, row) => sum + row.subVolume,
          0
        );
        const envelopeArea = state.buildingConditions.envelopeArea;
        const { depN50, preN50, requiredN50 } = state.results;

        const depV50 = depN50 * totalVolume;
        const preV50 = preN50 * totalVolume;
        const avgV50 = (depV50 + preV50) / 2;
        const avgN50 = (depN50 + preN50) / 2;

        const depQe50 = envelopeArea > 0 ? depV50 / envelopeArea : 0;
        const preQe50 = envelopeArea > 0 ? preV50 / envelopeArea : 0;
        const avgQe50 = (depQe50 + preQe50) / 2;

        const isPassing = avgN50 > 0 ? avgN50 <= requiredN50 : null;

        return {
          totalVolume,
          depV50,
          preV50,
          avgV50,
          avgN50,
          depQe50,
          preQe50,
          avgQe50,
          isPassing,
        };
      },

      getSavedReportsList: () => {
        const state = get();
        return state.savedReports.map((r) => ({
          id: r.id,
          name: r.name,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      },
    }),
    {
      name: 'airtightness-report-storage',
      partialize: (state) => ({
        currentReportId: state.currentReportId,
        generalInfo: state.generalInfo,
        buildingConditions: state.buildingConditions,
        volumeRows: state.volumeRows,
        sealItems: state.sealItems,
        leakageItems: state.leakageItems,
        measurementRows: state.measurementRows,
        results: state.results,
        savedReports: state.savedReports,
      }),
    }
  )
);
