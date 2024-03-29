import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Shoe } from './shoe';


@Injectable({
  providedIn: 'root'
})
export class ShoeService {
  private url = 'http://localhost:5200';
  shoes$ = signal<Shoe[]>([]);
  shoe$ = signal<Shoe>({} as Shoe);
 
  constructor(private httpClient: HttpClient) { }

  private refreshShoes() {
    this.httpClient.get<Shoe[]>(`${this.url}/shoes`)
      .subscribe(Shoes => {
        this.shoes$.set(Shoes);
      });
  }

  getShoes() {
    this.refreshShoes();
    return this.shoes$();
  }

  getShoe(id: string) {
    this.httpClient.get<Shoe>(`${this.url}/shoes/id/${id}`).subscribe(Shoe => {
      this.shoe$.set(Shoe);
      return this.shoe$();
    });
  }

  createShoe(Shoe: Shoe) {
    return this.httpClient.post(`${this.url}/shoes`, Shoe, { responseType: 'text' });
  }

  updateShoe(id: string, Shoe: Shoe) {
    return this.httpClient.put(`${this.url}/shoes/id/${id}`, Shoe, { responseType: 'text' });
  }

  deleteShoe(id: string) {
    return this.httpClient.delete(`${this.url}/shoes/id/${id}`, { responseType: 'text' });
  }

  searchShoes(filter: any, filterBy: any) {
    const params = new HttpParams().set('filter', filter).set('filterBy', filterBy);
    this.httpClient.get<Shoe[]>(`${this.url}/shoes/search`, { params })
      .subscribe(Shoes => {
        this.shoes$.set(Shoes);
      });
  }
}