import { Component, OnInit } from '@angular/core';
import { UserTopicService } from 'src/app/services/user-topic.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  topics$ = this.UserTopicService.topics$;

  constructor(public UserTopicService: UserTopicService) { }

  ngOnInit(): void {
  }

}
