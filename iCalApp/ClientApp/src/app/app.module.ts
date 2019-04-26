import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { DragAndDropFileDirective } from './home/drag-and-drop-file.directive';
import { DataService } from './parsing/shared/data.service';
import { iCalInputComponent } from './parsing/file-upload/ical-input.component';
import { JsonResultComponent } from './parsing/result/json-result.component';
import { JsonPrettyPrintPipe } from './parsing/result/json-prety-print.pipe';
import { CanActivateResultGuard } from './parsing/result/can-activate-result.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    DragAndDropFileDirective,
    iCalInputComponent,
    JsonResultComponent,
    JsonPrettyPrintPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: iCalInputComponent, pathMatch: 'full' },
      { path: 'result', component: JsonResultComponent, canActivate: [CanActivateResultGuard] },
      { path: '', redirectTo: '/', pathMatch: 'prefix'}
    ])
  ],
  providers: [
    DataService,
    CanActivateResultGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


