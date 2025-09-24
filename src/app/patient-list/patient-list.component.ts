import { Component, OnInit, ViewChild, Output, EventEmitter, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Patient, PatientQueryRequest } from '../models/patient.model';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'documentType', 'documentNumber', 'birthDate', 'city', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Patient>();
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() edit = new EventEmitter<Patient>();
  @Output() delete = new EventEmitter<number>();

  private patientService = inject(PatientService);

  ngOnInit() {
    this.loadPatients();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loadPatients(value || '');
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public loadPatients(documentNumber = '') {
    const request: PatientQueryRequest = {
      filters: { DocumentNumber: documentNumber },
      orden: 'FirstName',
      asc: true,
      pageNumber: this.paginator?.pageIndex || 1,
      pageSize: this.paginator?.pageSize || 10
    };
    this.patientService.query(request).subscribe(response => {
      this.dataSource.data = response.items;
      // If paginator has total, set it
      if (this.paginator) {
        this.paginator.length = response.totalCount;
      }
    });
  }

  onEdit(patient: Patient) {
    this.edit.emit(patient);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  getDocumentTypeLabel(type: number): string {
    const types = {
      0: 'C. de ciudadanía',
      1: 'C. de extranjería',
      2: 'Registro civil'
    };
    return types[type as keyof typeof types] || '';
  }
}
