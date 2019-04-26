import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { DataService } from "../shared/data.service";

@Injectable()
export class CanActivateResultGuard implements CanActivate{

    constructor(private dataService: DataService, private router: Router) {
        
    }

  canActivate() {
      if(this.dataService.isAnyDataToConvert.value)
        return true;
      this.router.navigate(['/']);
    }
}
