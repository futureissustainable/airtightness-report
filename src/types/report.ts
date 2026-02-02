export interface VolumeRow {
  id: string;
  name: string;
  method: 'l_w' | 'area';
  length: number;
  width: number;
  area: number;
  height: number;
  subVolume: number;
}

export interface SealItem {
  id: string;
  description: string;
  imageData: string | null;
}

export interface LeakageItem {
  id: string;
  description: string;
  solution: string;
  imageData: string | null;
}

export interface MeasurementRow {
  id: string;
  depPressure: number;
  depAch: number;
  depFlow: number;
  prePressure: number;
  preAch: number;
  preFlow: number;
}

export interface GeneralInfo {
  projectName: string;
  reportNumber: string;
  projectAddress: string;
  technicianName: string;
  testDate: string;
  softwareVersion: string;
}

export interface BuildingConditions {
  envelopeArea: number;
  floorArea: number;
  internalTemp: number;
  externalTemp: number;
}

export interface Results {
  requiredN50: number;
  depN50: number;
  preN50: number;
}

export interface CalculatedResults {
  totalVolume: number;
  depV50: number;
  preV50: number;
  avgV50: number;
  avgN50: number;
  depQe50: number;
  preQe50: number;
  avgQe50: number;
  isPassing: boolean | null;
}

export interface Report {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  generalInfo: GeneralInfo;
  buildingConditions: BuildingConditions;
  volumeRows: VolumeRow[];
  sealItems: SealItem[];
  leakageItems: LeakageItem[];
  measurementRows: MeasurementRow[];
  results: Results;
}

export interface SavedReport {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
