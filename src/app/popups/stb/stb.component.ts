import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OPadExampleComponent } from '../../components/examples/o-pad/o-pad.component';
import { KeypadComponent } from '../../components/keypad/keypad.component';
import { TransportButtonsComponent } from '../../components/transport-buttons/transport-buttons.component';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-stb',
  templateUrl: './stb.component.html',
  styleUrl: './stb.component.scss',
  imports: [
    OPadExampleComponent,
    KeypadComponent,
    TransportButtonsComponent,
  ],
})
export class StbComponent implements OnInit, OnDestroy {

  constructor(private ngZone: NgZone) {}

  // ngOnInit lifecycle hook
  ngOnInit(): void {
  }

  // ngOnDestroy lifecycle hook
  ngOnDestroy(): void {
  }

}
