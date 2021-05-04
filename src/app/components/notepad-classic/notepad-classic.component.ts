import { HostListener, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { notes } from 'src/app/vo/notes';
import { NotepadService } from 'src/app/services/notepad.service';
import { v4 as uuidv4 } from 'uuid';
import { FRAMEBG, FRAMELABELICON, SIDENAV } from 'src/app/enum/notepadEnum';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'src/shared/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notepad-classic',
  templateUrl: './notepad-classic.component.html',
  styleUrls: ['./notepad-classic.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class NotepadClassicComponent implements OnInit {

  // navbar fields
  isSticky: boolean;
  isLoading: boolean = true;
  hideComposeBtn: boolean = false;
  searchField: NgModel;
  searchFieldFocus: boolean;

  // store current URL Param
  routedParam: string;

  // note item fields
  notepadList = [];
  noteItemId;
  isNewItem: boolean;
  disableCloseBtn: boolean = false;

  // enums
  sideNavEnum = SIDENAV;
  frameBgEnum = FRAMEBG;
  frameLabelIconEnum = FRAMELABELICON;

  // iframe fields
  iframe;
  iframeTitle;
  iframeFavourite: boolean;
  iframeBgColor: string = this.frameBgEnum.WHITE;
  iframelabelIcon: string = this.frameLabelIconEnum.UNTAGGED_ICON;
  frameBgItems = [
    this.frameBgEnum.WHITE,
    this.frameBgEnum.BLUE,
    this.frameBgEnum.BROWN,
    this.frameBgEnum.DARKBLUE,
    this.frameBgEnum.GREEN,
    this.frameBgEnum.GREY,
    this.frameBgEnum.ORANGE,
    this.frameBgEnum.PINK,
    this.frameBgEnum.PURPLE,
    this.frameBgEnum.RED,
    this.frameBgEnum.TEAL,
    this.frameBgEnum.YELLOW,
  ];
  iframeLabelItems = [
    this.frameLabelIconEnum.TRAVEL_ICON,
    this.frameLabelIconEnum.PERSONAL_ICON,
    this.frameLabelIconEnum.WORK_iCON,
    this.frameLabelIconEnum.LIFE_ICON,
    this.frameLabelIconEnum.UNTAGGED_ICON,
  ];
  loadIframe: boolean;

  // iframe style
  iframeStyleValue = `body{font-family: "Open Sans", sans-serif !important;padding : 8px 12px;white-space: pre-wrap;word-wrap: break-word;}
      .body-size-1{font-size: 16px;font-weight: normal;letter-spacing: 0.5px;color: #202124;}
      div{margin-bottom:2px; }`;

  // iframe DOM elements
  iframeBodyElement;
  iframeContentDocument;
  iframeBodyDocument;

  constructor(
    public authService: AuthService,
    public notepadService: NotepadService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((param) => {
      this.routedParam = param[0].path;
      if (this.routedParam === this.sideNavEnum.SHARED ||
        this.routedParam === this.sideNavEnum.BIN) {
        this.hideComposeBtn = true;
      }
      this.getNotes();
    });
  }

  getNotes() {
    this.isLoading = true;
    this.notepadService.getAllNotes(this.routedParam, this.getIcon()).then((result) => {
      this.notepadList = result;
      this.isLoading = false;
    });
  }

  private getIcon() {
    return this.routedParam === this.sideNavEnum.TRAVEL_LABEL
      ? this.frameLabelIconEnum.TRAVEL_ICON
      : this.routedParam === this.sideNavEnum.PERSONAL_LABEL
        ? this.frameLabelIconEnum.PERSONAL_ICON
        : this.routedParam === this.sideNavEnum.LIFE_LABEL
          ? this.frameLabelIconEnum.LIFE_ICON
          : this.routedParam === this.sideNavEnum.WORK_LABEL
            ? this.frameLabelIconEnum.WORK_iCON
            : this.routedParam === this.sideNavEnum.UNTAGGED
              ? this.frameLabelIconEnum.UNTAGGED_ICON
              : null;
  }

  deleteNote(note: notes) {
    let isTrashItem = this.routedParam === this.sideNavEnum.BIN;
    this.notepadService.deleteNote(note, isTrashItem).then(() => {
      let itemIndex;
      this.notepadList.forEach((data, index) => {
        if (data.id === note.id) {
          itemIndex = index;
        }
      });
      if (itemIndex > -1) {
        this.notepadList.splice(itemIndex, 1);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 1;
  }

  onFocusSearchInput(event) {
    this.searchFieldFocus = event === 'in' ? true : false;
  }

  onComposeBtnClick() {
    this.disableCloseBtn = false;
    this.noteItemId = uuidv4();
    this.createFrame(null);
  }

  onClickCardItem(noteItem: notes) {
    this.disableCloseBtn = false;
    this.noteItemId = noteItem.id;
    this.createFrame(noteItem);
  }

  private createFrame(noteItem: notes) {
    this.iframeBodyElement.style.overflow = 'hidden';
    this.iframeTitle = noteItem ? noteItem.title : '';
    this.iframeBgColor = noteItem ? noteItem.color : this.frameBgEnum.WHITE;
    this.iframelabelIcon = noteItem ? noteItem.label :
      this.getIcon() ? this.getIcon() : this.frameLabelIconEnum.UNTAGGED_ICON;
    this.iframeFavourite = noteItem ? noteItem.favourite :
      this.routedParam === this.sideNavEnum.FAVOURITES ? true : false;
    this.iframeBodyDocument.innerHTML = '';
    if (noteItem && noteItem.innerHtml) {
      const childElement = document.createElement('div');
      childElement.innerHTML = noteItem.innerHtml ? noteItem.innerHtml : '';
      this.iframe.contentDocument.body.appendChild(childElement);
    }
    this.loadIframe = true;
  }

  onClickCloseBtn() {
    this.disableCloseBtn = true;
    if (!this.iframeBodyDocument.textContent && !this.iframeTitle) {
      this.iframeTitle = 'EMPTYNOTE';
    }
    const newNoteItem = {
      id: this.noteItemId,
      title: this.iframeTitle ? this.iframeTitle.toString() : '',
      textContent: this.iframeBodyDocument.textContent,
      innerHtml: this.iframeBodyDocument.innerHTML,
      favourite: this.iframeFavourite,
      shared: ['1', '2', '3', '4'],
      color: this.iframeBgColor,
      label: this.iframelabelIcon,
    };
    this.notepadService.updateNote(newNoteItem).then(() => {
      this.getNotes();
      this.loadIframe = false;
    })
    this.iframeBodyElement.style.overflow = 'auto';
  }

  execCmd(command) {
    this.iframeContentDocument.execCommand(command, false, null);
  }

  openDialog() {
    let isTrashItem = this.routedParam === this.sideNavEnum.BIN;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Move All To Bin',
        message: 'All items will be moved to bin, Do you want to proceed?',
        ok: 'OK',
        cancel: 'CLOSE',
        isTrashItem: isTrashItem,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'no') {
        this.getNotes();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.iframe = document.getElementsByClassName('richTextField')[0];
    this.iframeBodyElement = document.getElementsByClassName(
      'have-classic-body'
    )[0];
    this.iframeContentDocument = this.iframe.contentDocument;
    this.iframeBodyDocument = this.iframeContentDocument.body;
    this.iframeContentDocument.designMode = 'on';
    const style = document.createElement('style');
    style.innerHTML = this.iframeStyleValue;
    if (this.iframeContentDocument.head.getElementsByTagName('style').length === 0) {
      this.iframeContentDocument.head.appendChild(style);
      this.iframeBodyElement.classList.add('body-size-1');
      this.iframeBodyElement.setAttribute('spellcheck', 'false');
    }
  }

}
