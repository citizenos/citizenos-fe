import { switchMap, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicParticipantsComponent } from '../topic-participants/topic-participants.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-participants-dialog',
  templateUrl: './topic-participants-dialog.component.html',
  styleUrls: ['./topic-participants-dialog.component.scss']
})
export class TopicParticipantsDialogComponent implements OnInit {

  constructor(dialog: MatDialog,route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
    .subscribe((topic) => {
      dialog.open(TopicParticipantsComponent, {data: {topic}});
    })

  }

  ngOnInit(): void {
  }

}
