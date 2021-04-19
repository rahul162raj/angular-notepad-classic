import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notepad-classic',
  templateUrl: './notepad-classic.component.html',
  styleUrls: ['./notepad-classic.component.less']
})
export class NotepadClassicComponent implements OnInit {

  constructor(
    public authService: AuthService) { }

  ngOnInit(): void {
  }

}
