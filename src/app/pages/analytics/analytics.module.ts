import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';

import 'jquery-flot/jquery.flot.js';
import 'jquery.flot.animator/jquery.flot.animator';
import 'jquery-flot/jquery.flot.pie.js';
import 'jquery-flot/jquery.flot.selection.js';
import 'jquery-flot/jquery.flot.resize.js';
import 'flot.dashes/jquery.flot.dashes';
import { WidgetModule } from '../../layout/widget/widget.module';
import {BsDropdownModule, ProgressbarModule} from 'ngx-bootstrap';
import {TrendModule} from 'ngx-trend';
import {CalendarModule} from '../visits/calendar/calendar.module';
import {AnalyticsService} from './analytics.service';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';

export const routes: Routes = [
  { path: '', component: AnalyticsComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WidgetModule,
    ProgressbarModule.forRoot(),
    TrendModule,
    BsDropdownModule.forRoot(),
    CalendarModule,
    NewWidgetModule
  ],
  declarations: [
    AnalyticsComponent,
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule {
  static routes = routes;
}
