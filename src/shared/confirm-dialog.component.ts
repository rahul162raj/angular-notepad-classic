import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SIDENAV } from 'src/app/enum/notepadEnum';
import { NotepadService } from 'src/app/services/notepad.service';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  isBtnDisable: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private activatedRoute: ActivatedRoute,
    public notepadService: NotepadService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.isBtnDisable = false
  }

  onClickDialogClose() {
    this.isBtnDisable = true;
    this.notepadService.moveToTrash(this.data.isTrashItem, this.data.filteredItem).then(result => {
      this.dialogRef.close();
    })
  }
}
