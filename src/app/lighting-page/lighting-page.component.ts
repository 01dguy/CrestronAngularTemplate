import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FadeInOutAnimation } from '../animations/animations';
import { TitleBarComponent } from '../components/title-bar/title-bar.component';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-lighting-page',
  templateUrl: './lighting-page.component.html',
  styleUrl: './lighting-page.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    //TitleBarComponent
  ],
  animations: [FadeInOutAnimation],
})
export class LightingPageComponent {
  rooms = Array.from({ length: 9 }, (_, i) => ({ name: `Room ${i + 1}`, on: false }));
  private roomNameSubscriptions: string[] = [];

  ngOnInit(): void {
    // Subscribe to SIMPL room name signals
    for (let i = 0; i < this.rooms.length; i++) {
      const join = `Zones.Room${i + 1}Name`;
      this.roomNameSubscriptions[i] = CrComLib.subscribeState('s', join, (name: string) => {
        this.rooms[i].name = name || `Room ${i + 1}`;
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all room name signals
    for (let i = 0; i < this.rooms.length; i++) {
      const join = `Zones.Room${i + 1}Name`;
      CrComLib.unsubscribeState('s', join, this.roomNameSubscriptions[i]);
    }
  }
}
