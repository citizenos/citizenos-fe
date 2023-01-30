import { Component, OnInit, Input } from '@angular/core';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { Argument } from 'src/app/interfaces/argument';

@Component({
  selector: 'argument-edits',
  templateUrl: './argument-edits.component.html',
  styleUrls: ['./argument-edits.component.scss']
})
export class ArgumentEditComponent implements OnInit {
  @Input() argument!:Argument;

  constructor(public TopicArgumentService: TopicArgumentService) { }

  ngOnInit(): void {
    console.log(this.argument.edits);
  }

}
