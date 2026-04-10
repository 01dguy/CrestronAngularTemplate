import { NgModule, NgZone, OnDestroy } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { SecurityPageComponent } from './security-page/security-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MediaPageComponent } from './media-page/media-page.component';
import { LightingPageComponent } from './lighting-page/lighting-page.component';
import { ShadesPageComponent } from './shades-page/shades-page.component';
import { CamerasPageComponent } from './cameras-page/cameras-page.component';
import { TitleService } from './services/title/title.service';

declare var CrComLib: CrComLib;

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'media-page', component: MediaPageComponent },
  // Backward-compatible alias for existing control-system logic.
  { path: 'main-page', redirectTo: 'media-page', pathMatch: 'full' },
  { path: 'security-page', component: SecurityPageComponent },
  { path: 'lighting-page', component: LightingPageComponent },
  { path: 'shades-page', component: ShadesPageComponent },
  { path: 'cameras-page', component: CamerasPageComponent },
  { path: '**', component: HomePageComponent },
];

@NgModule({
  // The initialNavigation option is set to disabled to prevent the application from navigating to the home page when it starts.
  // This causes issues on the Crestron TS-1070 touch panels when enabled.
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule implements OnDestroy { 

  // Property declarations with non-null assertion operators
  mainPageVisibilitySubscription!: string;
  homePageVisibilitySubscription!: string;
  securityPageVisibilitySubscription!: string;
  lightingPageVisibilitySubscription!: string;
  shadesPageVisibilitySubscription!: string;
  camerasPageVisibilitySubscription!: string;

  public constructor(private router: Router, private ngZone: NgZone, private titleService: TitleService ) {

    // Subscribe to the home page visibility join to listen for changes.
    this.homePageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.HomePageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the start page.
        // We're not interested in the false state as the control system is only pulsing the join.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the home page.'
          );
          // Navigate to the start page.
          this.navigate('home');
        }
      }
    );

    // Subscribe to the main page visibility join to listen for changes.
    this.mainPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.MainPageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the main page.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the main page.'
          );
          // Navigate to the main page.
          this.navigate('media-page');
        }
      }
    );

    // Subscribe to the security page visibility join to listen for changes.
    this.securityPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.SecurityPageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the security page.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the security page.'
          );
          // Navigate to the security page.
          this.navigate('security-page');
        }
      }
    );

    // Subscribe to the lighting page visibility join to listen for changes.
    this.lightingPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.LightingPageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the lighting page.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the lighting page.'
          );
          // Navigate to the lighting page.
          this.navigate('lighting-page');
        }
      }
    );

    // Subscribe to the shades page visibility join to listen for changes.
    this.shadesPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.ShadesPageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the shades page.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the shades page.'
          );
          // Navigate to the shades page.
          this.navigate('shades-page');
        }
      }
    );

    // Subscribe to the cameras page visibility join to listen for changes.
    this.camerasPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.CamerasPageVisibilityJoin',
      (state: boolean) => {
        // If the state is true, navigate to the cameras page.
        if (state) {
          // Log the navigation to the console.
          console.log(
            'Info -> The control system has requested we navigate to the cameras page.'
          );
          // Navigate to the cameras page.
          this.navigate('cameras-page');
        }
      }
    );

    // This ensures that a page will be displayed even if the control system is offline.
    // Navigate to the home page when the application starts.
    this.navigate('home');
  }

  // The navigate function is used to navigate to a specific route.
  public navigate(path: string) {
    // Use the ngZone to run the navigation inside of the Angular zone.
    this.ngZone.run(() =>
      // Navigate to the route.
      this.router.navigate([path], { skipLocationChange: true })
    );
  }

  public ngOnDestroy(): void {
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.HomePageVisibilityJoin',
      this.homePageVisibilitySubscription
    );
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.MainPageVisibilityJoin',
      this.mainPageVisibilitySubscription
    );
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.SecurityPageVisibilityJoin',
      this.securityPageVisibilitySubscription
    );
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.LightingPageVisibilityJoin',
      this.lightingPageVisibilitySubscription
    );
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.ShadesPageVisibilityJoin',
      this.shadesPageVisibilitySubscription
    );
    CrComLib.unsubscribeState(
      'b',
      'HeaderBar.CamerasPageVisibilityJoin',
      this.camerasPageVisibilitySubscription
    );
  }

}
