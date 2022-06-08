import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  count: any;
  constructor(private notificationService: NotificationService) {
    this.count = this.notificationService.currentCount;
  }
}
