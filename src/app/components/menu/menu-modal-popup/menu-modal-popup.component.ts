import { Component, signal, Input, OnInit, OnDestroy } from '@angular/core';
import { FadeInOutAnimation } from '../../../animations/animations';
import { ThemeService } from '../../../services/theme/theme.service'; // For storing the theme

declare var CrComLib: CrComLib;

// Define the interface for theme variables
interface ThemeVariables {
  '--background': string;
  '--button-background': string;
  '--button-background-active': string;
  '--button-background-selected': string;
  '--background-image'?: string; // Optional property
}

// Define the interface for the theme configuration object
interface ThemeConfig {
  [key: string]: ThemeVariables;
}

@Component({
  standalone: true,
  selector: 'app-menu-modal-popup',
  templateUrl: './menu-modal-popup.component.html',
  styleUrl: './menu-modal-popup.component.scss',
  imports: [],
  animations: [FadeInOutAnimation],
})
export class MenuModalPopupComponent implements OnInit, OnDestroy {

  active = signal(false);

  currentTheme: string;

  // Handle for the timeout
  timerHandle!: any;

  ipAddress: string = '';
  ipSubscription: string = '';

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit(): void {
    // Clear the timer when the component is destroyed.
    clearTimeout(this.timerHandle);
    // Set the default theme
    this.applyTheme(this.currentTheme);
    this.subscribeToIpAddress();
  }

  ngOnDestroy(): void {
    // Clear the timer when the component is destroyed.
    clearTimeout(this.timerHandle);
    if (this.ipSubscription) {
      CrComLib.unsubscribeState('s', 'System.IPAddress', this.ipSubscription);
    }
  }

  public open() {
    this.active.set(true);
    clearTimeout(this.timerHandle);
    this.timerHandle = setTimeout(() => this.close(), 30000); // 30 seconds
    console.log('MenuModalPopupComponent.open()');
  }

  public close() {
    this.active.set(false);
    clearTimeout(this.timerHandle);
  }

  /********************** Theme Programming *****************************/

  // Method to set the theme
  setTheme(theme: string): void {
    this.currentTheme = `theme-${theme}`;
    this.themeService.setTheme(this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  // Helper method to apply the theme. Modify and create new themes here.
  private applyTheme(theme: string): void {
    const themeVariables: ThemeConfig = {
      'theme-light': {
        '--background': 'white',
        '--button-background': 'rgb(0, 153, 255)',
        '--button-background-active': 'rgb(0, 115, 191)',
        '--button-background-selected': 'rgb(0, 115, 191)',
        '--background-image': `url('./assets/images/backgrounds/background.webp')`
      },
      'theme-dark': {
        '--background': 'black',
        '--button-background': 'rgb(51, 51, 51, 0.75)',
        '--button-background-active': 'rgb(26, 25, 25, 0.75)',
        '--button-background-selected': 'rgb(26, 25, 25, 0.75)',
        '--background-image': `url('./assets/images/backgrounds/Black-Slate.jpg')`
      },
      'theme-blue': {
        '--background': 'rgb(70, 92, 217)',
        '--button-background': 'rgb(0, 0, 255)',
        '--button-background-active': 'rgb(0, 0, 139)',
        '--button-background-selected': 'rgb(0, 0, 139)',
      }
    };

    // Apply the theme variables to the document's root element
    const variables: ThemeVariables = themeVariables[theme];
    for (const [key, value] of Object.entries(variables) as [keyof ThemeVariables, string][]) {
      document.documentElement.style.setProperty(key, value);
    }

    // Clear the background image if the new theme does not have one
    if (!variables['--background-image']) {
      document.documentElement.style.setProperty('--background-image', 'none');
    }
  }

  /********************** End Theme Programming *****************************/

  // Subscribe to the IP address signal from CrComLib
  subscribeToIpAddress() {
    this.ipSubscription = CrComLib.subscribeState('s', 'System.IPAddress', (ip: string) => {
      this.ipAddress = ip || 'Unavailable';
    });
  }
}
