import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Datepicker Module
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {NgxPaginationModule} from 'ngx-pagination';
import { ModalContentComponent  } from './caseCustomer/modals/modal-component'
import { CreateCaseComponent } from './caseCustomer/create-case/create-case.component';
import { DetailsCaseComponent } from './caseCustomer/details-case/details-case.component';
import { SearchCaseComponent } from './caseCustomer/search-case/search-case.component';




import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './shared/excel.service';
import { RestApiService } from './shared/rest-api.service';
import { DatePipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoaderComponent} from './loadder/loadder.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from './shared/loader-interceptor.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ImageSlideComponent } from './caseCustomer/image-slide/image-slide.component';
@NgModule({
  declarations: [
    AppComponent,
    CreateCaseComponent,
    DetailsCaseComponent,
    SearchCaseComponent,
    ModalContentComponent,
    LoaderComponent,
    ImageSlideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    NgxPaginationModule,
    ModalModule.forRoot(),
    NgxDatatableModule,
    CarouselModule.forRoot()
  ],
  providers: [ExcelService, RestApiService, DatePipe,    {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  }],
  entryComponents: [ModalContentComponent,ImageSlideComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
