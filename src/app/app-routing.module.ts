import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCaseComponent } from '../app/caseCustomer/create-case/create-case.component';
import { DetailsCaseComponent } from '../app/caseCustomer/details-case/details-case.component';
import { SearchCaseComponent } from '../app/caseCustomer/search-case/search-case.component';

const routes: Routes = [
{ path: '',redirectTo: 'pageSearch', pathMatch: 'full'},
{ path: 'pageSearch', component: SearchCaseComponent },
{ path: 'pageCreate', component: CreateCaseComponent },
{ path: 'pageDetails', component: DetailsCaseComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
