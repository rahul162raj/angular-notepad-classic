import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

  resetFormGroup: FormGroup;
  emailErrorText: string;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.resetFormGroup = this.formBuilder.group({
      'email': [null, [Validators.required]]
    });
  }

  setValidationError(formControl: string) {
    const formControlItem = this.resetFormGroup.get(formControl);
    if (formControl === 'email') {
      this.emailErrorText = formControlItem.hasError('required') ? 'Email is required' :
        formControlItem.hasError('pattern') ? 'Please enter a valid email address' : null;
    }
  }
  onClickResetBtn() {
    if (this.resetFormGroup.valid) {
      // this.authService.ForgotPassword(this.resetFormGroup.get('email').value);
    }
  }
}
