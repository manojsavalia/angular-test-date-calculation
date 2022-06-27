import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})

export class PayDateCalculationService {
    fundDueDate: Date = new Date();
    hasDirectDeposit: any = false;
    holidays: any;
    loopType: string = 'Forward';
    constructor(public datepipe: DatePipe) {
    }

    public calculateDueDate(fundDay: Date, holidaysList: Date[], paySpan: string, payDay: Date, hasDirectDeposit: boolean): Date {
        payDay.setDate(payDay.getDate() + 1); // If we take from date control on page we need to add 1 days
        fundDay.setDate(fundDay.getDate() + 1);// If we take from date control on page we need to add 1 days
        this.holidays = holidaysList;
        this.fundDueDate = new Date(fundDay);  //initialize fundDueDate=fundDay

        const minimumDate = new Date(fundDay);
        minimumDate.setDate(fundDay.getDate() + 10);// set 10 days initially for check condition with 10 days minimum
        this.hasDirectDeposit = hasDirectDeposit;
        return this.CalculateDate(minimumDate, payDay, paySpan);
    }

    private CalculateDate(minimumFundDate: Date, payDay: Date, paySpan: string): Date {
        let isFundDueDate = false;
        while (!isFundDueDate) {
            this.loopType = 'Forward';
            this.fundDueDate = payDay;// set fundDate=payDay
            if (!this.hasDirectDeposit) {  //// Check if hasDirectDeposit
                this.fundDueDate.setDate(this.fundDueDate.getDate() + 1);
            }
            this.checkWeekend();
            this.checkHoliday(this.fundDueDate);
            if (this.fundDueDate > minimumFundDate) {
                isFundDueDate = true;
                continue;
            }
            const nextPayDays = this.getNextPayDays(paySpan, minimumFundDate);
            payDay.setDate(payDay.getDate() + nextPayDays);
        }
        return this.fundDueDate;
    }

    private getNextPayDays(paySpan: string, fundDay: Date): number {
        let nextPayDays = 10;
        if (paySpan === "weekly") {
            nextPayDays = 7;
        } else if (paySpan === "bi-weekly") {
            nextPayDays = 15;
        } else if (paySpan === "monthly") {
            nextPayDays = this.daysInMonth(fundDay); // Current Month's total days 
        }
        return nextPayDays;
    }

    private checkWeekend() {
        if (this.fundDueDate.getDay() == 6 || this.fundDueDate.getDay() === 0) {
            if (this.loopType === 'Forward') {
                this.fundDueDate.setDate(this.fundDueDate.getDate() + 1);
            }
            else {
                this.fundDueDate.setDate(this.fundDueDate.getDate() - 1);
            }
            this.checkWeekend();
        }
    }

    private checkHoliday(dueDate: Date) {
        const currDate = this.datepipe.transform(dueDate, 'yyyy-MM-dd');
        if (this.holidays.findIndex((date: Date) => this.datepipe.transform(date, 'yyyy-MM-dd') === currDate) >= 0) {
            this.loopType = 'Reverse';
            this.fundDueDate.setDate(this.fundDueDate.getDate() - 1);
            this.checkWeekend();
            this.checkHoliday(this.fundDueDate);
        }
    }

    private daysInMonth(fundDate: Date) {
        return new Date(fundDate.getFullYear(), fundDate.getMonth() + 1, 0).getDate();
    }

}