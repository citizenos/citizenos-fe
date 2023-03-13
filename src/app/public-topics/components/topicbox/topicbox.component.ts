import { Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { Component, Input, OnInit } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'topicbox',
  templateUrl: './topicbox.component.html',
  styleUrls: ['./topicbox.component.scss']
})

export class TopicboxComponent implements OnInit {
  @Input() topic = <Topic>{}; // decorate the property with @Input()
  catClass = "varia";
  constructor(private TopicService: TopicService, private router: Router) { }

  ngOnInit(): void {
    const catEntries = Object.keys(this.TopicService.CATEGORIES).filter((cat) => this.topic.categories?.indexOf(cat) > -1);
    if (catEntries.length) {
      this.catClass = catEntries[0];
    }
  }

  showInfo () {
    return window.innerWidth > 667;
  }

  goToView() {
    this.router.navigate(['topics', this.topic.id]);
  }
}
