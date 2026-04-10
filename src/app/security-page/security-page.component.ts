import { Component } from '@angular/core';
import { FadeInOutAnimation } from '../animations/animations';
import { TitleBarComponent } from '../components/title-bar/title-bar.component';

@Component({
  standalone: true,
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrl: './security-page.component.scss',
  imports: [
    TitleBarComponent
  ],
  animations: [FadeInOutAnimation],
})
export class SecurityPageComponent {


}
