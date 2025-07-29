import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Importa ReactiveFormsModule
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr'; // <-- Importa ToastrModule si no está en tu AppModule

import { ProfileComponent } from './profile.component';


export const routes: Routes = [
  {path: '', component: ProfileComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Añade ReactiveFormsModule aquí
    RouterModule.forChild(routes),
    ToastrModule.forRoot() // <-- Añade ToastrModule.forRoot() si no lo has hecho en AppModule
    // Si ya tienes ToastrModule.forRoot() en tu AppModule, solo necesitas ToastrModule aquí:
    // ToastrModule,
  ]
})
export class ProfileModule {
  static routes = routes;
}