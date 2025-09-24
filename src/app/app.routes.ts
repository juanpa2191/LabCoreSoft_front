import { Routes } from '@angular/router';
import { PatientManagementComponent } from './patient-management/patient-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: PatientManagementComponent }
];
