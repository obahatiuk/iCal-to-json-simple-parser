import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject"
import { Router } from "@angular/router";

@Injectable()
export class DataService {

    isAnyDataToConvert = new BehaviorSubject(false);

    json = new BehaviorSubject({});  

    constructor(private http: HttpClient, private router: Router) {  
    }

    convertFile(file: File) {
        this.isAnyDataToConvert.next(true);

        var formData = new FormData();
        formData.append('fileToConvert', file, file.name);
        this.http.post('api/iCalParser/ConvertiCalFileToSimpleJson', formData)
        .subscribe(
            data => 
            {
                console.log(data);
                this.json.next(data);
                this.router.navigate(['result']);
            });
    }

    convertText(text: string, newLineSeparator: string) {
        this.isAnyDataToConvert.next(true);

        var formData = new FormData();
        formData.append('textToConvert', text);
        formData.append('newLineSeparator', newLineSeparator)
        this.http.post('api/iCalParser/ConvertiCalTextToSimpleJson', formData)
        .subscribe(
            data => 
            {
                console.log(data);
                this.json.next(data);
                this.router.navigate(['result']);
            });
    }
}
