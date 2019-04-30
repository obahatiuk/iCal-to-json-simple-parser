import { Component } from "@angular/core";

@Component({
    template: `
    <div style="position: fixed;width: 100%;height: 100%;display: table;">
        <div  style="display: table-cell;">
            <h2>Here is some api info:</h2>
            <h4><b>POST</b> /parsing/json</h4>
            <p>Content-Type: <span style="background-color: #edeff2;">multipart/form-data</span></p>
            <h3>Parameters:</h3>
            <p><span class="api-info-parameter-name">'textToConvert'</span> string with iCal</p>
            <p><span class="api-info-parameter-name">'newLineSeparator'</span> string with characters you used for lines separation</p>
        </div>
    </div>
    `,
    styles: [`
    .api-info-parameter-name {
        font-size: 15px;
        font-family: 'Consolas';
        color: darkgreen;
        background-color: #edeff2;
    }
    `]
})
export class ApiInfoComponent{}
