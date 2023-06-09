import { Component, Input } from '@angular/core';

@Component({
  selector: 'feature-box',
  templateUrl: './feature-box.component.html',
  styleUrls: ['./feature-box.component.scss']
})
export class FeatureBoxComponent {
  @Input() feature!:string;
  @Input() items!: number;
  @Input() icon!: string;

  itemsList () {
    let items = [];
    let i = 0;
    while (i < this.items) {
      items.push(i);
      i++;
    }
    return items;
  }
}
