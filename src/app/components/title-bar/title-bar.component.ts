import { Component, OnDestroy, OnInit, NgZone, signal, computed } from '@angular/core';
/* The WeatherComponent is used to display the Weather widget */
import { WeatherComponent } from '../weather/weather.component';
/* The TitleService is used to manage the visibility of the title bar elements */
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
    CommonModule, // for *ngIf
    RoomListComponent,
    MenuComponent
  ],
  animations: [FadeInOutAnimation],
})
export class TitleBarComponent implements OnInit, OnDestroy{
  isMainPageVisible: boolean = false; // For showing power button only when Main page is visible.
  isHomePageVisible: boolean = true; // For hiding back arrow button on Home page.

  constructor(private ngZone: NgZone, private titleService: TitleService) {
    
  }

  //pageSubscription!: string;
  pageSubscription: string = '';
  page = signal('');
  
  ngOnInit(): void {
    /* Subscribe to the page join for indirect text */
    this.pageSubscription = CrComLib.subscribeState(
      's',
      'HeaderBar.PageNameText', // Page Name from SIMPL
      (page: string) => {
        console.log('Info -> Received the page name: ' + page);
        this.ngZone.run(() => this.page.set(page));
      }
    );

    // Ensure isMainPageVisible and isHomePageVisible are updated correctly
    // Default to true for isHomePageVisible if the value is undefined
    this.titleService.pageVisibility$.subscribe(pageVisibility => {
      this.isMainPageVisible = pageVisibility['Main'] || false;
      this.isHomePageVisible = pageVisibility.hasOwnProperty('Home') ? pageVisibility['Home'] : true;
      console.log('isMainPageVisible:', this.isMainPageVisible); //debug
      console.log('isHomePageVisible:', this.isHomePageVisible); //debug
    });
  }

  ngOnDestroy(): void {
    /* Unsubscribe from the page join when the component is destroyed */
   CrComLib.unsubscribeState(
    's',
    'HeaderBar.PageNameText',
    this.pageSubscription
   );
  }

  powerClicked(): void {
    console.log('Info -> The power button has been pressed');
    CrComLib.pulseDigital('HeaderBar.PowerButtonPress', 100); // 100ms pulse
  }

  returnClicked(): void {
    console.log('Info -> The return button has been pressed');
    CrComLib.pulseDigital('HeaderBar.HomePageVisibilityJoin', 100); // For title-bar text
    // Trying to get this to work in the routing module
    this.titleService.setCurrentPageVisibility('Main', false);
    this.titleService.setCurrentPageVisibility('Home', true);
  }

  // Menu Modal Popup. See if this is still needed.
  public open(): void {
    console.log('Info -> The menu button has been pressed');
  }

 }