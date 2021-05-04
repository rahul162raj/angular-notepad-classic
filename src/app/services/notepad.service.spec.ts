import { TestBed } from '@angular/core/testing';

import { NotepadService } from './notepad.service';

describe('NoteServiceService', () => {
  let service: NotepadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotepadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
