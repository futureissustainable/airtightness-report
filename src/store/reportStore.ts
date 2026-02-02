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
  method: 'l_w',
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

const createDefaultMeasurementRow = (): MeasurementRow => ({
  id: generateId(),
  depPressure: 0,
  depAch: 0,
  depFlow: 0,
  prePressure: 0,
  preAch: 0,
  preFlow: 0,
});

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
  generalInfo: GeneralInfo;
  buildingConditions: BuildingConditions;
  volumeRows: VolumeRow[];
  sealItems: SealItem[];
  leakageItems: LeakageItem[];
  measurementRows: MeasurementRow[];
  results: Results;

  // Saved Reports
  savedReports: Report[];

  // UI State
  isSaving: boolean;
  lastSaved: string | null;

  // Actions - General Info
  updateGeneralInfo: (info: Partial<GeneralInfo>) => void;

  // Actions - Building Conditions
  updateBuildingConditions: (conditions: Partial<BuildingConditions>) => void;

  // Actions - Volume Rows
  addVolumeRow: () => void;
  removeVolumeRow: () => void;
  updateVolumeRow: (id: string, data: Partial<VolumeRow>) => void;

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

  // Actions - Results
  updateResults: (results: Partial<Results>) => void;

  // Actions - Report Management
  saveReport: (name?: string) => void;
  loadReport: (id: string) => void;
  deleteReport: (id: string) => void;
  createNewReport: () => void;

  // Computed Values
  getCalculatedResults: () => CalculatedResults;
  getSavedReportsList: () => SavedReport[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentReportId: null,
      generalInfo: getDefaultGeneralInfo(),
      buildingConditions: getDefaultBuildingConditions(),
      volumeRows: [createDefaultVolumeRow()],
      sealItems: [createDefaultSealItem()],
      leakageItems: [createDefaultLeakageItem()],
      measurementRows: Array.from({ length: 5 }, () => createDefaultMeasurementRow()),
      results: getDefaultResults(),
      savedReports: [],
      isSaving: false,
      lastSaved: null,

      // Actions - General Info
      updateGeneralInfo: (info) =>
        set((state) => ({
          generalInfo: { ...state.generalInfo, ...info },
        })),

      // Actions - Building Conditions
      updateBuildingConditions: (conditions) =>
        set((state) => ({
          buildingConditions: { ...state.buildingConditions, ...conditions },
        })),

      // Actions - Volume Rows
      addVolumeRow: () =>
        set((state) => ({
          volumeRows: [...state.volumeRows, createDefaultVolumeRow()],
        })),

      removeVolumeRow: () =>
        set((state) => ({
          volumeRows: state.volumeRows.length > 1
            ? state.volumeRows.slice(0, -1)
            : state.volumeRows,
        })),

      updateVolumeRow: (id, data) =>
        set((state) => ({
          volumeRows: state.volumeRows.map((row) => {
            if (row.id !== id) return row;
            const updated = { ...row, ...data };
            // Recalculate sub-volume
            if (updated.method === 'l_w') {
              updated.subVolume = updated.length * updated.width * updated.height;
            } else {
              updated.subVolume = updated.area * updated.height;
            }
            return updated;
          }),
        })),

      // Actions - Seal Items
      addSealItem: () =>
        set((state) => ({
          sealItems: [...state.sealItems, createDefaultSealItem()],
        })),

      removeSealItem: () =>
        set((state) => ({
          sealItems: state.sealItems.length > 0
            ? state.sealItems.slice(0, -1)
            : state.sealItems,
        })),

      updateSealItem: (id, data) =>
        set((state) => ({
          sealItems: state.sealItems.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),

      // Actions - Leakage Items
      addLeakageItem: () =>
        set((state) => ({
          leakageItems: [...state.leakageItems, createDefaultLeakageItem()],
        })),

      removeLeakageItem: () =>
        set((state) => ({
          leakageItems: state.leakageItems.length > 0
            ? state.leakageItems.slice(0, -1)
            : state.leakageItems,
        })),

      updateLeakageItem: (id, data) =>
        set((state) => ({
          leakageItems: state.leakageItems.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),

      // Actions - Measurement Rows
      addMeasurementRow: () =>
        set((state) => ({
          measurementRows: [...state.measurementRows, createDefaultMeasurementRow()],
        })),

      removeMeasurementRow: () =>
        set((state) => ({
          measurementRows: state.measurementRows.length > 1
            ? state.measurementRows.slice(0, -1)
            : state.measurementRows,
        })),

      updateMeasurementRow: (id, data) =>
        set((state) => ({
          measurementRows: state.measurementRows.map((row) =>
            row.id === id ? { ...row, ...data } : row
          ),
        })),

      // Actions - Results
      updateResults: (results) =>
        set((state) => ({
          results: { ...state.results, ...results },
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
          savedReports: state.currentReportId
            ? state.savedReports.map((r) => (r.id === report.id ? report : r))
            : [...state.savedReports, report],
          lastSaved: now,
        }));
      },

      loadReport: (id) => {
        const state = get();
        const report = state.savedReports.find((r) => r.id === id);
        if (!report) return;

        set({
          currentReportId: report.id,
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
          generalInfo: getDefaultGeneralInfo(),
          buildingConditions: getDefaultBuildingConditions(),
          volumeRows: [createDefaultVolumeRow()],
          sealItems: [createDefaultSealItem()],
          leakageItems: [createDefaultLeakageItem()],
          measurementRows: Array.from({ length: 5 }, () => createDefaultMeasurementRow()),
          results: getDefaultResults(),
          lastSaved: null,
        }),

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
        lastSaved: state.lastSaved,
      }),
    }
  )
);
