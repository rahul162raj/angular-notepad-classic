import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SIDENAV } from '../enum/notepadEnum';
import { notes } from '../vo/notes';


@Injectable({
  providedIn: 'root'
})
export class NotepadService {

  viewListBtn: boolean;
  sideNavEnum = SIDENAV;
  allNotepadList = [];
  initialLoad = false;

  constructor(
    private db: AngularFirestore,
    private _snackBar: MatSnackBar
  ) {
    this.openSnackbar();
  }

  public async getAllNotes(param: string, labelIcon: string): Promise<any> {
    let dbData;
    let userDataId = JSON.parse(localStorage.getItem('user'));
    if (!this.initialLoad) {
      dbData = await this.db.collection("notes").ref
        .where('uid', '==', userDataId.uid).get();
      if (dbData) {
        this.allNotepadList = dbData.docs.map(doc => doc.data());
      } else {
        this.allNotepadList = [];
      }
      this.initialLoad = true;
    }
    switch (param) {
      case this.sideNavEnum.ALLNOTES: {
        dbData = this.allNotepadList.filter(note => note.trash === false);
        break;
      }
      case this.sideNavEnum.FAVOURITES: {
        dbData = this.allNotepadList.filter(note => note.favourite === true && note.trash === false);
        break;
      }
      case this.sideNavEnum.SHARED: {
        dbData = await this.db.collection("notes").ref
          .where('shared', 'array-contains', userDataId.email)
          .where('trash', '==', false).get()
        dbData = dbData.docs.map(doc => doc.data());
        break;
      }
      case this.sideNavEnum.BIN: {
        dbData = this.allNotepadList.filter(note => note.trash === true);

        break;
      }
      case this.sideNavEnum.TRAVEL_LABEL:
      case this.sideNavEnum.PERSONAL_LABEL:
      case this.sideNavEnum.LIFE_LABEL:
      case this.sideNavEnum.WORK_LABEL:
      case this.sideNavEnum.UNTAGGED: {
        dbData = this.allNotepadList.filter(note => note.trash === false && note.label === labelIcon);
        break;
      }
    }
    return dbData;
  }


  openSnackbar() {
    this._snackBar.open('This is the beta version, some of the functionalities are not implemented.', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  public async updateNote(notepadItem: notes) {
    // update local state
    let currentIndex = -1;
    this.allNotepadList.forEach((note, index) => {
      if (note.id === notepadItem.id) currentIndex = index;
    });
    if (currentIndex > -1) {
      this.allNotepadList[currentIndex] = notepadItem;
    } else {
      this.allNotepadList.push(notepadItem);
    }

    // update db state
    await this.db.collection("notes").doc(notepadItem.id).set({
      uid: notepadItem.uid,
      id: notepadItem.id,
      title: notepadItem.title,
      textContent: notepadItem.textContent,
      innerHtml: notepadItem.innerHtml,
      shared: notepadItem.shared,
      color: notepadItem.color,
      label: notepadItem.label,
      favourite: notepadItem.favourite,
      trash: notepadItem.trash
    })
  }

  public async deleteNote(note: notes, isTrashItem: boolean) {
    // update local state
    let itemIndex;
    this.allNotepadList.forEach((data, index) => {
      if (data.id === note.id) {
        itemIndex = index;
      }
    });
    if (itemIndex > -1) {
      if (isTrashItem) {
        this.allNotepadList.splice(itemIndex, 1);
      } else {
        this.allNotepadList[itemIndex].trash = true;
      }
    }

    // update db state
    if (isTrashItem) {
      await this.db.collection('notes').doc(note.id).delete();
    } else {
      await this.db.collection("notes").doc(note.id).ref.update({
        trash: true
      })
    }
  }

  // need to implement
  public async getNotifications(): Promise<any> {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    let dbItem = await this.db.collection('notification').doc(userDataId.uid).ref.get();
    if (dbItem.data()) {
      return dbItem.data();
    } else {
      return [];
    }
  }

  public async getUsers(): Promise<any> {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    let dbData = await this.db.collection('users').ref.where('uid', '!=', userDataId.uid).get()
    if (dbData) {
      return dbData.docs.map(doc => doc.data());
    } else {
      return [];
    }
  }

  public async moveToTrash(isTrashItem: boolean, filteredItem: Array<notes>): Promise<any> {

    let filteredIdList = [];
    filteredItem.forEach(note => {
      filteredIdList.push(note.id);
    });

    // update local state
    if (isTrashItem) {
      this.allNotepadList = this.allNotepadList.filter(note => !filteredIdList.includes(note.id));
    } else {
      this.allNotepadList.forEach((note, index) => {
        if (filteredIdList.includes(note.id))
          this.allNotepadList[index].trash = true;
      });
    }

    // update db state
    let userDataId = JSON.parse(localStorage.getItem('user'));
    await this.db.collection("notes").ref
      .where('uid', '==', userDataId.uid)
      .where('trash', '==', isTrashItem)
      .where('id', 'in', filteredIdList).get().then(response => {
        let batch = this.db.firestore.batch();
        response.docs.forEach((doc) => {
          if (isTrashItem) {
            let docReference = this.db.collection("notes").doc(doc.id).ref;
            batch.delete(docReference);
          } else {
            let docReference = this.db.collection("notes").doc(doc.id).ref;
            batch.update(docReference, { trash: true });
          }
        });
        batch.commit().catch(err => console.error(err));
      });
    return true;
  }

}

