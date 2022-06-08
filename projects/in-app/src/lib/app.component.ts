import { Component, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'inapp-notification-center',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RavenInAppComponent {
  @Input() color: any = 'blue';
  @Input() indicatorType: any = 'count';
  @Input() fontStyle: any;
  @Input() userId: any;
  @Input() appId: any;
  @Input() signature: any;
  @Input() onClickNotification: any;
  @Input() displayStyle: any = 'bubble';
  @Input() position: any = 'left';
  @Input() header: any = false;
}
