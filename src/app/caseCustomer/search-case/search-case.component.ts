import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
@Component({
  selector: 'app-search-case',
  templateUrl: './search-case.component.html',
  styleUrls: ['./search-case.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 0, noPause: true, showIndicators: true } }
  ]
})
export class SearchCaseComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  caseID: any;
  bsModalRef: BsModalRef;
  btnSend = false;
  dateNow = new Date()
  dateStart = new Date().toLocaleString();
  dateStop = new Date().toLocaleString();
  initialState = {};
  constructor(
    private route: Router,
    private datepipe: DatePipe,
    private modalService: BsModalService
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
    this.route.navigate(["pageDetails"], { queryParams: { id: this.caseID, dateStart: this.datepipe.transform(this.dateStart, "yyyy-MM-dd"), dateStop: this.datepipe.transform(this.dateStop, "yyyy-MM-dd") } });
  }
}

