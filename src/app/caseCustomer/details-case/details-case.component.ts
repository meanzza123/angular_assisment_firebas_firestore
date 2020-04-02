import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ExcelService } from "../../shared/excel.service";
import { RestApiService } from "../../shared/rest-api.service";
import { ActivatedRoute } from '@angular/router';
import { ModalContentComponent } from '../modals/modal-component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-details-case',
  templateUrl: './details-case.component.html',
  styleUrls: ['./details-case.component.scss']
})
export class DetailsCaseComponent implements OnInit {

  @ViewChild('search', { static: false }) search: any;

  name = 'Case Details Filter All Columns';
  public temp: Array<object> = [];
  public rows: Array<object> = [];
  public columns: Array<object>;


  reciveData: any;
  dataParams: any;
  bsModalRef: BsModalRef;
  btnLoadexcel = false;
  filename: string;
  p: number = 1;
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



  //load data from <-[api] <- search page
  loadData() {

    this.columns = [
      { prop: 'caseID', name: 'Case ID' },
      { prop: 'topic', name: 'Topic' },
      { prop: 'description', name: 'Description' },
      { prop: 'CreateDate', name: 'Date Create' },
      { prop: 'statusCase', name: 'Status' }
    ];


    this.btnLoadexcel = false;
    if (this.dataParams.caseID) {
      this.restApiService.fngGetByCase(this.dataParams)
        .then(res => {
          this.reciveData = res;
          const result = res.map(newCase => ({ caseID: newCase.caseID, topic: newCase.topic,
            description:newCase.description,CreateDate:newCase.CreateDate,statusCase:newCase.statusCase
          }));
          this.rows = this.temp = result;
          console.log(this.rows)
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
          const result = res.map(newCase => ({ caseID: newCase.data.caseID, topic: newCase.data.topic,
            description:newCase.data.description,CreateDate:newCase.data.CreateDate,statusCase:newCase.data.statusCase
          }));
          this.rows = this.temp = result;
          console.log(this.rows)
          this.reciveData.length > 0 ? this.btnLoadexcel = true : this.btnLoadexcel = false
          if (res.length <= 0) {
            this.openModalWithComponent();
          }
        }).catch(() => {
          this.openModalWithComponent();
        });
    }
  }
  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keydown')
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


  // create excell
  exportAsXLSX() {
    if (this.dataParams.caseID.length != 0) {
      this.filename = this.dataParams.caseID;
    } else {
      this.filename = this.datepipe.transform(this.dataParams.dateStart, "yyyyMMdd") + "-" + this.datepipe.transform(this.dataParams.dateStop, "yyyyMMdd");
    }
    this.excelService.generateExcel(this.filename, this.reciveData);
  }

}
