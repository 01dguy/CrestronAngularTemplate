import { Component, OnDestroy, OnInit, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInOutAnimation } from '../animations/animations';

import { AirmediaComponent } from '../popups/airmedia/airmedia.component';
import { AppleTvComponent } from '../popups/apple-tv/apple-tv.component';
import { NvxInfoComponent } from '../popups/nvx-info/nvx-info.component';
import { PowerConfirmComponent } from '../popups/power-confirm/power-confirm.component';
import { SourceListComponent } from '../components/source-list/source-list.component';
import { SourceService } from '../services/source/source.service';
import { VolumeFooterComponent } from '../components/volume-footer/volume-footer.component';
import { StbComponent } from '../popups/stb/stb.component';

declare var CrComLib: CrComLib;

// Source order maps directly to SourceList joins and ngSwitch cases.
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
    CommonModule,
    AirmediaComponent,
    AppleTvComponent,
    NvxInfoComponent,
    PowerConfirmComponent,
    SourceListComponent,
    VolumeFooterComponent,
    StbComponent,
  ],
  animations: [FadeInOutAnimation],
})
export class MediaPageComponent implements OnInit, OnDestroy {
  Source = Source;

  // Tracks the most recent shared source value.
  offSource: Source = Source.None;

  // Number of active source joins to subscribe to.
  readonly Sources = 4;

  source = signal(Source.None);

  // Subscription IDs for Source{n} feedback joins.
  sourceSubscription: string[] = new Array(6);

  // Subscription ID for NoneSelected feedback join.
  noneSourceSubscription: string = '';

  constructor(private ngZone: NgZone, private sourceService: SourceService) {}

  ngOnInit(): void {
    // Keep local state in sync with cross-component source resets.
    this.sourceService.currentSource.subscribe(source => {
      this.ngZone.run(() => {
        this.offSource = source;
        this.source.set(source);
      });
    });

    for (let i = 0; i < this.Sources; i++) {
      this.sourceSubscription[i] = CrComLib.subscribeState(
        'b',
        `MainPage.SourceList.Source${i + 1}FB`,
        (state: boolean) => {
          // Convert true feedback edge into the matching enum value.
          if(!state) return;
          this.ngZone.run(() => this.source.set(i));
          console.log('Info -> main-page -> The source is now: ' + Source[this.source()]);
        }
      );
    }

    this.noneSourceSubscription = CrComLib.subscribeState(
      'b',
      `MainPage.SourceList.NoneSelectedFB`,
      (state: boolean) => {
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
        `MainPage.SourceList.Source${i + 1}FB`,
        this.sourceSubscription[i]
      );
    }

    CrComLib.unsubscribeState(
      'b',
      `MainPage.SourceList.NoneSelectedFB`,
      this.noneSourceSubscription
    );
  }

  getSource(): Source {
    // Explicitly keep None as the default/fallback source.
    if (this.source() === Source.None) {
      return Source.None;
    }
    return this.source();
  }

  // User-facing label for the active source panel.
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
}
