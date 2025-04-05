import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./results.component.html`,
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() results: any = {};
}
