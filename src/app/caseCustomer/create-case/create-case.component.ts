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
  initialState = {};
  //case Select
  cases = [
    "Immediately", "Urgent", "Normal"
  ];
  resizedBase64: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: RestApiService,
    private datepipe: DatePipe,
    private modalService: BsModalService
  ) {
    this.updateTime = this.datepipe.transform(this.updateTime, "yyyyMMdd");
    //create Form 

  }
  ngOnInit() {
    this.createForm();
    this.reset();
  }

  //click next Page
  pageChange(newPage: number) {
    this.router.navigate([''], { queryParams: { page: newPage } });
  }

  createForm() {
    this.angAddForm = this.formBuilder.group({
      createBy: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      topic: new FormControl('', [Validators.required, Validators.minLength(6)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      image: new FormControl(''),
      statusCase: new FormControl('', [Validators.required]),
    });
    this.reset();
  }

  refresh(): void {
    window.location.reload();
}

  openModalWithComponent() {
    const initialState = this.initialState;
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
          this.compressImage(event.target.result, 600, 600).then(compressed => {
            this.imageText.push({ src: compressed });
          })
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
    this.angAddForm.reset();
    this.imageText = [];
  }

  //Create Case Data
  onSubmit() {
    this.angAddForm.value.image = this.imageText;
    this.service.fnCreateCase(this.angAddForm.value)
      .then((res) => {
        if (res) {
          this.initialState = {
            list: [
              {
                "head": "เพิ่มข้อมูลสำเร็จ",
                "class": "bg-success",
                "details": "ท่านได้ทำการเพิ่ม ข้อมูลเสร็จสิ้นแล้ว"
              }
            ]
          };
          this.openModalWithComponent();
        }
        this.createForm();
      }).catch((error) => {
        if (error) {
          this.initialState = {
            list: [
              {
                "head": "ไม่สามารถเพิ่มข้อมูลได้",
                "class": "bg-danger",
                "details": "เกิดข้อผิดพลาด ไม่สามารถเพิ่มข้อมูลได้"
              }
            ]
          };
          this.openModalWithComponent();
        }
      });
  }


  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }
}