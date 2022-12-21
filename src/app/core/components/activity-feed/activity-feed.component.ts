import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  unreadActivitiesCount = 0;
  constructor() { }

  ngOnInit(): void {
  }

  doShowActivityModal () {

  }
}
