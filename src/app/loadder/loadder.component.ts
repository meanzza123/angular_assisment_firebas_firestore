import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../shared/load.service';
import { LoaderState } from './loadder.model';

@Component({
  selector: 'app-loader',
  templateUrl: './loadder.component.html',
  styleUrls: ['./loadder.component.scss']
})
export class LoaderComponent implements OnInit {

  show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
