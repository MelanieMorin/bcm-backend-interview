import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PowerStation {
  name: string;
  watchStep: number;
}

@Component({
  selector: 'power-station',
  templateUrl: './power-station.component.html',
})
export class PowerStationComponent {
  @Input() station: PowerStation;
  @Input() from: Date;
  @Input() to: Date;

  loading: boolean = false;
  fileDate: Date = new Date();
  file: any;

  constructor(private http: HttpClient) {}

  export() {
    this.loading = true;
    /*const httpParams = new HttpParams()
      .append('from', formatDate(this.from))
      .append('to', formatDate(this.to));*/

    this.http
      .get(
        environment.apiUrl +
          this.station.name +
          '?from=' +
          formatDate(this.from) +
          '&to=' +
          formatDate(this.to)
      )
      .subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
        },
        (err) => {
          this.loading = false;
          console.log(err);
        }
      );
  }
}

function formatDate(date: Date): string {
  return [
    twoCharsString(date.getDate()),
    twoCharsString(date.getMonth()),
    date.getFullYear().toString(),
  ].join('-');
}

function twoCharsString(number: number) {
  return number > 10 ? number.toString() : '0' + number.toString();
}
