import { Component, OnDestroy, OnInit, signal, NgZone, NgModule } from '@angular/core';
import { FadeInOutAnimation } from '../animations/animations';

// The AirMediaComponent is used to display the AirMedia popup.
import { AirmediaComponent } from '../popups/airmedia/airmedia.component';
// The AppleTvComponent is used to display the Apple TV popup.
import { AppleTvComponent } from '../popups/apple-tv/apple-tv.component';
// The NvxInfoComponent is used to display the NvxInfo popup.
import { NvxInfoComponent } from '../popups/nvx-info/nvx-info.component';
// The PowerConfirmComponent is used to display the PowerConfirm popup.
import { PowerConfirmComponent } from '../popups/power-confirm/power-confirm.component';
// The SourceListComponent is used to display the SourceList widget.
import { SourceListComponent } from '../components/source-list/source-list.component';
// The TitleBarComponent is used to display the TitleBar widget.
import { TitleBarComponent } from '../components/title-bar/title-bar.component';
// The VolumeComponent is used to display the Volume widget.
import { VolumeComponent } from '../components/volume/volume.component';
// Service added to modify the source on a power off event.
import { SourceService } from '../services/source/source.service';
// Used for new Footer Volume widget.
import { VolumeFooterComponent } from '../components/volume-footer/volume-footer.component';
// Set Top Box Component
import { StbComponent } from '../popups/stb/stb.component';

declare var CrComLib: CrComLib;

// These declare the Source.name to be used in the Switch/Case statement for page selection.
// These also determine the order of the sources in the SourceList.
export enum Source {
  None = -1,
  AirMedia,         // Source 1
  AppleTV,          // Source 2
  NvxInfo,          // Source 3
  Stb,              // Source 4
  GlobalSource4,
  GlobalSource5,
}

@Component({
  standalone: true,
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  imports: [
    AirmediaComponent,
    AppleTvComponent,
    NvxInfoComponent,
    PowerConfirmComponent,
    SourceListComponent,
    //TitleBarComponent,
    //VolumeComponent,
    VolumeFooterComponent,
    StbComponent,
  ],
  animations: [FadeInOutAnimation],
})
export class MainPageComponent implements OnInit, OnDestroy {

  // Declare the Source enum.
  Source = Source;

  // Declare the Off source for SourceService.
  offSource: Source = Source.None;

  // The number of sources we are displaying.
  readonly Sources = 6;

  source = signal(Source.None);

  // Declare the sourceSubscription array.
  sourceSubscription: string[] = new Array(6);

  constructor(private ngZone: NgZone, private sourceService: SourceService) {} // SourceService added to constructor

  ngOnInit(): void {
    // Subscribe to currentSource from the SourceService.
    this.sourceService.currentSource.subscribe(source => {
      this.ngZone.run(() => {
        this.offSource = source;
        this.source.set(source);
      });
    });

    for (let i = 0; i < this.Sources; i++) {
      this.sourceSubscription[i] = CrComLib.subscribeState(
        'b',
        // Our list is 1 based, so we add 1 to the index.
        `MainPage.SourceList.Source${i + 1}FB`,
        (state: boolean) => {
          // If the state is false, return as we are going to convert positive states to the Source enum.
          if(!state) return;
          this.ngZone.run(() => this.source.set(i));
          console.log('Info -> main-page -> The source is now: ' + Source[this.source()]);
        }
      );
    }
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.Sources; i++) {
      CrComLib.unsubscribeState(
        'b',
        // Our list is 1 based, so we add 1 to the index.
        `MainPage.SourceList.Source${i + 1}FB`, // This was Selected instead of ItemSelected??
        this.sourceSubscription[i]
      );
    }
  }
}
