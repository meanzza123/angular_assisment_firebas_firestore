import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { RestApiService } from "../../shared/rest-api.service";
import { DatePipe } from "@angular/common";
import { Router } from '@angular/router';
import { ModalContentComponent } from '../modals/modal-component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-create-case',
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss']
})
export class CreateCaseComponent implements OnInit {
  bsModalRef: BsModalRef;
  angAddForm: FormGroup;
  updateTime = new Date().toLocaleString();
  imageText = [];
  p: number = 1;
  //case Select
  cases = [
    "Immediately", "Urgent", "Normal"
  ];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: RestApiService,
    private datepipe: DatePipe,
    private modalService: BsModalService
  ) {
    this.updateTime = this.datepipe.transform(this.updateTime, "yyyyMMdd");
    //create Form 
    this.angAddForm = this.formBuilder.group({
      createBy: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      topic: new FormControl('', [Validators.required, Validators.minLength(6)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      image: new FormControl(this.imageText),
      statusCase: new FormControl('', [Validators.required]),

    });
  }
  ngOnInit() {

  }

  //click next Page
  pageChange(newPage: number) {
    this.router.navigate([''], { queryParams: { page: newPage } });
  }

  openModalWithComponent() {
    const initialState = {
      list: [
        {
          "head": "เพิ่มข้อมูลสำเร็จ",
          "class": "bg-success",
          "details": "ท่านได้ทำการเพิ่ม ข้อมูลเสร็จสิ้นแล้ว"
        }
      ]
    };
    this.bsModalRef = this.modalService.show(ModalContentComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  //fn Select Image fecth push array  and preview
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageText.push({ src: event.target.result });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  //Check Validations Form
  get formChk() {
    return this.angAddForm.controls;
  }

  //reset Form and Data
  reset() {
    this.imageText = [];
    this.onSelectFile(event);
    this.angAddForm.reset();
  }

  //Create Case Data
  onSubmit() {
    this.service.fnCreateCase(this.angAddForm.value)
      .then((res) => {
        if (res) {
          this.openModalWithComponent();
        }
        this.reset();
      }).catch(() => {
      });
  }
}