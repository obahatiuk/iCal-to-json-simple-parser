import { Component } from "@angular/core";

@Component({template: `
    <h2 mat-dialog-title style="color: #ac2925!important;">Error occured</h2>
    <mat-dialog-content>Something went wrong</mat-dialog-content>
    <mat-dialog-actions>
        <button class="btn btn-danger" mat-button [mat-dialog-close]="true">Ok</button>
    </mat-dialog-actions>
`})
export class ErrorComponent {
    
}