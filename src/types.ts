export type Theme = 'light' | 'dark';
export type Complexity = 'low' | 'medium' | 'high';
export type SupportScheme = 'full' | 'third-line';
export type AuthMode = 'login' | 'register';

export type Rate = {
  role: string;
  level: string;
  rate: number;
  count: number;
};

export type Module = {
  title: string;
  hours: number;
  owner: string;
};

export type Totals = {
  baseHours: number;
  blendedRate: number;
  devBudget: number;
  warranty: number;
  supportMonthly: number;
  supportAnnual: number;
  total: number;
};

export type MonthPlanItem = {
  month: number;
  label: string;
  cost: number;
};
