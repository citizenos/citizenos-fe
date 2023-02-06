import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-topic-create',
  templateUrl: './topic-create.component.html',
  styleUrls: ['./topic-create.component.scss']
})
export class TopicCreateComponent implements OnInit {

  constructor(app: AppService) {
    app.createNewTopic();
  }

  ngOnInit(): void {
  }

}
