import 'jvectormap/jquery-jvectormap.min.js';
import 'jvectormap-world/jquery-jvectormap-world-mill-en.js';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { ButtonsModule, BsDropdownModule } from 'ngx-bootstrap';

import { AgmCoreModule } from '@agm/core';

import { MapsGoogleComponent } from './google/maps-google.component';

export const routes: Routes = [
  {path: '', redirectTo: 'google', pathMatch: 'full'},
  {path: 'google', component: MapsGoogleComponent},
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    MapsGoogleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    })
  ]
})
export class MapsModule {
  static routes = routes;
}
