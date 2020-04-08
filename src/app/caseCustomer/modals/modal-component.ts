import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: 'modal-component',
    templateUrl: './modal.component.html',
  styleUrls: ['./modal.scss']
})

export class ModalContentComponent implements OnInit {
    itemform;
    list:any;
    numberOfItems = 0;
    @Input() data: string;
    constructor( private _bsModalRef: BsModalRef) {}

    ngOnInit() {
    }
    //close Modal
    onCancel(): void {
        this._bsModalRef.hide();
    }

}
