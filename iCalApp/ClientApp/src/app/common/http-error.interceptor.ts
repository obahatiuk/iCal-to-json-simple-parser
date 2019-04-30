import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import {  catchError} from 'rxjs/operators';
import { ErrorComponent } from "../error/error.component";
import 'rxjs/add/observable/of';
import { MatDialog } from "@angular/material";

@Injectable()
export class HttpErrorResponseInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(req).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    this.dialog.open(ErrorComponent)
                }
                return Observable.of(err);
            }))
    }
    
    constructor(public dialog:MatDialog){}
}
