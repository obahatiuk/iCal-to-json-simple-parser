import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";

@Injectable()
export class DataService {

    json = new Subject();  

    constructor(private http: HttpClient) {        
    }

    convertFile(file: File) {
        var formData = new FormData();
        formData.append('fileToConvert', file, file.name);
        this.http.post('api/iCalParser/ConvertiCalToSimpleJson', formData)
        .subscribe( data => this.json.next(data));
    }
}