import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PatientQueryRequest, PatientQueryResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'https://localhost:44370/api/Patients';

  constructor(private http: HttpClient) {}

  register(patient: Omit<Patient, 'id' | 'isActive'>): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, patient);
  }

  query(request: PatientQueryRequest): Observable<PatientQueryResponse> {
    return this.http.post<PatientQueryResponse>(`${this.baseUrl}/query`, request);
  }

  update(id: number, patient: Omit<Patient, 'id' | 'isActive'>): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, patient);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}