import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SIDENAV } from '../enum/notepadEnum';
import { notes } from '../vo/notes';


@Injectable({
  providedIn: 'root'
})
export class NotepadService {

  viewListBtn: boolean;
  sideNavEnum = SIDENAV;

  constructor(
    private db: AngularFirestore
  ) { }

  public async getAllNotes(param: string, labelIcon: string): Promise<any> {
    let dbData;
    let userDataId = JSON.parse(localStorage.getItem('user'));
    switch (param) {
      case this.sideNavEnum.ALLNOTES: {
        dbData = await this.db.collection("notes").doc(userDataId.uid)
          .collection("items").ref.where('trash', '==', false).get()
        break;
      }
      case this.sideNavEnum.FAVOURITES: {
        dbData = await this.db.collection("notes").doc(userDataId.uid)
          .collection("items").ref.where('trash', '==', false).where('favourite', '==', true).get()
        break;
      }
      case this.sideNavEnum.SHARED: {
        dbData = null
        break;
      }
      case this.sideNavEnum.BIN: {
        dbData = await this.db.collection("notes").doc(userDataId.uid)
          .collection("items").ref.where('trash', '==', true).get()
        break;
      }
      case this.sideNavEnum.TRAVEL_LABEL:
      case this.sideNavEnum.PERSONAL_LABEL:
      case this.sideNavEnum.LIFE_LABEL:
      case this.sideNavEnum.WORK_LABEL:
      case this.sideNavEnum.UNTAGGED: {
        dbData = await this.db.collection("notes").doc(userDataId.uid)
          .collection("items").ref.where('trash', '==', false).where('label', '==', labelIcon).get()
        break;
      }
    }
    if (dbData) {
      return dbData.docs.map(doc => doc.data());
    } else {
      return [];
    }
  }

  public async updateNote(notepadItem: notes) {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    await this.db.collection("notes").doc(userDataId.uid)
      .collection("items").doc(notepadItem.id).set({
        id: notepadItem.id,
        title: notepadItem.title,
        textContent: notepadItem.textContent,
        innerHtml: notepadItem.innerHtml,
        shared: notepadItem.shared,
        color: notepadItem.color,
        label: notepadItem.label,
        favourite: notepadItem.favourite,
        trash: false
      })
  }

  public async deleteNote(note: notes, isTrashItem: boolean) {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    if (isTrashItem) {
      await this.db.collection('notes').doc(userDataId.uid)
        .collection("items").doc(note.id).delete();
    } else {
      await this.db.collection("notes").doc(userDataId.uid)
        .collection("items").doc(note.id).ref.update({
          trash: true
        })
    }
  }

  public async moveToTrash(isTrashItem: boolean): Promise<any> {
    let userDataId = JSON.parse(localStorage.getItem('user'));
    await this.db.collection("notes").doc(userDataId.uid)
      .collection("items").ref.where('trash', '==', isTrashItem).get().then(response => {
        let batch = this.db.firestore.batch();
        response.docs.forEach((doc) => {
          if (isTrashItem) {
            let docReference = this.db.collection("notes").doc(userDataId.uid)
              .collection("items").doc(doc.id).ref;
            batch.delete(docReference);
          } else {
            let docReference = this.db.collection("notes").doc(userDataId.uid)
              .collection("items").doc(doc.id).ref;
            batch.update(docReference, { trash: true });
          }
        });
        batch.commit().catch(err => console.error(err));
      });
    return true;
  }

}

