import { Component, AfterViewInit } from "@angular/core";
import { DataService } from "../../shared/data.service";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "../../../error/error.component";

@Component({
    selector: 'ical-file-upload',
    templateUrl: './ical-file-upload.component.html',
    styles: [`
    .dropzone {
      margin: 10px;
      min-height: 400px;
      display: table;
      width: 100%;
      background-color: #eee;
      border: dashed 4px #aaa;
      border-radius: 15px;
    }
    
    .text-wrapper {
      display: table-cell;
      vertical-align: middle;
    }
  
    .centered-text {
      text-align: center;
    }
  
    .glyphicon {
      font-size: 90px;
      margin: 10px;
    }
    .centered-text p {
      font-size: 30px;
    }
  
    `]
})
export class iCalFileUploadComponent {
  // ngAfterViewInit(): void {
  //   setTimeout( () => this.dialog.open(ErrorComponent, {
  //   }), 3000);
  // }
    file: File;
    isFileValid = true;

  allowedFileExtensions: Array<string> = ['ics'];

  constructor(private dataService: DataService) {

  }

  addFiles(event) {
    var files = [];

    if (event.target != undefined && event.target.files.length != 0)
      files = event.target.files
    else if (event.files != undefined)
      files = event.files;

    this.file = files[0];
    this.isFileValid = this.validateFileInput(this.file);

    if(this.isFileValid) {     
      this.dataService.convertFile(this.file);//.subscribe(data => console.log(data));
    }
  }

  validateFileInput(file: File) : boolean {

    if (file == undefined) 
      return false;

    var name = file.name.split('.');
    if(this.allowedFileExtensions.indexOf(name[name.length - 1]) != -1)
      return true

    return false;    
  }
}
