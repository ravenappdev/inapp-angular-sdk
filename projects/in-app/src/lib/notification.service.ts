import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private isOpen = new BehaviorSubject(false);
  currentisOpen = this.isOpen.asObservable();
  private count = new BehaviorSubject(0);
  currentCount = this.count.asObservable();
  selectedNotification: any;
  private API_BASE_URL = 'https://api.ravenapp.dev';

  constructor(private titleService: Title, private http: HttpClient) {}

  READ_ALL(appId: any) {
    return (
      this.API_BASE_URL + `/v1/apps/${appId}/in_app_notifications/read_all`
    );
  }

  FETCH(appId: any) {
    return this.API_BASE_URL + `/v1/apps/${appId}/in_app_notifications/fetch`;
  }
  UPDATE(appId: any) {
    return this.API_BASE_URL + `/v1/apps/${appId}/in_app_notifications/update`;
  }

  FETCH_COUNT(appId: any, userId: any) {
    return (
      this.API_BASE_URL +
      `/v1/apps/${appId}/in_app_notifications/unread_count?user_id=${userId}`
    );
  }

  LAST_SEEN(appId: any, userId: any) {
    return (
      this.API_BASE_URL +
      `/v1/apps/${appId}/in_app_notifications/last_open?user_id=${userId}`
    );
  }

  DELIVERY_UPDATE(appId: any) {
    return this.API_BASE_URL + `/v1/apps/${appId}/in_app/status`;
  }

  ABLY_TOKEN(appId: any, userId: any, signature: any) {
    return (
      this.API_BASE_URL +
      `/v1/apps/${appId}/in_app_notifications/ably_token?user_id=${userId}&user_signature=${signature}`
    );
  }

  USER_SETUP(appId: any, userId: any, signature: any) {
    return (
      this.API_BASE_URL +
      `/v1/apps/${appId}/in_app_notifications/setup?user_id=${userId}`
    );
  }
  setSelectedNotification(notification: any) {
    this.selectedNotification = notification;
  }

  userSetup(userId: any, appId: any, signature: any) {
    return this.http.post(
      this.USER_SETUP(appId, userId, signature),
      {},
      {
        headers: {
          'X-Raven-User-Signature': signature,
        },
      }
    );
  }
  fetchCount(userId: any, appId: any) {
    return this.http.get(this.FETCH_COUNT(appId, userId));
  }

  updateLastSeen(userId: any, appId: any) {
    return this.http.put(this.LAST_SEEN(appId, userId), {});
  }

  fetchNotifications(
    userId: any,
    appId: any,
    signature: any,
    lastMessageId: any
  ) {
    return this.http.post<any[]>(
      this.FETCH(appId),
      {
        user_id: userId,
        last_message_id: lastMessageId,
      },
      {
        headers: {
          'X-Raven-User-Signature': signature,
        },
      }
    );
  }

  updateNotification(
    userId: any,
    appId: any,
    signature: any,
    status: any,
    messageId: any
  ) {
    return this.http.put(
      this.UPDATE(appId),
      {
        user_id: userId,
        message_id: messageId,
        status: status,
      },
      {
        headers: {
          'X-Raven-User-Signature': signature,
        },
      }
    );
  }

  markAllRead(userId: any, appId: any, signature: any, messageId: any) {
    return this.http.put(
      this.READ_ALL(appId),
      {
        user_id: userId,
        message_id: messageId,
      },
      {
        headers: {
          'X-Raven-User-Signature': signature,
        },
      }
    );
  }

  deliveryStatusUpdate(appId: any, messageId: any, date: any) {
    return this.http.post(this.DELIVERY_UPDATE(appId), {
      timestamp: date - 1000,
      status: 'DELIVERED',
      notification_id: messageId,
      current_timestamp: date - 1000,
    });
  }

  toggleModal(userId: any, appId: any, value: any) {
    if (value) {
      this.updateCount(0);
      if (appId && userId) {
        this.updateLastSeen(userId, appId).subscribe();
      }
    }
    this.isOpen.next(value);
  }

  updateCount(count: any) {
    this.count.next(count);
    this.setTitle(count);
  }

  setTitle(count: any) {
    let tmp = this.titleService.getTitle().indexOf(') ');
    if (count > 0) {
      this.titleService.setTitle(
        `(${count}) ${this.titleService.getTitle().substring(tmp + 1)}`
      );
    }
    if (tmp !== -1 && count === 0) {
      this.titleService.setTitle(
        this.titleService.getTitle().substring(tmp + 1)
      );
    }
  }
}
