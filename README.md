# Raven In-App Angular SDK
Raven In-app SDK lets you add a notification center in your web or mobile app. If you haven't 


## Setup

### Step 1
Before setting up the SDK, please make sure you have followed the steps to [setup the Raven In-App Integration](https://docs.ravenapp.dev/in-app/integrations/raven) first.

### Step 2

Run the following commands your project root directory :

```
npm i @ravenapp/raven-inapp-angular
```
### Step 3

Import RavenInAppModule from '@ravenapp/raven-inapp-angular' and add it to the imports array in the app.module.ts file.

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RavenInAppModule } from '@ravenapp/raven-inapp-angular';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RavenInAppModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Step 4

Please refer to the below code to consume the InApp Angular SDK in your app.

```
<inapp-notification-center
      [color]="<color>"
      [indicatorType]="<indicator_type>"
      [fontStyle]="<fontStyle>"
      [userId]="<user_id>"
      [appId]="<app_id>"
      [signature]="<signature>"
      [displayStyle]="<displayStyle>"
      [position]="<position>"
      [header]"<true|false>"
      [onClickNotification]="<callbackFunction_reference>"
    >
</inapp-notification-center>
```

|Attribute | Purpose | Examples |
|--------- | ------- | -------- |
|userId | Unique identifier of the user opening the notification center | |
|appId| | Raven App ID. Go to Raven dashboard > Settings > AppID | 
|signature| Unique signature generated for the user as described [here](https://app.gitbook.com/o/fOW2cG82hufCVVoTWX7c/s/-MG-HQd2A2Z9XgtUEjJF/~/changes/ZHEZ9iwpjrSgRPltkzMp/in-app/integrations/raven#step-2.-generate-a-unique-signature-for-every-user) | |
|onClickNotification| Method that handles notification click. Args: (clickAction, customData). ClickAction string and CustomData map will be provided in the template and passed to the handler.  Use clickAction to identify what action to perform on click and customData to pass any additional data that might be useful to perfor the click action. | ```(clickAction, customData) => { if (clickAction === "OPEN_ORDER_PAGE") { open("/orders", customData["orderId"])}}``` |
|color | This is your primary color. It will get applied to the buttons and other UI components in the inapp center | 'red', '#FF0000', 'rgb(255,0,0)' (only strings) |
|indicatorType| This attribute accepts only two values i.e 'dot', 'count'. The 'dot' will show a dot on the bell icon whenever a new notification comes and the 'count' will show the count of new notifications. | 'dot', 'count' (only strings) |
|fontStyle| Custom font family for the inapp center. Default will take your system font. | 'Times', 'Courier' etc (only strings) |
|displayStyle| displayStyle can be either 'drawer' or 'bubble' or 'fullScreen'. Bubble displays the notification list inside a popover. Drawer displays the notification list as full  height on the right or left side of the screen depending on the position value. FullScreen comes with no bell-icon and inherits height and width from parent. |'drawer','bubble' (only strings) |
|position| If the displayStyle is 'drawer' then position accepts two values, i.e 'left' and 'right'. If the display style is 'bubble' then position accepts three values, i.e 'left', 'center' and 'right'.|'left', 'right', 'center' (only strings) |
|header|header can be either true or false. You can pass true, if you want the notification header which has unread count, refresh button, mark all read and close button. You can pass false, if you don't want the notification header. | true or false (boolean) |

* Note: userId, appId and signature are the compulsory attributes, remaining are optional.
* When display style is 'fullScreen', there will not be bell icon. Inorder to access new notification's count, import the CountService and subscribe the count.
```
import { Component, OnInit } from '@angular/core';
import { CountService } from '@ravenapp/raven-inapp-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private countService: CountService) {}
  ngOnInit(): void {
    this.countService.count.subscribe((count: any) => console.log(count));
  }
}
 ```
 

### In-App Angular Demo App

You can follow the below process to see the demo of In-App React SDK.

### Step1 

Clone this repo

```
git clone https://github.com/ravenappdev/inapp-angular-sdk.git
```

### Step 2

If you haven't installed angular cli, install it using the following command:

```
npm install -g @angular/cli
```

If you are using a mac, use 

```
sudo npm install -g @angular/cli
```

### Step3

After installing angular cli, run the following command in the project root directory:

```
npm install
```

### Step4

Change the userId, appId and signature variables in projects/test/src/app/app.component.ts. More details on this present in the SDK docs.

### Step5

Run the following command in the project root directory to start the app:

```
ng serve test
```
