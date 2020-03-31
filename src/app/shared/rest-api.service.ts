import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Case } from './case.model';
import { DatePipe } from "@angular/common";
@Injectable({
  providedIn: "root"
})
export class RestApiService {
  updateTime = new Date().toLocaleString();
  baseApiUrl = "https://us-central1-assignment-a060b.cloudfunctions.net/webApi/api/v1/";

  constructor(private http: HttpClient, private datepipe: DatePipe) { }
  //create Case
  fnCreateCase(reciveCase): Promise<any> {
    const caseIdText: any = reciveCase.statusCase.substr(0, 1) + "-" + this.datepipe.transform(this.updateTime, "yyyyMMdd");
    const createCase = this.http.post(this.baseApiUrl + "postCase", {
      caseID: caseIdText,
      caseBy: reciveCase.createBy,
      topic: reciveCase.topic,
      description: reciveCase.description,
      statusCase: reciveCase.statusCase,
      image: reciveCase.image
    }).toPromise();
    return createCase
  }

  //search Case By date
  fnGetByDate(dataParams): Promise<any> {
    const params = dataParams.dateStart + "/" + dataParams.dateStop;
    const getDataByDate = this.http.get(this.baseApiUrl + "/getCaseDate/" + params).toPromise();
    return getDataByDate
  }

  //search Case By Case
  fngGetByCase(dataParams): Promise<any> {
    const params = dataParams.caseID;
    const getDataByCase = this.http.get(this.baseApiUrl + "/getCase/" + params).toPromise();
    return getDataByCase
  }
}
