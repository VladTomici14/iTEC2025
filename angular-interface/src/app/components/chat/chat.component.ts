import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: string;
  text: string;
  images?: { url: string | ArrayBuffer | null; name: string }[];
}

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
  messages: ChatMessage[] = [];
  userInput: string = '';
  selectedFiles: { file: File; preview: string | ArrayBuffer | null }[] = [];
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

  sendMessage() {
    if (!this.userInput.trim() && this.selectedFiles.length === 0) return;

    // Create a message with images if files are selected
    const userMessage: ChatMessage = {
      sender: 'doctor',
      text: this.userInput
    };

    // Add images to the message if there are any
    if (this.selectedFiles.length > 0) {
      userMessage.images = this.selectedFiles.map(fileObj => ({
        url: fileObj.preview,
        name: fileObj.file.name
      }));
    }

    // Add the message to the messages array
    this.messages.push(userMessage);

    const files = this.selectedFiles.map(f => f.file);

    // Only call API if there's text input or files
    if (this.userInput.trim() || files.length > 0) {
      this.isUploading = true;

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
}
