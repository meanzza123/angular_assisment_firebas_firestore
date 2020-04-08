import { Injectable } from "@angular/core";
import * as Excel from "exceljs";
import * as fs from "file-saver";
import { DatePipe } from "@angular/common";
@Injectable({
  providedIn: "root"
})
export class ExcelService {
  constructor(private datepipe: DatePipe) { }

  generateExcel(fileName, datas) {
    var workbook = new Excel.Workbook();
    workbook.creator = "";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.addWorksheet(`CustomerCase`, {
      views: [{ activeCell: "A4", showGridLines: false }],
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
    });
    var sheet = workbook.getWorksheet(1);
    var row = sheet.getRow(3);
    row.getCell(1).font = {
      name: 'Arial Black',
      color: { argb: '8cc53f' },
      family: 2,
      size: 12
    };

    sheet.mergeCells('A3:C3');
    row.getCell(1).value = "Report Case : Details";
    row.commit()

    sheet.mergeCells('A4:U4');
    row.getCell(1).value = "Details Created ", new Date();
    row.commit()


    var row = sheet.getRow(5);
    sheet.mergeCells('A5:L5');
    row.getCell(1).value = "Detail Date is ...", fileName;
    row.commit();



    var row = sheet.getRow(7);
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.fill = {
      type: 'pattern',
      pattern: "solid",
      fgColor: {
        argb: "8cc53f"
      },
      bgColor: {
        argb: "FF000000"
      }
    };
    row.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    row.getCell(1).value = "No.";
    row.getCell(2).value = "Case id";
    row.getCell(3).value = "Topic";
    row.getCell(4).value = "Description";
    row.getCell(5).value = "Date case";
    row.getCell(6).value = "Create By";
    row.getCell(7).value = "Status";
    row.commit();

    for (let i = 0; i <= 7; i++) {
      const count = i + 1;
      var col = sheet.getColumn(count);
      if (count === 4) {
        col.width = 32;
      } else if (count === 1)  {
        col.width = 10;
      }else{
        col.width = 17;
      }
    }


    datas.forEach((val: any, i: number) => {
      const count = i + 8;

      //end count cpe type

      var row = sheet.getRow(count);
      row.alignment = { vertical: "middle", horizontal: 'center' };
      row.font = { bold: true };
      row.getCell(1).value = i + 1;
      row.getCell(2).value = val.data.caseID;
      row.getCell(3).value = val.data.topic;
      row.getCell(4).value = val.data.description;
      row.getCell(5).value = this.datepipe.transform(val.data.CreateDate, "dd/MM/yyyy");
      row.getCell(6).value = val.data.caseBy;
      row.getCell(7).value = val.data.statusCase;
      row.commit();
    })





    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then(data => {
      let blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      });
      fs.saveAs(blob, fileName + ".xlsx");
    });
  }

}
