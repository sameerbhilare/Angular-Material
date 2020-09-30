import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  maxDate: Date;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    /* We want to ensure that the user is at least 18 years old.
       We can do so using the max property to the input.
       This will add the max value validator
       and if we set this to a date this will automatically be recognized by the date picker
       and taken into account. So this should now be a date. */
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(signupForm: NgForm) {
    console.log(signupForm);
    this.authService.registerUser({
      email: signupForm.value.email,
      password: signupForm.value.password
    });
  }

}
