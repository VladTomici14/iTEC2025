import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./patient-info.component.html`,
  styleUrls: ['./patient-info.component.scss'],
})
export class PatientInfoComponent {
  @Output() patientSubmitted = new EventEmitter<any>();

  patient = {
    patientId: '',
    name: '',
    age: null,
    gender: '',
    medicalHistory: ''
  };

  isSubmitting = false;

  constructor(private aiService: AiService) {}

  submitPatient() {
    if (!this.patient.patientId || !this.patient.name) {
      alert('Patient ID and Name are required');
      return;
    }

    this.isSubmitting = true;

    this.aiService.analyzePatient(this.patient).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.patientSubmitted.emit(this.patient);
      },
      error: (error) => {
        console.error('Error submitting patient info:', error);
        this.isSubmitting = false;
        alert('Error submitting patient information');
      }
    });
  }
}
