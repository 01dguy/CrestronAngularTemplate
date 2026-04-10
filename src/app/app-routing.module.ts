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
  // Keep legacy route name working for existing control programs.
  { path: 'main-page', redirectTo: 'media-page', pathMatch: 'full' },
  { path: 'security-page', component: SecurityPageComponent },
  { path: 'lighting-page', component: LightingPageComponent },
  { path: 'shades-page', component: ShadesPageComponent },
  { path: 'cameras-page', component: CamerasPageComponent },
  { path: '**', component: HomePageComponent },
];

@NgModule({
  // Disabled to avoid startup navigation issues seen on TS-1070 panels.
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule implements OnDestroy { 

  // CrComLib subscription IDs used for cleanup in ngOnDestroy.
  mainPageVisibilitySubscription!: string;
  homePageVisibilitySubscription!: string;
  securityPageVisibilitySubscription!: string;
  lightingPageVisibilitySubscription!: string;
  shadesPageVisibilitySubscription!: string;
  camerasPageVisibilitySubscription!: string;

  public constructor(private router: Router, private ngZone: NgZone, private titleService: TitleService ) {

    // Route changes are driven by feedback joins from the control system.
    this.homePageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.HomePageVisibilityJoin',
      (state: boolean) => {
        // Joins are pulsed; only true edges are meaningful here.
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the home page.'
          );
          this.navigate('home');
        }
      }
    );

    this.mainPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.MainPageVisibilityJoin',
      (state: boolean) => {
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the main page.'
          );
          this.navigate('media-page');
        }
      }
    );

    this.securityPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.SecurityPageVisibilityJoin',
      (state: boolean) => {
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the security page.'
          );
          this.navigate('security-page');
        }
      }
    );

    this.lightingPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.LightingPageVisibilityJoin',
      (state: boolean) => {
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the lighting page.'
          );
          this.navigate('lighting-page');
        }
      }
    );

    this.shadesPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.ShadesPageVisibilityJoin',
      (state: boolean) => {
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the shades page.'
          );
          this.navigate('shades-page');
        }
      }
    );

    this.camerasPageVisibilitySubscription = CrComLib.subscribeState(
      'b',
      'HeaderBar.CamerasPageVisibilityJoin',
      (state: boolean) => {
        if (state) {
          console.log(
            'Info -> The control system has requested we navigate to the cameras page.'
          );
          this.navigate('cameras-page');
        }
      }
    );

    // Show a default view when the control system is offline at startup.
    this.navigate('home');
  }

  public navigate(path: string) {
    // Force navigation back into Angular's zone from CrComLib callbacks.
    this.ngZone.run(() =>
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
