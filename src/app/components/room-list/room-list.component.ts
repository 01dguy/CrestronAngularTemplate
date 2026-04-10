import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  Input,
  signal,
  WritableSignal,
  HostListener,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RoomButton } from '../../../models/roombutton';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

declare var CrComLib: CrComLib;

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [
    CommonModule,
    DragDropModule
  ],
})
export class RoomListComponent implements OnInit, OnDestroy {
  // Number of room rows to subscribe/render.
  @Input() rooms = 8;
  titleSubscription: string[] = new Array(this.rooms);
  selectedSubscription: string[] = new Array(this.rooms);
  // Subscription ID for current-room name in header.
  roomSubscription!: string;
  room = signal('');
  dropdownVisible = false;
  RoomButton!: WritableSignal<(RoomButton & { originalIndex: number })[]>;

  private shouldSort = false;

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    // Preserve original join index even after drag-and-drop reorder.
    const defaultButtons = new Array(this.rooms).fill(null).map((_, idx) => Object.assign(new RoomButton(), { originalIndex: idx }));
    // Restore previously saved visual order.
    const savedOrder = localStorage.getItem('roomListOrder');
    let orderedButtons: (RoomButton & { originalIndex: number })[] = defaultButtons;
    if (savedOrder) {
      const order: number[] = JSON.parse(savedOrder);
      // Rebuild ordered list defensively to avoid duplicate/missing rows.
      const used = new Set<number>();
      orderedButtons = order
        .map(origIdx => {
          const btn = defaultButtons.find(b => b.originalIndex === origIdx && !used.has(origIdx));
          if (btn) used.add(origIdx);
          return btn;
        })
        .filter(Boolean) as (RoomButton & { originalIndex: number })[];
      // Append any rows missing from saved data.
      const missing = defaultButtons.filter(b => !used.has(b.originalIndex));
      orderedButtons = [...orderedButtons, ...missing];
    }
    this.RoomButton = signal(orderedButtons);

    for (let i = 0; i < this.rooms; i++) {
      this.titleSubscription[i] = CrComLib.subscribeState(
        's',
        `MainPage.RoomList.Room${i + 1}Text`,
        (title: string) => {
          console.log('Received a title for button: ' + title);
          this.updateRoomButtonByOriginalIndex(i, 'title', title);
        }
      );

      this.selectedSubscription[i] = CrComLib.subscribeState(
        'b',
        `MainPage.RoomList.Room${i + 1}FB`,
        (state: boolean) => {
          console.log('Received Selected State:' + state);
          this.updateRoomButtonByOriginalIndex(i, 'state', state);
        }
      );
    }

    // Updates selected room label in the header dropdown trigger.
    this.roomSubscription = CrComLib.subscribeState(
      's',
      'HeaderBar.RoomNameText',
      (room: string) => {
        console.log('Info -> Received the room name: ' + room);
        this.ngZone.run(() => this.room.set(room));
      }
    );
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.rooms; i++) {
      CrComLib.unsubscribeState(
        's',
        `MainPage.RoomList.Room${i + 1}Text`,
        this.titleSubscription[i]
      );

      CrComLib.unsubscribeState(
        'b',
        `MainPage.RoomList.Room${i + 1}FB`,
        this.selectedSubscription[i]
      );
    }

    CrComLib.unsubscribeState(
      's',
      'HeaderBar.RoomNameText',
      this.roomSubscription
    );
  }

  // Update by original join index instead of visual row index.
  updateRoomButtonByOriginalIndex(originalIndex: number, key: keyof RoomButton, value: any) {
    this.ngZone.run(() => {
      this.RoomButton.update((arr) =>
        arr.map((v) => v.originalIndex === originalIndex ? { ...v, [key]: value } : v)
      );
    });
    this.cdr.detectChanges();
  }

  // Presses the matching Room{n}Press join for the selected visual row.
  selectRoom(index: number): void {
    const roomButton = this.RoomButton()[index];
    if (roomButton) {
      console.log(`Room pressed: ${roomButton.title || 'Unknown Room'}`);
      CrComLib.pulseDigital(`MainPage.RoomList.Room${roomButton.originalIndex + 1}Press`);
      this.dropdownVisible = false;
    } else {
      console.warn(`Room button at index ${index} not found`);
    }
  }

  updateRoomButton(index: number, key: keyof RoomButton, value: any) {
    console.log(`Updating RoomButton at index ${index}: ${key} = ${value}`);
    this.ngZone.run(() => {
      this.RoomButton.update((arr) =>
        arr.map((v, i) => (i === index ? { ...v, [key]: value } : v))
      );
    });
    this.cdr.detectChanges();
  }

  sortRoomButtons() {
    if (this.shouldSort) {
      this.RoomButton.update((arr) =>
        arr.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      );
      this.shouldSort = false;
      this.cdr.detectChanges();
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown(): void {
    this.dropdownVisible = false;
  }

  // Close dropdown when clicking anywhere outside this component.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  // Persist drag-and-drop order locally so it survives reloads.
  drop(event: CdkDragDrop<RoomButton[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    this.ngZone.run(() => {
      const currentRooms = [...this.RoomButton()];
      moveItemInArray(currentRooms, event.previousIndex, event.currentIndex);
      this.RoomButton.set(currentRooms);
      const order = currentRooms.map(btn => btn.originalIndex);
      localStorage.setItem('roomListOrder', JSON.stringify(order));
      console.log('Room order after drag-and-drop:');
      currentRooms.forEach((button, index) => {
        console.log(`Index ${index}: Title = ${button.title}, State = ${button.state}`);
      });

      this.syncOrderWithBackend(currentRooms);
      this.cdr.detectChanges();
    });
  }

  // Stub for systems that need persisted order mirrored to backend logic.
  private syncOrderWithBackend(rooms: RoomButton[]): void {
    rooms.forEach((room, index) => {
      console.log(`Simulating backend sync: Room ${index + 1} = ${room.title}`);
    });
  }
}
