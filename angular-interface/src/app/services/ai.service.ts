import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API URL

  // For demo/mockup purposes
  private mockEnabled = true;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, patientId: string): Observable<any> {
    if (this.mockEnabled) {
      // Mock response for demo
      return of({
        success: true,
        modelResults: {
          detection: 'Positive',
          location: 'Right frontal lobe',
          confidence: 92.7,
          size: '2.3 cm in diameter',
          characteristics: 'Well-defined borders, heterogeneous appearance'
        }
      }).pipe(delay(2000)); // Simulate network delay
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('patientId', patientId);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  sendMessageWithFiles(message: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('message', message);

    files.forEach((file, i) => {
      formData.append('files', file);
    });

    return this.http.post(`${this.apiUrl}/chat`, formData);
  }


  analyzePatient(patientData: any): Observable<any> {
    if (this.mockEnabled) {
      return of({
        success: true,
        message: `Analysis for patient ${patientData.name} complete.`
      }).pipe(delay(1000));
    }

    return this.http.post(`${this.apiUrl}/analyze`, { patientData });
  }

  sendMessage(message: string, patientId: string, analysisResults?: any): Observable<any> {
    const patientData = {
      patient_id: patientId,
      age: 45,
      gender: 'Female',
      medical_history: 'Headaches for 3 months, episodes of blurred vision',
      previous_treatments: 'None'
    };

    return this.http.post(`${this.apiUrl}/chat`, {
      message,
      patientData,
      modelResults: analysisResults
    });
  }


  // sendMessage(message: string, patientId: string, analysisResults?: any): Observable<any> {
  //   if (this.mockEnabled) {
  //     // Simple mock responses based on keywords
  //     let response = '';
  //
  //     if (message.toLowerCase().includes('tumor')) {
  //       response = 'Based on the analysis, we detected a tumor in the right frontal lobe with high confidence (92.7%). The tumor appears to be well-defined with heterogeneous appearance.';
  //     } else if (message.toLowerCase().includes('treatment')) {
  //       response = 'For this type of tumor, common treatment options include surgical resection, radiation therapy, or a combination approach. The location in the right frontal lobe makes it relatively accessible for surgery with modern techniques.';
  //     } else if (message.toLowerCase().includes('prognosis')) {
  //       response = 'Prognosis depends on several factors including the exact tumor type, which requires histopathological confirmation. However, tumors in this location with clear borders often have a more favorable prognosis with appropriate treatment.';
  //     } else {
  //       response = 'I understand your question. To provide more specific information about this case, I would need additional details from the pathology report and complete medical history.';
  //     }
  //
  //     return of({
  //       message: response
  //     }).pipe(delay(1000));
  //   }
  //
  //   return this.http.post(`${this.apiUrl}/chat`, {
  //     message,
  //     patientId,
  //     analysisResults
  //   });
  // }
}
