export enum Subject {
  GT1 = 'Giải tích 1',
  GT2 = 'Giải tích 2',
  GT3 = 'Giải tích 3',
  ALGEBRA = 'Đại số',
  PROBABILITY = 'Xác suất thống kê',
  CHEM1 = 'Hóa học 1',
  CHEM2 = 'Hóa học 2',
  INORGANIC = 'Hóa vô cơ',
  ORGANIC = 'Hóa hữu cơ',
  PHYS1 = 'Vật lý 1',
  PHYS2 = 'Vật lý 2',
  PHYS3 = 'Vật lý 3'
}

export const SubjectGroups = {
  'Toán - Tin': [Subject.GT1, Subject.GT2, Subject.GT3, Subject.ALGEBRA, Subject.PROBABILITY],
  'Hóa học': [Subject.CHEM1, Subject.CHEM2, Subject.INORGANIC, Subject.ORGANIC],
  'Vật lý': [Subject.PHYS1, Subject.PHYS2, Subject.PHYS3]
};

export type Theme = 'light' | 'dark';
export type AIProvider = 'gemini' | 'custom';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar: string;
}

export interface SubjectConfig {
  provider: AIProvider;
  modelId: string;
  apiUrl?: string;
  apiKey?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}
