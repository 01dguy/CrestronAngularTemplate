import { Component } from '@angular/core';
import { FadeInOutAnimation } from '../animations/animations';
import { TitleBarComponent } from '../components/title-bar/title-bar.component';

@Component({
  standalone: true,
  selector: 'app-shades-page',
  templateUrl: './shades-page.component.html',
  styleUrl: './shades-page.component.scss',
  imports: [
    TitleBarComponent
  ],
  animations: [FadeInOutAnimation],
})
export class ShadesPageComponent {

}
