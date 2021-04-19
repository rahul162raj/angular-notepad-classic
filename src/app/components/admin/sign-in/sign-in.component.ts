import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {

  loginFormGroup: FormGroup;
  emailErrorText: string;
  passwordErrorText: string;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      'email': [null, [Validators.required]],
      'password': [null, [Validators.required]]
    });
  }

  setValidationError(formControl: string) {
    const formControlItem = this.loginFormGroup.get(formControl);
    if (formControl === 'email') {
      this.emailErrorText = formControlItem.hasError('required') ? 'Email is required' :
        formControlItem.hasError('pattern') ? 'Please enter a valid email address' : null;
    } else if (formControl === 'password') {
      this.passwordErrorText = formControlItem.hasError('required') ? 'Password is required' :
        formControlItem.hasError('minlength') ? 'Password should contain 6 characters' :
          formControlItem.hasError('maxlength') ? 'Password should not contain more than 128 characters' : null;
    }
  }
  onClickLoginBtn() {
    if (this.loginFormGroup.valid) {
      this.authService.SignIn(this.loginFormGroup.get('email').value, this.loginFormGroup.get('password').value)
    }
  }

}
