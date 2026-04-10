import { Component } from '@angular/core';
import { FadeInOutAnimation } from '../animations/animations';
import { TitleBarComponent } from '../components/title-bar/title-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-cameras-page',
  templateUrl: './cameras-page.component.html',
  styleUrl: './cameras-page.component.scss',
  imports: [
    TitleBarComponent,
    CommonModule, // for *ngIf and other common directives
  ],
  animations: [FadeInOutAnimation],
})
export class CamerasPageComponent {
  cameras = [
    { rtspUrl: 'rtsp://192.168.5.159:8554/teststream' },
    { rtspUrl: 'rtsp://192.168.1.102/stream1' },
    { rtspUrl: 'rtsp://192.168.1.103/stream1' },
    { rtspUrl: 'rtsp://192.168.1.104/stream1' },
    { rtspUrl: 'rtsp://192.168.1.105/stream1' },
    { rtspUrl: 'rtsp://192.168.1.106/stream1' },
    { rtspUrl: 'rtsp://192.168.1.107/stream1' },
    { rtspUrl: 'rtsp://192.168.1.108/stream1' },
    { rtspUrl: 'rtsp://192.168.1.109/stream1' },
  ];
  modalOpen = false;
  selectedCameraIndex: number = 0;

  private touchStartY: number | null = null;
  private touchEndY: number | null = null;

  openCameraModal(index: number) {
    this.selectedCameraIndex = index;
    this.modalOpen = true;
  }

  closeCameraModal() {
    this.modalOpen = false;
  }

  onModalTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.touchEndY = null;
  }

  onModalTouchMove(event: TouchEvent) {
    this.touchEndY = event.touches[0].clientY;
    // Prevent scrolling while swiping
    event.preventDefault();
  }

  onModalTouchEnd() {
    if (
      this.touchStartY !== null &&
      this.touchEndY !== null &&
      Math.abs(this.touchStartY - this.touchEndY) > 80 // swipe up OR down
    ) {
      this.closeCameraModal();
    }
    this.touchStartY = null;
    this.touchEndY = null;
  }
}
