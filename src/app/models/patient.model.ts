export enum DocumentType {
  Citizenship = 0, // C. de ciudadanía
  Foreign = 1, // C. de extranjería
  CivilRegistry = 2, // Registro civil
  // Add more if needed
}

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string; // ISO date string
  city: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface PatientQueryRequest {
  filters: {
    DocumentNumber?: string;
  };
  orden: string; // e.g., 'FirstName'
  asc: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface PatientQueryResponse {
  items: Patient[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}