import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { ProductsService } from './../../services/products.service';
import { IProducts } from './../../models/products';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: IProducts[];
  productsSubcription: Subscription;

  canEdit: boolean = false;
  canView: boolean = false;

  constructor(private ProductsService: ProductsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.canEdit = true;

    this.productsSubcription = this.ProductsService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  deleteItem(id: number) {
    this.ProductsService.deleteProduct(id).subscribe(() => this.products.find((item) => {
      if (id === item.id) {
        let idx = this.products.findIndex((data) => data.id === id);
        this.products.splice(idx, 1);
      }
    }));
  }


  openDialog(): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => this.postData(data));
  }

  postData(data: IProducts) {
    console.log(data);
    this.ProductsService.postProduct(data).subscribe((data) => this.products.push(data));
  }

  ngOnDestroy() {
    if (this.productsSubcription) this.productsSubcription.unsubscribe();
  }
}
