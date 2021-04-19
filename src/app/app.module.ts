import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/services/auth.service'

//material module
import { MaterialModule } from './../shared/material.module'

//firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

//components
import { NotepadInitialComponent } from './components/notepad-initial/notepad-initial.component';
import { NotepadClassicComponent } from './components/notepad-classic/notepad-classic.component';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/admin/sign-in/sign-in.component';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/admin/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/admin/verify-email/verify-email.component';

const firebaseConfig = {
  apiKey: "AIzaSyAnayzMvaOtt9-7rq-_cOjnjlon13jrnZI",
  authDomain: "angular-notepad-classic.firebaseapp.com",
  projectId: "angular-notepad-classic",
  storageBucket: "angular-notepad-classic.appspot.com",
  messagingSenderId: "157367441608",
  appId: "1:157367441608:web:f0cfae57a53cc4e819edfd",
  measurementId: "G-B2Z2KPFQ3T"
};

@NgModule({
  declarations: [
    AppComponent,
    NotepadClassicComponent,
    NotepadInitialComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
