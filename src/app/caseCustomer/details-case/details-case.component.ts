import { Component, OnInit } from "@angular/core";
import { ExcelService } from "../../shared/excel.service";
import { RestApiService } from "../../shared/rest-api.service";
import { ActivatedRoute } from '@angular/router';
import { ModalContentComponent } from '../modals/modal-component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
@Component({
  selector: 'app-details-case',
  templateUrl: './details-case.component.html',
  styleUrls: ['./details-case.component.scss']
})
export class DetailsCaseComponent implements OnInit {
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
        console.log(this.dataParams)
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
    this.btnLoadexcel = false;
    if (this.dataParams.caseID) {
      this.restApiService.fngGetByCase(this.dataParams)
        .then(res => {
          this.reciveData = res;
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
          this.reciveData.length > 0 ? this.btnLoadexcel = true : this.btnLoadexcel = false
          if (res.length <= 0) {
            this.openModalWithComponent();
          }
        }).catch(() => {
          this.openModalWithComponent();
        });
    }
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
