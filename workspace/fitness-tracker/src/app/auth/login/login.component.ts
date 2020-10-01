import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  loadingSubscription:Subscription;

  constructor(private authService: AuthService,
              private uiService: UIService) { }

  ngOnInit(): void {

    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  onLogin(loginForm: NgForm) {
    this.authService.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
