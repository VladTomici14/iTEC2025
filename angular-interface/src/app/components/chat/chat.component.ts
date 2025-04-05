import {Component, Input} from '@angular/core';
import { AiService } from '../../services/ai.service';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgForOf
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';
  selectedFiles: File[] = [];
  patientId = 'P12345';

  // Fake model results (you'd use real ones from upload later)
  analysisResults = {
    detection: 'Positive',
    location: 'Right frontal lobe',
    confidence: 92.7,
    size: '2.3 cm in diameter',
    characteristics: 'Well-defined borders, heterogeneous appearance'
  };

  constructor(private aiService: AiService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'doctor', text: this.userInput });

    this.aiService.sendMessageWithFiles(this.userInput, this.selectedFiles).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'assistant', text: res.message });
        this.userInput = '';
        this.selectedFiles = [];
      },
      error: (err) => {
        this.messages.push({ sender: 'assistant', text: 'Error fetching response.' });
        console.error(err);
      }
    });
  }
}
