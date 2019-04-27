import { Component } from "@angular/core";
import { DataService } from "../../shared/data.service";

@Component({
    selector: 'ical-file-upload',
    templateUrl: './ical-file-upload.component.html',
    styles: [`
    .dropzone {
      margin: 10px;
      min-height: 400px;
      min-width: 800px;
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
    file: File;

  allowedFileExtensions: Array<string> = ['ics'];

  constructor(private dataService: DataService) {

  }

  addFiles(event) {
    var files = [];

    if (event.target != undefined && event.target.files.length != 0)
      files = event.target.files
    else if (event.files != undefined)
      files = event.files;

    let validFiles = this.validateFileInput(files);

    if(validFiles.length != 0) {
      this.file = validFiles[0];
      this.dataService.convertFile(this.file);//.subscribe(data => console.log(data));
    }    
  }

  validateFileInput(files: File[]) : File[]{
    let validFiles: Array<File> = []; 

    if (files != undefined && files.length > 0) {
            
      Array.prototype.forEach.call(files, f => {
          var name = f.name.split('.');
          if(this.allowedFileExtensions.indexOf(name[name.length - 1]) != -1)
              validFiles.push(f);
      })
    }

    return validFiles;    
  }
}
