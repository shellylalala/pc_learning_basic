export type UserRole = "guest" | "analyst" | "admin";

export interface ReportData {
  title: string;
  revenue: number;
  conversionRate: number;
  generatedAt: string;
  fromCache: boolean;
}

export interface AccessLog {
  id: number;
  message: string;
}
