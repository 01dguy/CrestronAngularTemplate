import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common'; // added this to replace base href in index.html
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Importing global helpers to assist with the CrComLib.
import './helpers/CrComLibHelpers';
// Component imports here
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { SystemMessageComponent } from './popups/system-message/system-message.component';
import { StbComponent } from './popups/stb/stb.component'; // Testing
import { AppleTvComponent } from './popups/apple-tv/apple-tv.component'; // Testing
// Page Component imports here
import { HomePageComponent } from './home-page/home-page.component';
import { SecurityPageComponent } from './security-page/security-page.component';
import { MediaPageComponent } from './media-page/media-page.component';
import { LightingPageComponent } from './lighting-page/lighting-page.component';
import { ShadesPageComponent } from './shades-page/shades-page.component';
import { CamerasPageComponent } from './cameras-page/cameras-page.component';
import { TestSecurityComponent } from './test-security/test-security.component';
import { MenuModalPopupComponent } from "./components/menu/menu-modal-popup/menu-modal-popup.component";

@NgModule({
  declarations: [AppComponent, TestSecurityComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TitleBarComponent,
    SystemMessageComponent,
    MediaPageComponent,
    HomePageComponent,
    SecurityPageComponent,
    LightingPageComponent,
    ShadesPageComponent,
    CamerasPageComponent,
    StbComponent, // Testing
    AppleTvComponent,
    MenuModalPopupComponent
],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/'}, // added this to replace base href in index.html
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // added for ch5-components
  bootstrap: [AppComponent], // The AppComponent is the root component of the application.
  exports: []
})
export class AppModule { }

// This is the unmodified app.module.ts file. See Angular_Example for the modified XPanel version.
// Use modified app-routing.module.ts before trying to use the modified version of ths.
