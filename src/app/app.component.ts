import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PayDate } from 'src/model/pay-date';
import { PayDateCalculationService } from 'src/services/pay-date-calculation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public datepipe: DatePipe,
    private payDateCalculationService: PayDateCalculationService) {
  }

  title = 'Pay Date Calculation';
  payDate: PayDate = new PayDate();

  holidays = [
    new Date(2022, 5, 28),
    new Date(2022, 5, 30),
    new Date(2022, 6, 8),
    new Date(2022, 6, 11),
    new Date(2022, 7, 4),
    new Date(2022, 7, 10),
    new Date(2022, 7, 18),
  ];

  calculateDate() {
    let finalDueDate = this.payDateCalculationService.calculateDueDate(new Date(this.payDate.fundDay), this.holidays, this.payDate.frequency, new Date(this.payDate.payDate), this.payDate.hasDirectDiposit);
    alert("Next date :" + finalDueDate.toDateString());
  }
}
