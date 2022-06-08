import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../notification.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bell-icon',
  templateUrl: './bell-icon.component.html',
  styleUrls: ['./bell-icon.component.css'],
})
export class BellIconComponent implements OnInit, OnDestroy {
  @Input() color: any;
  @Input() indicatorType: any = 'count';
  @Input() userId: any;
  @Input() appId: any;
  isOpen: any;
  subscription!: Subscription;
  count: any;
  countSubscription!: Subscription;
  fetchCountSubscription!: Subscription;
  solidBellIcon = 'fa-solid fa-bell';
  regularBellIcon = 'fa-regular fa-bell';
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.currentisOpen.subscribe(
      (isOpen) => {
        this.isOpen = isOpen;
      }
    );
    this.countSubscription = this.notificationService.currentCount.subscribe(
      (count) => (this.count = count)
    );
    if (this.appId && this.userId) {
      this.fetchCountSubscription = this.notificationService
        .fetchCount(this.userId, this.appId)
        .subscribe({
          next: (res: any) => {
            this.count = res.unread_count;
            this.notificationService.updateCount(res.unread_count);
          },
        });
    }
  }

  toggleModal() {
    this.notificationService.toggleModal(this.userId, this.appId, !this.isOpen);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.countSubscription.unsubscribe();
    this.fetchCountSubscription.unsubscribe();
  }
}
