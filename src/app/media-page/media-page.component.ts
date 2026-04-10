import { Component, OnDestroy, OnInit, signal, NgZone, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // for *ng
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
  GlobalSource4,    // Source 5
  GlobalSource5,    // Source 6
}

@Component({
  standalone: true,
  selector: 'app-media-page',
  templateUrl: './media-page.component.html',
  styleUrl: './media-page.component.scss',
  imports: [
    CommonModule, // for *ng
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
export class MediaPageComponent implements OnInit, OnDestroy {

  // Declare the Source enum.
  Source = Source;

  // Declare the Off source for SourceService.
  offSource: Source = Source.None;

  // The number of sources we are displaying.
  readonly Sources = 4;

  source = signal(Source.None);

  // Declare the sourceSubscription array.
  sourceSubscription: string[] = new Array(6);

  // Declare the noneSourceSubscription for Source.None.
  noneSourceSubscription: string = '';

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

    // Add subscription for Source.None testing.
    this.noneSourceSubscription = CrComLib.subscribeState(
      'b',
      `MainPage.SourceList.NoneSelectedFB`,
      (state: boolean) => {
        // If the state is true, set the source to Source.None
        if (state) {
          this.ngZone.run(() => this.source.set(Source.None));
          console.log('Info -> main-page -> No source is selected.');
        }
      }
    );
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.Sources; i++) {
      CrComLib.unsubscribeState(
        'b',
        // Our list is 1 based, so we add 1 to the index.
        `MainPage.SourceList.Source${i + 1}FB`,
        this.sourceSubscription[i]
      );
    }

    // Unsubscribe the Source.None subscription for testing
    CrComLib.unsubscribeState(
      'b',
      `MainPage.SourceList.NoneSelectedFB`,
      this.noneSourceSubscription
    );
  }

  getSource(): Source {
    // Check if no source is selected
    if (this.source() === Source.None) {
      return Source.None;
    }
    return this.source();
  }

  // Method to get the current source text based on the source.
  // Modify this appropriately for your system.
  getCurrentSourceText(): string {
    switch (this.source()) {
      case Source.AirMedia:
        return 'AirMedia';
      case Source.AppleTV:
        return 'Apple TV';
      case Source.NvxInfo:
        return 'NVX Info';
      case Source.Stb:
        return 'STB';
      case Source.None:
        return 'No Source Selected';  
      default:
        return 'No Source Selected';
    }
  }
  // Old way of getting the current source.
  // Method to get the current source
  // getSource(): Source {
  //   return this.source();
  // }
}
