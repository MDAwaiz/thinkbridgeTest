import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

interface ItemData {
  Name: string;
  Price: number;
  Decs: string;
  Category: string;
  Qty:number
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  itemList = [];
  itemData: ItemData;
  itemForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder
  ) {
    this.itemData = {} as ItemData;
  }

  ngOnInit() {

    this.itemForm = this.fb.group({
      Name: ['', [Validators.required]],
      Price: ['', [Validators.required,Validators.pattern('^[0-9]+$')]],
      Decs: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      Qty: ['', [Validators.required,Validators.pattern('^[0-9]+$')]]
    })

    this.firebaseService.read_item().subscribe(data => {

      this.itemList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Price: e.payload.doc.data()['Price'],
          Decs: e.payload.doc.data()['Decs'],
          Category: e.payload.doc.data()['Category'],
          Qty: e.payload.doc.data()['Qty'],
        };
      })
      console.log(this.itemList);

    });
  }

  CreateRecord() {
    console.log(this.itemForm.value);
    this.firebaseService.create_item(this.itemForm.value).then(resp => {
      this.itemForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_item(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Price;
    record.EditDecs = record.Decs;
    record.EditCategory = record.Category;
    record.EditQty = record.Qty;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Price'] = recordRow.EditPrice;
    record['Decs'] = recordRow.EditDecs;
    record['Category']= recordRow.EditCategory;
    record['Qty']= recordRow.EditQty
    this.firebaseService.update_item(recordRow.id, record);
    recordRow.isEdit = false;
  }

}
