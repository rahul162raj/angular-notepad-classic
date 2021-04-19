import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './components/admin/forgot-password/forgot-password.component';
import { SignInComponent } from './components/admin/sign-in/sign-in.component';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/admin/verify-email/verify-email.component';
import { NotepadClassicComponent } from './components/notepad-classic/notepad-classic.component';
import { NotepadInitialComponent } from './components/notepad-initial/notepad-initial.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'notepad', component: NotepadClassicComponent, canActivate: [AuthGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'initial', component: NotepadInitialComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
