// Shared source state used by multiple media-related components.

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
