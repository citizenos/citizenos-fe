import { Component, OnInit, Input } from '@angular/core';
import { TopicService } from 'src/app/services/topic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'topic-tabs',
  templateUrl: './topic-tabs.component.html',
  styleUrls: ['./topic-tabs.component.scss']
})
export class TopicTabsComponent implements OnInit {
  @Input() topicId!: string;
  @Input() voteId?: string;
  @Input() status!: string;
  public trainPosition:any;
  public tabFinalLength:any;
  public tabsTrainWidth:any;
  public tabsVisibleAreaWidth:any;
  wWidth = window.innerWidth;
  editMode = false;
  public STATUSES = this.TopicService.STATUSES;
  constructor(private TopicService:TopicService, route: ActivatedRoute) {
    if (route.snapshot.fragment && route.snapshot.fragment.indexOf('editMode') > -1) this.editMode = true;
  }

  ngOnInit(): void {
  }

  moveLeft() {
    if (this.trainPosition < -this.tabFinalLength) {
      this.trainPosition += this.tabFinalLength;
    } else {
      this.trainPosition = 0;
    }
  };

  //When right arrow is clicked move the tabs train to right
  moveRight() {
    if (this.trainPosition > -this.tabsTrainWidth + this.tabsVisibleAreaWidth - 10) {
      this.trainPosition -= this.tabFinalLength;
    }

    //If end of the line
    if (this.trainPosition < -this.tabsTrainWidth + this.tabsVisibleAreaWidth - 10) {
      this.trainPosition = -this.tabsTrainWidth + this.tabsVisibleAreaWidth - 10;
    }
  }
}
