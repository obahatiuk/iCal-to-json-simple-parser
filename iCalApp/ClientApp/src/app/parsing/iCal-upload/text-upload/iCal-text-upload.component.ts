import { Component } from "@angular/core";
import { DataService } from "../../shared/data.service";

@Component({
    template: `
    <div>
        <textarea type="text" [(ngModel)]="text"></textarea>
    </div>
    <div>
        <button (click)="convert()" type="button">Convert</button>
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
