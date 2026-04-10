import {
  Component,
  OnDestroy,
  OnInit,
  NgZone,
  signal,
  computed,
} from '@angular/core';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrl: './volume.component.scss',
})
export class VolumeComponent implements OnInit, OnDestroy {
  // Boolean to hold mute state
  mute = signal(false);
  // Subscription string for mute state
  muteSubscription!: string;

  // Signal to hold volume level
  level = signal(0);
  // Scale the level from 0-65535 to 0-100 for the gauge height.
  gaugeHeight = computed(() => this.level() / 655.35 + '%');

  // Subscription string for volume level
  levelSubscription!: string;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Subscribe to mute state
    this.muteSubscription = CrComLib.subscribeState(
      'b',
      'MainPage.MutedFeedbackVisibility',
      (mute: boolean) => {
        this.ngZone.run(() => this.mute.set(mute));
        console.log('The mute state is: ' + mute);
      }
    );
    // Subscribe to volume level
    this.levelSubscription = CrComLib.subscribeState(
      'n',
      'MainPage.VolumeBarFB',
      (level: number) => {
        this.ngZone.run(() => this.level.set(level));
        console.log('The volume level is: ' + level);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from mute state
    CrComLib.unsubscribeState(
      'b',
      'MainPage.MutedFeedbackVisibility',
      this.muteSubscription
    );

    // Unsubscribe from volume level
    CrComLib.unsubscribeState(
      'n',
      'MainPage.VolumeBarFB',
      this.levelSubscription
    );
  }

  RampUp(state: boolean): void {
    CrComLib.setDigital('MainPage.VolumeButtonList.VolumeUpPress', state);
  }

  RampDown(state: boolean): void {
    CrComLib.setDigital('MainPage.VolumeButtonList.VolumeDownPress', state);
  }
  // Function to toggle mute
  MuteToggle(): void {
    CrComLib.pulseDigital('MainPage.VolumeButtonList.VolumeMutePress');
  }
}
