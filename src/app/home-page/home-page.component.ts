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

  /** Page Selection **/
  press(page: string): void {
    // Trigger for router
    CrComLib.pulseDigital(`HeaderBar.${page}PageVisibilityJoin`, 100);
    // Set page visibility service for displaying appropriate elements in title-bar.
    this.titleService.setCurrentPageVisibility(page, true); 
    this.titleService.setCurrentPageVisibility('Home', false); // Show the back arrow
  }

}
