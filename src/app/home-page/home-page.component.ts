import { Component } from '@angular/core';
import { FadeInOutAnimation } from '../animations/animations';
import { TitleBarComponent } from '../components/title-bar/title-bar.component';
import { TitleService } from '../services/title/title.service';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    TitleBarComponent
  ],
  animations: [FadeInOutAnimation],
})
export class HomePageComponent {

  constructor(private titleService: TitleService) { }

  // Pulses the join that tells the control system which page to show.
  press(page: string): void {
    CrComLib.pulseDigital(`HeaderBar.${page}PageVisibilityJoin`, 100);
    // Keep title-bar controls in sync with page context.
    this.titleService.setCurrentPageVisibility(page, true); 
    this.titleService.setCurrentPageVisibility('Home', false);
  }

}
