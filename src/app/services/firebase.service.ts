import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'thinkB';

  constructor(
    private firestore: AngularFirestore
  ) { }

  create_item(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_item() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_item(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_item  (record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}
