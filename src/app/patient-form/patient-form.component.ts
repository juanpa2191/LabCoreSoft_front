import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Patient, DocumentType } from '../models/patient.model';
import { PatientService } from '../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent implements OnInit {
  @Input() patient: Patient | null = null;
  @Output() save = new EventEmitter<Patient>();

  form!: FormGroup;
  documentTypes = [
    { value: DocumentType.Citizenship, label: 'C. de ciudadanía' },
    { value: DocumentType.Foreign, label: 'C. de extranjería' },
    { value: DocumentType.CivilRegistry, label: 'Registro civil' }
  ];

  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      documentType: [{ value: '', disabled: !!this.patient }, [Validators.required]],
      documentNumber: ['', [Validators.required]],
      birthDate: ['', [Validators.required, this.ageValidator]],
      city: ['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.email]]
    });

    if (this.patient) {
      this.form.patchValue({ ...this.patient, birthDate: new Date(this.patient.birthDate) });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const patientData = {
        ...formValue,
        birthDate: formValue.birthDate.toISOString(),
        documentType: +formValue.documentType
      };
      this.save.emit(patientData);
    }
  }

  private ageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 0 || age > 120 ? { invalidAge: true } : null;
  }
}
