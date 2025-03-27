import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imagesSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  images$ = this.imagesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  

  updateImages(images: any[]): void {
    this.imagesSubject.next(images);
  }

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}