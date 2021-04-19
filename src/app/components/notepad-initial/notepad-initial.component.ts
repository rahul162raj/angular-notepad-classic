import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notepad-initial',
  templateUrl: './notepad-initial.component.html',
  styleUrls: ['./notepad-initial.component.less']
})
export class NotepadInitialComponent implements OnInit {

  notes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  constructor() { }

  ngOnInit(): void {
  }

}
