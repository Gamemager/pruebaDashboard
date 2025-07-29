import {Component, ViewChild, ElementRef, ViewEncapsulation, OnInit} from '@angular/core';
import mock from './mock';
import {AnalyticsService} from './analytics.service';

declare let jQuery: any;

@Component({
  selector: 'analytics',
  templateUrl: './analytics.template.html',
  styleUrls: ['./analytics.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent {
  now = new Date();
  month = this.now.getMonth() + 1;
  year = this.now.getFullYear();
  mock = mock;

  calendarEvents: Array<Array<any>> = [
    [
      '2/' + this.month + '/' + this.year,
      'The flower bed',
      '#',
      '#5d8fc2',
      'Contents here'
    ],
    [
      '5/' + this.month + '/' + this.year,
      'Stop world water pollution',
      '#',
      '#f0b518',
      'Have a kick off meeting with .inc company'
    ],
    [
      '18/' + this.month + '/' + this.year,
      'Light Blue 2.2 release',
      '#',
      '#64bd63',
      'Some contents here'
    ],
    [
      '29/' + this.month + '/' + this.year,
      'A link',
      '#',
      '#dd5826',
    ]
  ];

  
  constructor() {
    
  }

  

}
