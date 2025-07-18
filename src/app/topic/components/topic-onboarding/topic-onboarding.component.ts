import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { TourService } from '@services/tour.service';

@Component({
  selector: 'app-topic-onboarding',
  templateUrl: './topic-onboarding.component.html',
  styleUrls: ['./topic-onboarding.component.scss'],
  standalone: false
})
export class TopicOnboardingComponent {
  constructor(private TourService: TourService, public auth: AuthService) {

  }

  takeTour() {
    let tour = 'topic';
    if (window.innerWidth <= 1024) {
      tour = 'topic_mobile';
    }
    this.TourService.show(tour, 1);
  }
}
