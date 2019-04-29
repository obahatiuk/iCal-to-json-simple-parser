import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { DragAndDropFileDirective } from './home/drag-and-drop-file.directive';
import { DataService } from './parsing/shared/data.service';
import { iCalFileUploadComponent  } from './parsing/iCal-upload/file-upload/ical-file-upload.component';
import { JsonResultComponent } from './parsing/result/json-result.component';
import { CanActivateResultGuard } from './parsing/result/can-activate-result.guard';
import { iCalUploadComponent } from './parsing/iCal-upload/iCal-upload.component';
import { iCalTextUploadComponent } from './parsing/iCal-upload/text-upload/iCal-text-upload.component';
import { ApiInfoComponent } from './api-info/api-info.component';
import { ErrorComponent } from './error/error.component';
import { MatDialogModule } from '@angular/material';
import { HttpErrorResponseInterceptor } from './common/http-error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    DragAndDropFileDirective,
    iCalFileUploadComponent,
    JsonResultComponent,
    iCalUploadComponent,
    iCalTextUploadComponent,
    ApiInfoComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'convert', component: iCalUploadComponent, children: [
        { path: 'text', component: iCalTextUploadComponent},
        { path: 'file', component: iCalFileUploadComponent},
        { path: '**', redirectTo: 'text'}
      ] },
      { path: 'api-info', component: ApiInfoComponent},
      { path: 'result', component: JsonResultComponent, canActivate: [CanActivateResultGuard] },
      { path: '**', redirectTo: 'convert/text'}
    ])
  ],
  providers: [
    DataService,
    CanActivateResultGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorResponseInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }


