import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {RegisterComponent} from './register.component';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {AlertModule} from 'ngx-bootstrap';
import {RegisterService} from './register.service';

export const routes: Routes = [
  {path: '', component: RegisterComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NewWidgetModule,
    AlertModule.forRoot()
  ],
  providers: [
    RegisterService
  ]
})
export class RegisterModule {
  static routes = routes;
}
