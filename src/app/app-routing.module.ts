import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotepadClassicComponent } from './notepad-classic/notepad-classic.component';

const routes: Routes = [
  { path: '', redirectTo: 'notepad', pathMatch: 'full' },
  { path: 'notepad', component: NotepadClassicComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
