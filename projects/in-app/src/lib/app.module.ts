import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RavenInAppComponent } from './app.component';
import { BellIconComponent } from './components/bell-icon/bell-icon.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';
@NgModule({
  declarations: [
    RavenInAppComponent,
    BellIconComponent,
    NotificationsComponent,
    NotificationComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule],
  exports: [RavenInAppComponent, NotificationsComponent],
})
export class RavenInAppModule {}
