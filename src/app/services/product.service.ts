import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs';
import { ProductResponse } from '../response/product/product.response';
import { environment } from '../../enviroments/environment';
import { CartItem } from '../class/cart-item';
import { Response } from '../response/response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private  apiProducts = environment.apiBaseUrl + '/products';
  
  constructor(private http: HttpClient) { }

  getProducts(keyword:string,category_id:number,minPrice:number,maxPrice:number,rateStar:number,page:number,limit:number): Observable<Response>{
    let params = new HttpParams()
    .set('keyword', keyword.toString())
    .set('category_id', category_id.toString())
    .set('minPrice', minPrice.toString())
    .set('maxPrice', maxPrice.toString())
    .set('rateStar', rateStar.toString())
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<Response>(this.apiProducts, {params})
  }
  getProductDetail(productId:number): Observable<Response> {
    return this.http.get<Response>(`${this.apiProducts}/${productId}`);
  }
  updateImages(formData:FormData,productId:number): Observable <any>{
    
    return this.http.put(`${this.apiProducts}/upload/${productId}`,formData);
  }
  updateProduct(product:any,id:number):Observable<Response>{
    return this.http.put<Response>(`${this.apiProducts}/update/${id}`,product);
  }
  deleteProduct(id:number):Observable<Response> {
    return this.http.delete<Response>(`${this.apiProducts}/${id}`);
  }
}
