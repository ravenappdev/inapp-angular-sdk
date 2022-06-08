import { Component } from '@angular/core';
import { CountService } from 'in-app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  color: any = 'blue';
  indicatorType: any = 'count';
  fontStyle: any;
  userId: any = '';
  appId: any = '';
  signature: any = '';
  onClickNotification: any;
  displayStyle: any = 'bubble';
  position: any = 'left';

  constructor(private countService: CountService) {}
  ngOnInit(): void {
    this.countService.count.subscribe((count: any) => console.log(count));
  }
}
