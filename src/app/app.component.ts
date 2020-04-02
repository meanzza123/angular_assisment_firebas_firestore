import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Location } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private location: Location,public router: Router) {

    setTheme('bs4');
  }

  goBack() {
    this.location.back();
  }
}
