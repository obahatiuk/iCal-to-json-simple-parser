import { Component } from "@angular/core";

@Component({
    selector: 'iCal-upload',
    template: `
    <div>
        <h1>Welcome to Simple iCal to JSON parser</h1>

        <p>Please note that temporary this parser only converts iCal to JSON. There is no option for jCal format</p>
        <p>Each component will be parsed to object which will have VALUE property for value</p>
        <p>Please select only one file</p>
    </div>
    <div>
        <ul class="nav nav-tabs">
        <li [routerLinkActive]='["link-active"]'><a [routerLink] = '["/"]'>Text Upload</a></li>
        <li [routerLinkActive]='["link-active"]'><a  [routerLink] = '["file-upload"]'>File upload</a></li>
    </ul>
    </div>
    <div>
        <router-outlet></router-outlet>
    </div>
    `
})
export class iCalUploadComponent {
}