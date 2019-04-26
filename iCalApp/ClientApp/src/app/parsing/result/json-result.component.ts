import { Component } from "@angular/core";

@Component({
    template: `
    <div>
        Not working
    </div>
    `,
    selector : "json-result"
})
export class JsonResultComponent {
    isAnyResultAvailable: boolean = false;
}