export type HardwareId =
  | 'case'
  | 'motherboard'
  | 'cpu'
  | 'cooler'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface HardwareSpec {
  name: string;
  info: string;
}

export interface Hardware3DConfig {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hoverColor: string;
}

export interface HardwareModule {
  id: HardwareId;
  title: string;
  shortName: string;
  analogy: string;
  description: string;
  capabilities: string[];
  keySpecs: HardwareSpec[];
  model3D: Hardware3DConfig;
  quiz: QuizQuestion[];
}

export interface ModuleProgress {
  completed: boolean;
  bestScore: number;
}

export type LearningProgressMap = Partial<Record<HardwareId, ModuleProgress>>;