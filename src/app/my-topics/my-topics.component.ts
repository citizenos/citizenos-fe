import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-topics',
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.scss']
})
export class MyTopicsComponent implements OnInit {
  wWidth = window.innerWidth;
  constructor() { }

  ngOnInit(): void {
  }

}
