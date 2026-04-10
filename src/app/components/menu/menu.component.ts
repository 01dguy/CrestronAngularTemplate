import { Component, viewChild, signal } from '@angular/core';
import { FadeInOutAnimation } from '../../animations/animations';
import { MenuModalPopupComponent } from './menu-modal-popup/menu-modal-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [
    MenuModalPopupComponent,
    CommonModule
  ],
  animations: [FadeInOutAnimation]
})
export class MenuComponent {

  // Reference to the menu modal popup.
  popup = viewChild<MenuModalPopupComponent>('modalPopup'); 
  // Action to open the menu pop-out.
  visible = signal(true); // I have to make this true to work, but shouldn't have to.

  open() {
    this.popup()?.open();
  }

}
