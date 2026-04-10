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

  // Modal reference for menu settings panel.
  popup = viewChild<MenuModalPopupComponent>('modalPopup'); 
  // Kept true so the menu trigger is always available.
  visible = signal(true);

  open() {
    this.popup()?.open();
  }

}
