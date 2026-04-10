import { Component, NgZone, signal } from '@angular/core';
import { FadeInOutAnimation } from '../../animations/animations';
import { SourceService } from '../../services/source/source.service';
import { Source } from '../../media-page/media-page.component';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-power-confirm',
  templateUrl: './power-confirm.component.html',
  styleUrl: './power-confirm.component.scss',
  animations: [FadeInOutAnimation],
})
export class PowerConfirmComponent {
  // Bound to popup visibility in the template.
  visible = signal(false);
  // CrComLib subscription ID for popup visibility feedback.
  visibilitySubscrption!: string;
  // Auto-dismiss timer handle.
  timerHandle: any;

  constructor(private ngZone: NgZone, private sourceService: SourceService) {}

  ngOnInit(): void {
    // Open/close the popup based on control-system feedback.
    this.visibilitySubscrption = CrComLib.subscribeState(
      'b',
      'MainPage.PowerOffPopUpVisibility',
      (state: boolean) => {
        console.log('Power On / Off Visibility: ' + state);
        this.ngZone.run(() => this.visible.set(state));
        this.ToggleTimeout(state);
      }
    );
  }

  ngOnDestroy(): void {
    CrComLib.unsubscribeState(
      'b',
      'MainPage.PowerOffPopUpVisibility',
      this.visibilitySubscrption
    );
    clearTimeout(this.timerHandle);
  }

  // Auto-triggers "No" if no user action occurs within 10 seconds.
  ToggleTimeout(state: boolean) {
    if (state) {
      this.timerHandle = setTimeout(() => {
        this.No();
      }, 10000);
    } else {
      clearTimeout(this.timerHandle);
    }
  }

  // Confirm power-off.
  Yes(): void {
    CrComLib.pulseDigital('PowerPopUp.YesButtonPress', 100);

    // Clear source UI so subpages are hidden after shutdown.
    this.sourceService.changeSource(Source.None);
  }

  // Dismiss power-off.
  No(): void {
    CrComLib.pulseDigital('PowerPopUp.NoButtonPress', 100);
  }

  // Trigger whole-house off.
  AllOff(): void {
    CrComLib.pulseDigital('PowerPopUp.WholehouseOffPress', 100);

    this.sourceService.changeSource(Source.None);
  }
}
