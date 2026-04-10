import { Component, Input } from '@angular/core';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrl: './keypad.component.scss'
})
export class KeypadComponent {

  @Input() join: string = 'MediaControl.Keypad';

  /** Keypad Presses **/
  press(key: string): void {
    CrComLib.pulseDigital(`${this.join}${key}Press`, 100); // Pulse the digital join for 100ms
  }

}
