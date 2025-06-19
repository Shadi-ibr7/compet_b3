export type UserRole = "molt" | "mentor" | "admin";

export interface Experience {
  type: "pro" | "education";
  institution: string;       // école ou entreprise
  position?: string;        // uniquement pour "pro"
  startDate: string;        // format ISO (YYYY-MM-DD)
  endDate?: string;
}
