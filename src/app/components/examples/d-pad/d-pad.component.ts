import { Component } from '@angular/core';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-d-pad-example',
  templateUrl: './d-pad.component.html',
  styleUrl: './d-pad.component.scss',
})

export class DPadExampleComponent {
  // This has been modified to use join numbers instead of strings.
  // @Input() join: string = 'MediaControl.Dpad'; 

  /** Pulse up digital join for 100ms */
  up(): void {
    CrComLib.pulseDigital('3', 100);
  }
  /** Pulse down digital join for 100ms */
  down(): void {
    CrComLib.pulseDigital('4', 100);
  }
  /** Pulse left digital join for 100ms */
  left(): void {
    CrComLib.pulseDigital('5', 100);
  }
  /** Pulse right digital join for 100ms */
  right(): void {
    CrComLib.pulseDigital('6', 100);
  }
  /** Pulse center join for 100ms */
  center(): void {
    CrComLib.pulseDigital('7', 100);
  }
}
