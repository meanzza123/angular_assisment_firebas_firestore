import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ExcelService } from "../../shared/excel.service";
import { RestApiService } from "../../shared/rest-api.service";
import { ActivatedRoute } from '@angular/router';
import { ModalContentComponent } from '../modals/modal-component';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageSlideComponent } from '../image-slide/image-slide.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
@Component({
  selector: 'app-details-case',
  templateUrl: './details-case.component.html',
  styleUrls: ['./details-case.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 0, noPause: true, showIndicators: true } }
  ]
})
export class DetailsCaseComponent implements OnInit {

  @ViewChild('search', { static: false }) search: any;

  name = 'Case Details Filter All Columns';
  public temp: Array<object> = [];
  public rows: Array<object> = [];
  public columns: Array<object>;

  activeCaseID: any;
  activeTopic: any;
  activeStatus: any;
  activeDate: any;

  reciveData: any;
  dataParams: any;
  bsModalRef: BsModalRef;
  btnLoadexcel = false;
  filename: string;
  p: number = 1;
  isCollapse: any;
  datatoModal = this.route.queryParams;
  constructor(
    private excelService: ExcelService,
    private restApiService: RestApiService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.datatoModal
      .subscribe(params => {
        this.dataParams = params;
      })
    this.loadData();
  }

  pageChange(newPage: number) {
    this.router.navigate([''], { queryParams: { page: newPage } });
  }

  openModalWithComponent() {
    const initialState = {
      list: [
        {
          "head": "ผลการค้นหา",
          "class": "bg-danger",
          "details": "ไม่พบข้อมูล"
        }
      ]
    };
    this.bsModalRef = this.modalService.show(ModalContentComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }


  openModalImage(imageLoadder) {

    const initialState = {
      imageLoadder
    }


    this.bsModalRef = this.modalService.show(ImageSlideComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }


  //load data from <-[api] <- search page
  loadData() {

    this.columns = [
      { prop: 'caseID', name: 'Case ID' },
      { prop: 'topic', name: 'Topic' },
      { prop: 'description', name: 'Description' },
      { prop: 'CreateDate', name: 'Date Create' },
      { prop: 'CreateBy', name: 'Create By' },
      { prop: 'statusCase', name: 'Status' },
    ];

    this.btnLoadexcel = false;
    if (this.dataParams.id) {
      this.restApiService.fngGetByCase(this.dataParams)
        .then(res => {
          this.reciveData = res;
          const result = res.map(newCase => ({
            caseID: newCase.data.caseID, topic: newCase.data.topic,
            description: newCase.data.description, CreateDate: newCase.data.CreateDate, CreateBy: newCase.data.caseBy, statusCase: newCase.data.statusCase, image: newCase.data.image
          }));
          this.rows = this.temp = result;
          this.reciveData.length > 0 ? this.btnLoadexcel = true : this.btnLoadexcel = false
          if (res.length <= 0) {
            this.openModalWithComponent();
          }
        })
        .catch(() => { });
    } else {
      this.restApiService.fnGetByDate(this.dataParams)
        .then(res => {
          this.reciveData = res;
          const result = res.map(newCase => ({
            caseID: newCase.data.caseID, topic: newCase.data.topic,
            description: newCase.data.description, CreateDate: newCase.data.CreateDate, CreateBy: newCase.data.caseBy, statusCase: newCase.data.statusCase, image: newCase.data.image
          }));
          this.rows = this.temp = result;
          this.reciveData.length > 0 ? this.btnLoadexcel = true : this.btnLoadexcel = false
          if (res.length <= 0) {
            this.openModalWithComponent();
          }
        }).catch(() => {
          this.openModalWithComponent();
        });
    }
  }
  getRowHeight(row) {
    return row.height;
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });


  }


  updateFilter(val: any) {
    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    const count = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.temp[0]);
    // assign filtered matches to the active datatable
    this.rows = this.temp.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  sortDesc(value) {
    this.rows.sort((a, b) => (a[value] < b[value]) ? 1 : -1)
  }

  sortAsc(value) {
    this.rows.sort((a, b) => (a[value] > b[value]) ? 1 : -1)
  }

  // create excell
  exportAsXLSX() {
    if (this.dataParams.id) {
      this.filename = this.dataParams.id;
    } else {
      this.filename = this.datepipe.transform(this.dataParams.dateStart, "ddMMyyyy") + "_" + this.datepipe.transform(this.dataParams.dateStop, "ddMMyyyy");
    }
    this.excelService.generateExcel(this.filename, this.reciveData);
  }

}
