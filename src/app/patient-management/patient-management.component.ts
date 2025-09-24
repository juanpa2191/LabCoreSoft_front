import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '../models/patient.model';
import { PatientService } from '../services/patient.service';
import { PatientListComponent } from '../patient-list/patient-list.component';
import { PatientFormComponent } from '../patient-form/patient-form.component';

@Component({
  selector: 'app-patient-management',
  imports: [
    CommonModule,
    MatButtonModule,
    PatientListComponent,
    PatientFormComponent
  ],
  templateUrl: './patient-management.component.html',
  styleUrl: './patient-management.component.scss'
})
export class PatientManagementComponent {
  mode: 'list' | 'form' = 'list';
  currentPatient: Patient | null = null;

  @ViewChild(PatientListComponent) patientList!: PatientListComponent;

  private patientService = inject(PatientService);
  private snackBar = inject(MatSnackBar);

  onAdd() {
    this.currentPatient = null;
    this.mode = 'form';
  }

  onEdit(patient: Patient) {
    this.currentPatient = patient;
    this.mode = 'form';
  }

  onSave(patientData: Omit<Patient, 'id' | 'isActive'>) {
    const operation = this.currentPatient
      ? this.patientService.update(this.currentPatient.id!, patientData)
      : this.patientService.register(patientData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(this.currentPatient ? 'Paciente actualizado' : 'Paciente registrado', 'Cerrar', { duration: 3000 });
        this.mode = 'list';
        this.patientList?.loadPatients();
      },
      error: (err) => {
        this.snackBar.open('Error al guardar paciente', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  onDelete(id: number) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Paciente eliminado', 'Cerrar', { duration: 3000 });
          this.patientList?.loadPatients();
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar paciente', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  onCancel() {
    this.mode = 'list';
  }
}
