// Service for sharing Source name and state between components
// This service may only be necessary for single room systems

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Source } from '../../media-page/media-page.component';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private source = new BehaviorSubject<Source>(Source.None);
  currentSource = this.source.asObservable();

  changeSource(source: Source) {
    this.source.next(source);
  }
}

/* For instance, I'm using this to choose Source.None so the subpages clear upon Power Off. */
