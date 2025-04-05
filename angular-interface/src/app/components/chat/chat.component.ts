import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgForOf,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';
  selectedFiles: { file: File; preview: string | ArrayBuffer | null }[] = [];
  previewUrl: string | null = null;
  isDragging = false;
  isUploading = false;
  patientId = 'P12345';

  // Static demo model results (replace with actual analysis results later)
  analysisResults = {
    detection: 'Positive',
    location: 'Right frontal lobe',
    confidence: 92.7,
    size: '2.3 cm in diameter',
    characteristics: 'Well-defined borders, heterogeneous appearance'
  };

  constructor(private aiService: AiService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  addFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFiles.push({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files?.length) {
      Array.from(event.dataTransfer.files).forEach(file => this.addFile(file));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => this.addFile(file));
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  resetFiles() {
    this.selectedFiles = [];
  }


  // setFile(file: File) {
  //   this.selectedFile = file;
  //
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.previewUrl = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
  //
  // resetFile() {
  //   this.selectedFile = null;
  //   this.previewUrl = null;
  // }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'doctor', text: this.userInput });
    this.isUploading = true;

    const files = this.selectedFiles.map(f => f.file);

    this.aiService.sendMessageWithFiles(this.userInput, files).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'assistant', text: res.message });
        this.userInput = '';
        this.resetFiles();
        this.isUploading = false;
      },
      error: (err) => {
        this.messages.push({ sender: 'assistant', text: 'Error fetching response.' });
        console.error(err);
        this.isUploading = false;
      }
    });
  }
}
