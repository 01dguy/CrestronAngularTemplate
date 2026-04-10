import { Component, NgZone, signal } from '@angular/core';
import { FadeInOutAnimation } from '../../animations/animations';
// Service added to modify the source on a power off event.
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
  // Visibility state of the component
  visible = signal(false);
  // Subscription to the visibility state
  visibilitySubscrption!: string;
  // Handle for the timeout
  timerHandle: any;

  // SourceService is injected to change the source on a power off event.
  constructor(private ngZone: NgZone, private sourceService: SourceService) {}

  // ngOnInit lifecycle hook
  ngOnInit(): void {
    // Subscribe to the visibility state
    this.visibilitySubscrption = CrComLib.subscribeState(
      'b',
      'MainPage.PowerOffPopUpVisibility',
      (state: boolean) => {
        console.log('Power On / Off Visibility: ' + state);
        // Run inside Angular's zone to trigger change detection
        this.ngZone.run(() => this.visible.set(state));
        // Toggle the timeout based on the state
        this.ToggleTimeout(state);
      }
    );
  }

  // ngOnDestroy lifecycle hook
  ngOnDestroy(): void {
    // Unsubscribe from the visibility state
    CrComLib.unsubscribeState(
      'b',
      'MainPage.PowerOffPopUpVisibility',
      this.visibilitySubscrption
    );
    // Clear the timeout
    clearTimeout(this.timerHandle);
  }

  // Method to toggle the timeout
  ToggleTimeout(state: boolean) {
    if (state) {
      // If the state is true, set a timeout to call the No method after 10 seconds
      this.timerHandle = setTimeout(() => {
        this.No();
      }, 10000);
    } else {
      // If the state is false, clear the timeout
      clearTimeout(this.timerHandle);
    }
  }

  // Method to handle the Yes action
  Yes(): void {
    // Pulse the Yes digital join.
    CrComLib.pulseDigital('PowerPopUp.YesButtonPress', 100);

    // Set the current Source.None to clear source pages.
    this.sourceService.changeSource(Source.None);
  }

  // Method to handle the No action
  No(): void {
    // Pulse the No digital join.
    CrComLib.pulseDigital('PowerPopUp.NoButtonPress', 100); // 100ms pulse
  }

  // Method to handle the AllOff action
  AllOff(): void {
    // Pulse the AllOff digital join.
    CrComLib.pulseDigital('PowerPopUp.WholehouseOffPress', 100); // 100ms pulse

    // Set the current Source.None to clear source pages.
    this.sourceService.changeSource(Source.None);
  }
}
