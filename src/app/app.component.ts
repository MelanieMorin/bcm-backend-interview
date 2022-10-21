import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PowerStation } from './power-station/power-station.component';
import { stations } from '../../power-stations';

@Component({
  selector: 'my-app',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private configuration: any;
  dateRange: FormGroup;
  powerStations: PowerStation[] = [];

  constructor() {
    this.initDateForm();
    this.initConfig();
  }

  private initDateForm(): void {
    const todayDate = new Date();
    let oneWeekAgoDate = new Date();
    oneWeekAgoDate.setDate(todayDate.getDate() - 7);

    this.dateRange = new FormGroup(
      {
        start: new FormControl<Date | null>(todayDate),
        end: new FormControl<Date | null>(oneWeekAgoDate),
      },
      Validators.required
    );
  }

  private initConfig() {
    this.powerStations = stations;
  }
}
