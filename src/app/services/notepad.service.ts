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

  constructor(
    private db: AngularFirestore,
    private _snackBar: MatSnackBar
  ) {
    this.openSnackbar();
  }

  public async getAllNotes(param: string, labelIcon: string): Promise<any> {
    let dbData;
    let userDataId = JSON.parse(localStorage.getItem('user'));
    switch (param) {
      case this.sideNavEnum.ALLNOTES: {
        dbData = await this.db.collection("notes").ref
          .where('uid', '==', userDataId.uid)
          .where('trash', '==', false).get()
        break;
      }
      case this.sideNavEnum.FAVOURITES: {
        dbData = await this.db.collection("notes").ref.
          where('uid', '==', userDataId.uid)
          .where('trash', '==', false)
          .where('favourite', '==', true).get()
        break;
      }
      case this.sideNavEnum.SHARED: {
        dbData = await this.db.collection("notes").ref
          .where('shared', 'array-contains', userDataId.email)
          .where('trash', '==', false).get()
        break;
      }
      case this.sideNavEnum.BIN: {
        dbData = await this.db.collection("notes").ref
          .where('uid', '==', userDataId.uid)
          .where('trash', '==', true).get()
        break;
      }
      case this.sideNavEnum.TRAVEL_LABEL:
      case this.sideNavEnum.PERSONAL_LABEL:
      case this.sideNavEnum.LIFE_LABEL:
      case this.sideNavEnum.WORK_LABEL:
      case this.sideNavEnum.UNTAGGED: {
        dbData = await this.db.collection("notes").ref
          .where('uid', '==', userDataId.uid)
          .where('trash', '==', false)
          .where('label', '==', labelIcon).get()
        break;
      }
    }
    if (dbData) {
      return dbData.docs.map(doc => doc.data());
    } else {
      return [];
    }
  }


  openSnackbar() {
    this._snackBar.open('This is the beta version, some of the functionalities are not implemented.', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  public async updateNote(notepadItem: notes) {
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

  public async moveToTrash(isTrashItem: boolean): Promise<any> {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    await this.db.collection("notes").ref
      .where('uid', '==', userDataId.uid)
      .where('trash', '==', isTrashItem).get().then(response => {
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

