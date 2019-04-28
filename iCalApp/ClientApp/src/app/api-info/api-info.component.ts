import { Component } from "@angular/core";

@Component({
    template: `
    <div style="position: fixed;width: 100%;height: 100%;display: table;">

        <div  style="display: table-cell;vertical-align: middle;">
            <h2>Here is some api info:</h2>
            <h4>Endpoint: <b><i>'api/iCalParser/ConvertiCalTextToSimpleJson'</i></b> expects multiform-data with string value with name <b><i>'textToConvert'</i></b></h4>
            <h4>Endpoint: <b><i>'api/iCalParser/ConvertiCalFileToSimpleJson'</i></b> expects multiform-data with file value with name <b><i>'fileToConvert'</i></b></h4>
        </div>
    </div>
    `
})
export class ApiInfoComponent{}
