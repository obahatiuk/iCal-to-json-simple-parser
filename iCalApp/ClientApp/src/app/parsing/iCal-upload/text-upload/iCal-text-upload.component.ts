import { Component } from "@angular/core";
import { DataService } from "../../shared/data.service";

@Component({
    template: `
    <div>
    
    <div class="col-md-10">
        <textarea type="text" [(ngModel)]="text" placeholder="Paste your iCal here..."></textarea>
    </div>
    <div class="col-md-1 button-area">
        <button (click)="convert()" class="btn btn-success button-area-button" type="button">Convert</button>
    </div>
    </div>
    `,
    styles: [`
    textarea{
        margin-top: 10px;
        width: 400px;
        height: 400px;
        display: block;
        margin-left: auto;
        margin-right: auto;
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
    text: string;

    constructor(private dataService: DataService) {
        
    }

    convert() {
        console.log(this.text);
        var newLineSplit = this.text.split('\n');

        this.text = "";

        

        for(var i = 0; i < newLineSplit.length; i ++) {
          this.text += newLineSplit[i] + '<br/>';
        }
        
        this.dataService.convertText(this.text);
    }
    
}
