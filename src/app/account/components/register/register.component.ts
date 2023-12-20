import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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
