import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RavenInAppModule } from 'in-app';
import { AppComponent } from './app.component';

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
