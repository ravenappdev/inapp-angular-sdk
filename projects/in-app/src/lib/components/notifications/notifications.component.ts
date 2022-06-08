import { NotificationService } from '../../notification.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as Ably from 'ably';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() color: any = 'blue';
  @Input() indicatorType: any = 'count';
  @Input() fontStyle: any;
  @Input() userId: any;
  @Input() appId: any;
  @Input() signature: any;
  @Input() onClickNotification: any;
  @Input() displayStyle: any;
  @Input() position: any;
  @Input() header: any;
  title = 'in-app-notifications';
  notifications: any[] = [];
  items!: Observable<any[]>;
  isLoading = false;
  newNotifications = false;
  showLoadButton = true;
  unread = 0;
  isOpen: any;
  subscription!: Subscription;
  count: any;
  countSubscription!: Subscription;
  fetchSubscription!: Subscription;
  deliveryStatusUpdateSubscription!: Subscription;
  createUserSubscription!: Subscription;
  markAllReadSubcription!: Subscription;
  updateLastSeenSubcription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.currentisOpen.subscribe(
      (isOpen) => (this.isOpen = isOpen)
    );
    this.countSubscription = this.notificationService.currentCount.subscribe(
      (count) => (this.count = count)
    );
    if (!localStorage.getItem('userExists')) {
      this.createUserSubscription = this.notificationService
        .userSetup(this.userId, this.appId, this.signature)
        .subscribe({
          next: (res) => {
            localStorage.setItem('userExists', 'true');
            this.initialize();
          },
        });
    } else {
      this.initialize();
    }
  }

  saveData() {
    this.isLoading = true;
    this.notificationService
      .fetchNotifications(this.userId, this.appId, this.signature, null)
      .subscribe({
        next: (res: any) => {
          this.notifications = res.notifications;
          this.showLoadButton = !(res.notifications.length < 20);
          this.unread = 0;
          res.notifications.map((notification: any) => {
            if (notification.status === 'UNREAD') {
              this.unread += 1;
            }
          });
          this.isLoading = false;
        },
        error: (err) => console.log(err),
      });
  }

  onWrapperClick(event: any) {
    if (event.target.className === 'wrapper' && this.isOpen) {
      this.toggleModal();
    }
  }

  toggleModal() {
    this.notificationService.toggleModal(this.userId, this.appId, false);
  }

  markAllRead() {
    this.markAllReadSubcription = this.notificationService
      .markAllRead(
        this.userId,
        this.appId,
        this.signature,
        this.notifications[0].message_id
      )
      .subscribe({
        next: (res: any) => {
          this.saveData();
        },
      });
  }

  updateUnreadCount(event: any) {
    const status = event.status;
    const message_id = event.message_id;
    const current_status = event.current_status;
    if (status === 'READ' || current_status === 'UNREAD') {
      this.unread = this.unread - 1;
    }
    if (status === 'UNREAD') {
      this.unread = this.unread + 1;
    }
    if (status === 'ARCHIVE') {
      this.notifications = this.notifications.filter(
        (notification: any) => notification.message_id !== message_id
      );
    }
  }

  loadMore() {
    this.notificationService
      .fetchNotifications(
        this.userId,
        this.appId,
        this.signature,
        this.notifications[this.notifications.length - 1].message_id
      )
      .subscribe({
        next: (res: any) => {
          this.showLoadButton = !(res.notifications.length < 20);
          this.notifications = this.notifications.concat(res.notifications);
          res.notifications.map((notification: any) => {
            if (notification.status === 'UNREAD') {
              this.unread += 1;
            }
          });
        },
        error: (err) => console.log(err),
      });
  }

  initialize() {
    this.isLoading = true;
    this.fetchSubscription = this.notificationService
      .fetchNotifications(this.userId, this.appId, this.signature, null)
      .subscribe({
        next: (res: any) => {
          this.notifications = res.notifications;
          this.showLoadButton = !(res.notifications.length < 20);
          this.unread = 0;
          res.notifications.map((notification: any) => {
            if (notification.status === 'UNREAD') {
              this.unread += 1;
            }
          });
          this.isLoading = false;
        },
        error: (err) => console.log(err),
      });

    if (this.displayStyle === 'fullScreen') {
      this.updateLastSeenSubcription = this.notificationService
        .updateLastSeen(this.userId, this.appId)
        .subscribe();
    }

    let client = new Ably.Realtime({
      authUrl: this.notificationService.ABLY_TOKEN(
        this.appId,
        this.userId,
        this.signature
      ),
    }); /* inferred type Ably.Realtime */

    let channelName = this.appId + '-' + this.userId;

    let channel =
      client.channels.get(
        channelName
      ); /* inferred type Ably.Types.RealtimeChannel */

    channel.subscribe((message) => {
      if (!this.isOpen) {
        this.notificationService.updateCount(this.count + 1);
      }
      this.unread++;
      setTimeout(() => {
        this.deliveryStatusUpdateSubscription = this.notificationService
          .deliveryStatusUpdate(
            this.appId,
            message.data.raven_notification_id,
            new Date().getTime()
          )
          .subscribe();
      }, 1000);

      let temp = {
        message_id: message.data.raven_notification_id,
        message_body: {
          title: message.data.title,
          body: message.data.body,
          click_action: message.data.click_action,
          data: message.data.data,
        },
        timestamp: message.data.timestamp,
        status: 'UNREAD',
      };
      this.notifications = [temp].concat(this.notifications);
      Swal.fire({
        title: message.data.title,
        text: message.data.body,
        icon: 'success',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 8000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      }).then((result) => {
        if (result.isDismissed && result.dismiss?.toString() === 'close') {
          this.notificationService.updateCount(this.count - 1);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.countSubscription.unsubscribe();
    this.fetchSubscription.unsubscribe();
    this.deliveryStatusUpdateSubscription.unsubscribe();
    this.createUserSubscription.unsubscribe();
    this.markAllReadSubcription.unsubscribe();
  }
}
