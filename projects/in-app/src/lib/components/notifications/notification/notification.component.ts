import { NotificationService } from '../../../notification.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  host: {
    '(window:click)': 'closeModal()',
  },
})
export class NotificationComponent implements OnInit {
  @Input() notification: any;
  @Input() color: any;
  @Output() unreadEmitter = new EventEmitter();
  @Input() appId: any;
  @Input() userId: any;
  @Input() signature: any;
  @Input() onClickNotification: any;
  isDeleteDialogOpen = false;
  isOpen = false;
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {}

  // tslint:disable-next-line: typedef
  toggleActions(e: any) {
    e.stopPropagation();
    this.notificationService.setSelectedNotification(this.notification);
    if (!this.isOpen) {
      if (this.notificationService.selectedNotification === null) {
        this.isOpen = true;
        return;
      }
      if (this.notificationService.selectedNotification) {
        this.isOpen =
          this.notification.message_id ===
          this.notificationService.selectedNotification.message_id;
      }
    } else {
      this.isOpen = false;
    }
  }

  // tslint:disable-next-line: typedef
  closeModal() {
    this.isOpen = false;
  }

  // tslint:disable-next-line: typedef
  onNoticationClick(event: any, callbackObj: any) {
    if (event.target.className !== 'action') {
      if (this.notification.status === 'UNREAD') {
        this.updateNotificationUtil('READ', this.notification.message_id);
      }
      this.onClickNotification(callbackObj);
    }
  }

  checkCurrentNotification(): boolean {
    if (this.notificationService.selectedNotification === null) {
      return true;
    }
    return (
      this.notification.message_id ===
      this.notificationService.selectedNotification.message_id
    );
  }

  // tslint:disable-next-line: typedef
  getDateTimeString(dateValue: any) {
    const date = new Date(parseInt(dateValue, 10));
    return moment(date).format('DD-MM-YYYY hh:mm:ss a');
  }

  // tslint:disable-next-line: typedef
  updateNotification(status: any, messageId: any) {
    if (status === 'ARCHIVE') {
      this.isDeleteDialogOpen = true;
    } else {
      this.updateNotificationUtil(status, messageId);
    }
  }

  // tslint:disable-next-line: typedef
  hideNotification() {
    this.updateNotificationUtil('ARCHIVE', this.notification.message_id);
  }

  // tslint:disable-next-line: typedef
  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
  }

  // tslint:disable-next-line: typedef
  closeDeleteDialogOutside(event: any) {
    if (
      event.target.className === 'modal-background' &&
      this.isDeleteDialogOpen
    ) {
      this.closeDeleteDialog();
    }
  }

  // tslint:disable-next-line: typedef
  updateNotificationUtil(status: any, messageId: any) {
    this.notificationService
      .updateNotification(
        this.userId,
        this.appId,
        this.signature,
        status,
        messageId
      )
      .subscribe({
        next: (res) => {
          this.unreadEmitter.emit({
            status: status,
            message_id: this.notification.message_id,
            current_status: this.notification.status,
          });
          this.notification.status = status;
        },
        error: (err) => console.log(err),
      });
  }

  // tslint:disable-next-line: typedef
  timeDiff(dateValue: any) {
    const date = moment(new Date(parseInt(dateValue, 10)));
    const currentDate = moment(new Date());
    const timeDiffSeconds = currentDate.diff(date, 'seconds');
    const timeDiffMinutes = currentDate.diff(date, 'minutes');
    const timeDiffHours = currentDate.diff(date, 'hours');
    const timeDiffDays = currentDate.diff(date, 'days');
    const timeDiffWeeks = currentDate.diff(date, 'weeks');
    const timeDiffMonths = currentDate.diff(date, 'months');
    const timeDiffYears = currentDate.diff(date, 'years');
    if (timeDiffYears > 0) {
      return timeDiffYears + 'y';
    }
    if (timeDiffMonths > 0) {
      return timeDiffMonths + 'mo';
    }
    if (timeDiffWeeks > 0) {
      return timeDiffWeeks + 'w';
    }
    if (timeDiffDays > 0) {
      return timeDiffDays + 'd';
    }
    if (timeDiffHours > 0) {
      return timeDiffHours + 'h';
    }
    if (timeDiffMinutes > 0) {
      return timeDiffMinutes + 'm';
    }
    if (timeDiffSeconds > 0) {
      return timeDiffSeconds + 's';
    }
    return;
  }
}
