import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Load CrComLib helper extensions globally.
import './helpers/CrComLibHelpers';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { SystemMessageComponent } from './popups/system-message/system-message.component';
import { StbComponent } from './popups/stb/stb.component';
import { AppleTvComponent } from './popups/apple-tv/apple-tv.component';
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
    // Keep routing URLs rooted even though index.html uses base href="./" for CH5 hosting.
    { provide: APP_BASE_HREF, useValue: '/'},
  ],
  // Required for custom elements provided by CH5.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
