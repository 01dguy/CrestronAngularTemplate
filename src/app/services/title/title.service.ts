// Shared page-visibility flags used by header controls.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor() { }

  private pageVisibilitySource = new BehaviorSubject<{ [page: string]: boolean }>({});
  pageVisibility$ = this.pageVisibilitySource.asObservable();

  setCurrentPageVisibility(page: string, isVisible: boolean) {
    const currentPageVisibility = this.pageVisibilitySource.getValue();
    this.pageVisibilitySource.next({
      ...currentPageVisibility,
      [page]: isVisible
    });
    console.log(`${page}Visibility$`, isVisible); //debug
  }
}
