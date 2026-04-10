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
    CommonModule, // for *ngIf
    DragDropModule // for drag and drop
  ],
})
export class RoomListComponent implements OnInit, OnDestroy {
  @Input() rooms = 8; // declare the number of rooms
  titleSubscription: string[] = new Array(this.rooms);
  selectedSubscription: string[] = new Array(this.rooms);
  roomSubscription!: string; // text on room button dropdown to update to current room
  room = signal('');
  dropdownVisible = false;
  RoomButton!: WritableSignal<(RoomButton & { originalIndex: number })[]>;

  private shouldSort = false; // Flag to control sorting

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    // new method to create room dropdown with originalIndex
    const defaultButtons = new Array(this.rooms).fill(null).map((_, idx) => Object.assign(new RoomButton(), { originalIndex: idx }));
    // Try to restore order from localStorage
    const savedOrder = localStorage.getItem('roomListOrder');
    let orderedButtons: (RoomButton & { originalIndex: number })[] = defaultButtons;
    if (savedOrder) {
      const order: number[] = JSON.parse(savedOrder);
      // Build a new array by mapping order to buttons, ensuring no duplicates
      const used = new Set<number>();
      orderedButtons = order
        .map(origIdx => {
          const btn = defaultButtons.find(b => b.originalIndex === origIdx && !used.has(origIdx));
          if (btn) used.add(origIdx);
          return btn;
        })
        .filter(Boolean) as (RoomButton & { originalIndex: number })[];
      // Add any missing buttons (in case of mismatch)
      const missing = defaultButtons.filter(b => !used.has(b.originalIndex));
      orderedButtons = [...orderedButtons, ...missing];
    }
    this.RoomButton = signal(orderedButtons);

    // TEMP: Clear room order for testing on device
    //localStorage.removeItem('roomListOrder');

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

    // Subscribe to the room join for indirect text.
    this.roomSubscription = CrComLib.subscribeState(
      's',
      'HeaderBar.RoomNameText', // Room Name
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

    // Unsubscribe from the room join when the component is destroyed.
    CrComLib.unsubscribeState(
      's',
      'HeaderBar.RoomNameText',
      this.roomSubscription
    );
  }

  // Update a room button by its original index (not UI index)
  updateRoomButtonByOriginalIndex(originalIndex: number, key: keyof RoomButton, value: any) {
    this.ngZone.run(() => {
      this.RoomButton.update((arr) =>
        arr.map((v) => v.originalIndex === originalIndex ? { ...v, [key]: value } : v)
      );
    });
    this.cdr.detectChanges();
  }

  // New Method (This doesn't appear to be used anywhere)
  selectRoom(index: number): void {
    const roomButton = this.RoomButton()[index];
    if (roomButton) {
      console.log(`Room pressed: ${roomButton.title || 'Unknown Room'}`);
      CrComLib.pulseDigital(`MainPage.RoomList.Room${roomButton.originalIndex + 1}Press`);
      this.dropdownVisible = false; // close the dropdown
    } else {
      console.warn(`Room button at index ${index} not found`);
    }
  }

  // New Method
  updateRoomButton(index: number, key: keyof RoomButton, value: any) {
    console.log(`Updating RoomButton at index ${index}: ${key} = ${value}`);
    this.ngZone.run(() => {
      this.RoomButton.update((arr) =>
        arr.map((v, i) => (i === index ? { ...v, [key]: value } : v))
      );
      //this.shouldSort = true; // Set the flag to sort
    });
    this.cdr.detectChanges(); // Trigger change detection
  }

  sortRoomButtons() {
    if (this.shouldSort) {
      this.RoomButton.update((arr) =>
        arr.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      );
      this.shouldSort = false; // Reset the flag
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  // For room dropdown menu
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Close the dropdown other than when room selected.
  closeDropdown(): void {
    this.dropdownVisible = false;
  }

  // Closes dropdown when clicking outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  // Handle the drop event to reorder rooms
  drop(event: CdkDragDrop<RoomButton[]>): void {
    // Prevent unnecessary updates if dropped onto itself
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    this.ngZone.run(() => {
      const currentRooms = [...this.RoomButton()];
      moveItemInArray(currentRooms, event.previousIndex, event.currentIndex);
      this.RoomButton.set(currentRooms);
      // Save the new order to localStorage
      const order = currentRooms.map(btn => btn.originalIndex);
      localStorage.setItem('roomListOrder', JSON.stringify(order));
      // Log the new order for debugging
      console.log('Room order after drag-and-drop:');
      currentRooms.forEach((button, index) => {
        console.log(`Index ${index}: Title = ${button.title}, State = ${button.state}`);
      });

      // Optionally, notify the backend of the new order (if required)
      this.syncOrderWithBackend(currentRooms);
      this.cdr.detectChanges();
    });
  }

  // Optional: Sync the new order with the backend (if your system supports it)
  private syncOrderWithBackend(rooms: RoomButton[]): void {
    // Example: Send the new order to the backend via CrComLib or another service
    rooms.forEach((room, index) => {
      // If your backend tracks room positions, update them here
      // e.g., CrComLib.setState('s', `MainPage.RoomList.Room${index + 1}Text`, room.title);
      console.log(`Simulating backend sync: Room ${index + 1} = ${room.title}`);
    });
  }
}
