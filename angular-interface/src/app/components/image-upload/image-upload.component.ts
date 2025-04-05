import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: 'image-upload.component.html',
  styleUrls:  ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() patientId: string = '';
  @Output() analysisComplete = new EventEmitter<any>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  isUploading = false;

  constructor(private aiService: AiService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.patientId) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (!this.patientId) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    this.selectedFile = file;

    // Create file preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  resetFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  uploadFile() {
    if (!this.selectedFile || !this.patientId) return;

    this.isUploading = true;

    this.aiService.uploadImage(this.selectedFile, this.patientId).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.analysisComplete.emit(response.modelResults);

        // Keep the image but clear the actions
        setTimeout(() => {
          this.resetFile();
        }, 1000);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.isUploading = false;
        alert('Error uploading and analyzing image');
      }
    });
  }
}
