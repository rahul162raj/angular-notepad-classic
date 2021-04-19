import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotepadInitialComponent } from './notepad-initial.component';

describe('NotepadInitialComponent', () => {
  let component: NotepadInitialComponent;
  let fixture: ComponentFixture<NotepadInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotepadInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotepadInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
