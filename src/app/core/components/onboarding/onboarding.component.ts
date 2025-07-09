import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { TourService } from '@services/tour.service';

@Component({
  selector: 'onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: false
})
export class OnboardingComponent {
  constructor(private TourService: TourService, public auth: AuthService) {

  }

  takeTour() {
    let tour = 'dashboard';
    if (window.innerWidth <= 1024 && window.innerWidth > 560) {
      tour = 'dashboard_tablet';
    } else if (window.innerWidth < 560) {
      tour = 'dashboard_mobile';
    }
    this.TourService.show(tour, 1);
  }
}
