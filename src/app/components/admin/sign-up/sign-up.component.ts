import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  loginFormGroup: FormGroup;
  emailErrorText: string;
  passwordErrorText: string;
  usernameErrorText: string;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      'username': [null, [Validators.required]],
      'email': [null, [Validators.required]],
      'password': [null, [Validators.required]]
    });
  }

  setValidationError(formControl: string) {
    const formControlItem = this.loginFormGroup.get(formControl);
    if (formControl === 'username') {
      this.usernameErrorText = formControlItem.hasError('required') ? 'Username is required' : null;
    }
    else if (formControl === 'email') {
      this.emailErrorText = formControlItem.hasError('required') ? 'Email is required' :
        formControlItem.hasError('pattern') ? 'Please enter a valid email address' : null;
    } else if (formControl === 'password') {
      this.passwordErrorText = formControlItem.hasError('required') ? 'Password is required' :
        formControlItem.hasError('minlength') ? 'Password should contain 6 characters' :
          formControlItem.hasError('maxlength') ? 'Password should not contain more than 128 characters' : null;
    }
  }

  onClickRegisterBtn() {
    if (this.loginFormGroup.valid) {
      // this.authService.SignUp(this.loginFormGroup.get('email').value, this.loginFormGroup.get('password').value)
    }
  }

}
