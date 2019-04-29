import { Component } from "@angular/core";
import { DataService } from "../shared/data.service";

@Component({
    template: `
    <div style="margin-top: 20px;">
      <pre>{{jsonData | json}}</pre>
    </div>
    `,
    selector : "json-result"
})
export class JsonResultComponent {
    isAnyResultAvailable: boolean = false;
    jsonData;

    constructor(private dataService: DataService) {
        this.dataService.isAnyDataToConvert.subscribe(anyData => this.isAnyResultAvailable = anyData);
      this.dataService.json.subscribe(json => {
        this.jsonData = json;
        //this.jsonData = JSON.stringify(json)
      console.log(this.jsonData)
      });
    }
}
