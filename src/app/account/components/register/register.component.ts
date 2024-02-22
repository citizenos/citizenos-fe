import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  redirectSuccess?: any;
  email?: string;
  constructor(private router: Router, private route: ActivatedRoute, private Location: LocationService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.email = value['email'];
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
      if (!this.redirectSuccess) {
        this.redirectSuccess = this.Location.getAbsoluteUrl(`/account/login`);
      }
    });
  }
}

@Component({
  templateUrl: './register-dialog.component.html'
})
export class RegisterDialogComponent {
  redirectSuccess?: any;
  email?: string;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.email = value['email'];
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
    });
  }
}
