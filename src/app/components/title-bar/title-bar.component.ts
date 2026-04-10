import { Component, OnDestroy, OnInit, NgZone, signal, computed } from '@angular/core';
import { WeatherComponent } from '../weather/weather.component';
import { TitleService } from '../../services/title/title.service';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from '../room-list/room-list.component';
import { MenuComponent } from '../menu/menu.component';
import { FadeInOutAnimation } from '../../animations/animations';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.scss',
  imports: [
    WeatherComponent,
    CommonModule,
    RoomListComponent,
    MenuComponent
  ],
  animations: [FadeInOutAnimation],
})
export class TitleBarComponent implements OnInit, OnDestroy{
  // Used by template to control power/back button visibility.
  isMainPageVisible: boolean = false;
  isHomePageVisible: boolean = true;

  constructor(private ngZone: NgZone, private titleService: TitleService) {}

  // CrComLib subscription ID for page-name serial.
  pageSubscription: string = '';
  page = signal('');
  
  ngOnInit(): void {
    // Updates page title text shown in the header.
    this.pageSubscription = CrComLib.subscribeState(
      's',
      'HeaderBar.PageNameText',
      (page: string) => {
        console.log('Info -> Received the page name: ' + page);
        this.ngZone.run(() => this.page.set(page));
      }
    );

    // Keeps header controls aligned with current page context.
    this.titleService.pageVisibility$.subscribe(pageVisibility => {
      this.isMainPageVisible = pageVisibility['Main'] || false;
      this.isHomePageVisible = pageVisibility.hasOwnProperty('Home') ? pageVisibility['Home'] : true;
      console.log('isMainPageVisible:', this.isMainPageVisible); //debug
      console.log('isHomePageVisible:', this.isHomePageVisible); //debug
    });
  }

  ngOnDestroy(): void {
    CrComLib.unsubscribeState(
      's',
      'HeaderBar.PageNameText',
      this.pageSubscription
    );
  }

  powerClicked(): void {
    console.log('Info -> The power button has been pressed');
    CrComLib.pulseDigital('HeaderBar.PowerButtonPress', 100);
  }

  returnClicked(): void {
    console.log('Info -> The return button has been pressed');
    // Reuses the same join the home button uses in the control program.
    CrComLib.pulseDigital('HeaderBar.HomePageVisibilityJoin', 100);
    this.titleService.setCurrentPageVisibility('Main', false);
    this.titleService.setCurrentPageVisibility('Home', true);
  }

  public open(): void {
    console.log('Info -> The menu button has been pressed');
  }

 }
