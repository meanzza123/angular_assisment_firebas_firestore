import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-case',
  templateUrl: './search-case.component.html',
  styleUrls: ['./search-case.component.scss']
})
export class SearchCaseComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  caseID: any;

  btnSend = false;
  dateNow = new Date()
  dateStart = new Date().toLocaleString();
  dateStop = new Date().toLocaleString();

  constructor(
    private route: Router
  ) {

  }
  ngOnInit() {
    this.clear();
  }





  //check valid caseID
  keyPress(event: any) {
    const pattern = /^[a-zA-Z0-9_-]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }


  //input Change To check validate
  onInputChange() {
    const dateFrom = new Date(this.dateStart)
    const dateTo = new Date(this.dateStop)
    if (this.dateStart && this.dateStop !== '') {
      this.caseID = '';
      this.btnSend = false;
      if (dateFrom.getTime() > dateTo.getTime()) {
        this.dateStart = ''
        this.dateStop = ''
      } else {
        this.btnSend = true;
      }
    } else if (this.caseID != '') {
      this.btnSend = false;
      this.dateStart = ''
      this.dateStop = ''
      if (this.caseID.length > 13) {
        this.btnSend = true;
      }
    }
  }


  //clear forms
  clear() {
    this.caseID = '';
    this.dateStart = '';
    this.dateStop = '';
    this.btnSend = false;
  }

  // send param to detail page -> load data
  searchCase() {
    this.route.navigate(["pageDetails"], { queryParams: { caseID: this.caseID, dateStart: this.dateStart, dateStop: this.dateStop } });
  }
}

