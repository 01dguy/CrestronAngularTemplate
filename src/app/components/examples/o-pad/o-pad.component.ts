import { Component, Input } from '@angular/core';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-o-pad-example',
  templateUrl: './o-pad.component.html',
  styleUrl: './o-pad.component.scss'
})
export class OPadExampleComponent {
   // Use the @Input decorator to append this string to join name.
   @Input() join: string = 'MediaControl.Dpad';

   // Digital presses with 100ms pulse.
   press(direction: string): void {
    CrComLib.pulseDigital(`${this.join}${direction}Press`, 100);
  }
 }
