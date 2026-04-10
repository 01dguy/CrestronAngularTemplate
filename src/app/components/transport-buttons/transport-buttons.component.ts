import { Component, Input } from '@angular/core';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-transport-buttons',
  templateUrl: './transport-buttons.component.html',
  styleUrl: './transport-buttons.component.scss'
})
export class TransportButtonsComponent {

  @Input() join: string = 'MediaControl.';
  
  /** Method for handling button presses **/
  press(transport: string): void {
    CrComLib.pulseDigital(`${this.join}${transport}ButtonPress`, 100); // Pulse the digital join for 100ms
  }

  /* The above code translates to (MediaControl.PlayButtonPress, 100) for the play, pause, etc.
     This is prefered to having individual methods for each button press. */

}
