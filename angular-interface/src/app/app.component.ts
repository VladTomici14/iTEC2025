
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { PatientInfoComponent } from './components/patient-info/patient-info.component';
import { ResultsComponent } from './components/results/results.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    ChatComponent,
    ImageUploadComponent,
    PatientInfoComponent,
    ResultsComponent
  ],
})
export class AppComponent {
  currentPatient: any = null;
  analysisResults: any = null;

  onPatientInfoSubmitted(patientInfo: any) {
    this.currentPatient = patientInfo;
  }

  onAnalysisComplete(results: any) {
    this.analysisResults = results;
  }
}
