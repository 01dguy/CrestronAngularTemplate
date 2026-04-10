import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';

import { SourceButton } from '../../../models/sourcebutton';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-source-list',
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss',
})
export class SourceListComponent implements OnInit, OnDestroy {
  // Number of source buttons to render.
  @Input() sources = 0;

  // CrComLib subscription IDs for each source row.
  titleSubscription: string[] = new Array(this.sources);
  selectedSubscription: string[] = new Array(this.sources);

  // Template state for source button labels/selection.
  SourceButton!: WritableSignal<SourceButton[]>;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.SourceButton = signal(
      new Array(this.sources).fill(null).map(() => new SourceButton())
    );

    for (let i = 0; i < this.sources; i++) {
      this.titleSubscription[i] = CrComLib.subscribeState(
        's',
        `MainPage.SourceList.Source${i + 1}Text`,
        (title: string) => {
          console.log('Received a title for button: ' + title);
          this.updateSourceButton(i, 'title', title);
        }
      );

      this.selectedSubscription[i] = CrComLib.subscribeState(
        'b',
        `MainPage.SourceList.Source${i + 1}FB`,
        (state: boolean) => {
          console.log('Received Selected State:' + state);
          this.updateSourceButton(i, 'state', state);
        }
      );
    }
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.sources; i++) {
      CrComLib.unsubscribeState(
        's',
        `MainPage.SourceList.Source${i + 1}Text`,
        this.titleSubscription[i]
      );

      CrComLib.unsubscribeState(
        'b',
        `MainPage.SourceList.Source${i + 1}FB`,
        this.selectedSubscription[i]
      );
    }
  }

  selectSource(index: number): void {
    // Pulses Source{n}Press join (1-based index expected by control system).
    CrComLib.pulseDigital(`MainPage.SourceList.Source${index + 1}Press`);
  }

  updateSourceButton(index: number, key: keyof SourceButton, value: any) {
    this.ngZone.run(() =>
      this.SourceButton.update((arr) =>
        arr.map((v, i) => (i === index ? { ...v, [key]: value } : v))
      )
    );
  }
}
