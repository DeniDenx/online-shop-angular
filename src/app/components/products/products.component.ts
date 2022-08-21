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

  constructor(private ProductsService: ProductsService, public dialog: MatDialog) { }
  products: IProducts[];
  productsSubcription: Subscription;

  basket: IProducts[];
  basketSubcription: Subscription;

  canEdit: boolean = false;
  canView: boolean = false;

  ngOnInit(): void {
    this.canEdit = true;

    this.productsSubcription = this.ProductsService.getProducts().subscribe((data) => {
      this.products = data;
    });

    this.basketSubcription = this.ProductsService.getProductFromBasket().subscribe((data) => {
      this.basket = data;
    });
  }

  addToBasket(product: IProducts) {
    if (this.basket) {
      this.basket.find((item) => {
        if (item.id = product.id) {
          product.quantity = + 1;
          this.ProductsService.updateBasketProduct(product).subscribe((data) => {
            this.basket = this.basket.map((item) => {
              if (item.id === data.id) return data;
              else return item;
            });
          });
        }
      });
    } else {
      product.quantity = 1;
      this.ProductsService.postProductToBasket(product).subscribe((data) =>
        this.basket.push(data)
      );
    }

  }

  deleteItem(id: number) {
    this.ProductsService.deleteProduct(id).subscribe(() => this.products.find((item) => {
      if (id === item.id) {
        let idx = this.products.findIndex((data) => data.id === id);
        this.products.splice(idx, 1);
      }
    }));
  }


  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product;

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data && data.id)
          this.updateData(data);
        else
          this.postData(data);
      }

    });
  }

  postData(data: IProducts) {
    this.ProductsService.postProduct(data).subscribe((data) => this.products.push(data));
  }

  updateData(product: IProducts) {
    this.ProductsService.updateProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        if (product.id === data.id) return data;
        else return product;
      });
    });

  }

  ngOnDestroy() {
    if (this.productsSubcription) this.productsSubcription.unsubscribe();
    if (this.basketSubcription) this.basketSubcription.unsubscribe();


  }
}
