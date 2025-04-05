import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    NgClass,
    FormsModule
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';
  @Input() analysisResults!: any;
  @Input() patientId!: any;

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add doctor's message
    this.messages.push({ sender: 'doctor', text: this.userInput });

    const sentText = this.userInput;
    this.userInput = '';

    // Mock bot response (simulate API call)
    setTimeout(() => {
      this.messages.push({
        sender: 'assistant',
        text: `You said: "${sentText}". Here's a sample response.`
      });
    }, 500);
  }
}
