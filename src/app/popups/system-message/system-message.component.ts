import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // for *ng

@Component({
  standalone: true,
  selector: 'app-system-message',
  templateUrl: './system-message.component.html',
  styleUrls: ['./system-message.component.scss'],
  imports: [CommonModule], // for *ng
})
export class SystemMessageComponent implements OnInit {
  message: string = '';
  visible: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  showMessage(message: string): void {
    this.message = message;
    this.visible = true;
    setTimeout(() => this.close(), 8000); // Auto-close after 8 seconds
  }

  close(): void {
    this.visible = false;
  }
}
