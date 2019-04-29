import { Component } from "@angular/core";
import { DataService } from "../../shared/data.service";

@Component({
    template: `
    <div>
    
    <div class="col-md-11">
        <textarea type="text" [(ngModel)]="text" class="col-md-12" placeholder="Paste your iCal here..."></textarea>
    </div>
    <div class="col-md-1 button-area">
        <button (click)="convert()" class="btn btn-success button-area-button" type="button">Convert</button>
    </div>
    </div>

    <div *ngIf="!isTextValid">
        <div *ngIf="text == undefined" class="alert alert-danger">Please paste text</div>
        <div *ngIf="text != undefined" class="alert alert-danger">It seens that there is no new line values and we won't be able to parse it</div>
    </div>
    `,
    styles: [`
    textarea{
        margin-top: 10px;
        height: 400px;
        display: block;
    }
    
    .button-area-button {
        margin: 5px;
    }
    
    @media(min-width: 991px) {
        .button-area {
            height: 400px;
        }
        
        .button-area-button {
            position: absolute; right: 0;bottom: 0;
        }
    }
    
    `]
})
export class iCalTextUploadComponent {
    isTextValid: boolean = true;
    text: string;

    constructor(private dataService: DataService) {
    }

    convert() {
        
        this.isTextValid = this.validateText(this.text);

        var newLineSplit = this.text.split('\n');

        this.isTextValid = newLineSplit.length != 0;

        if(this.isTextValid) {
            this.text = "";      

            for(var i = 0; i < newLineSplit.length; i ++) {
              this.text += newLineSplit[i] + '<br/>';
            }
            
            this.dataService.convertText(this.text, '<br/>');
        }
    }
    
    validateText(text) : boolean{
        return text == undefined;
    }

}
