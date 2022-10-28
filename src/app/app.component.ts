import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { stations } from '../../power-stations';

export interface ResponseProperties {
    start: string;
    end: string;
    value: string;
}
export interface ResponseFormat {
    type: string,
    properties: ResponseProperties
}
export interface PowerStation {
    name: string;
    watchStep: number;
    format: ResponseFormat;
}

export interface TotalPowerByDate {
    datetime: Date,
    totalPower: number;
}

@Component({
    selector: 'my-app',
    templateUrl: `./app.component.html`,
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    dateRange: FormGroup;
    powerStations: PowerStation[] = [];
    loading: boolean = false;

    result: TotalPowerByDate[] = [];

    constructor(
        private http: HttpClient
    ) {
        this.initDateForm();
        this.initConfig();
    }

    private initDateForm(): void {
        const todayDate = new Date();
        let oneWeekAgoDate = new Date();
        oneWeekAgoDate.setDate(todayDate.getDate() - 7);

        this.dateRange = new FormGroup(
            {
                start: new FormControl<Date | null>(oneWeekAgoDate),
                end: new FormControl<Date | null>(todayDate),
            },
            Validators.required
        );
    }

    private initConfig() {
        this.powerStations = stations;
    }

    getApiData() {
        this.loading = true;
        const httpParams = new HttpParams()
            .append('from', formatDate(this.dateRange.get('start').value))
            .append('to', formatDate(this.dateRange.get('end').value));

        this.powerStations.sort((s1, s2) => s1.watchStep - s2.watchStep).forEach(station => {
            this.http.get('/api/' + station.name.toLowerCase(), {
                params: httpParams,
                responseType: 'text',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).subscribe(
                res => {
                    this.loading = false;
                    console.log(station.name);
                    this.readResponse(station, res);
                },
                err => {
                    this.loading = false;
                    console.log(err); // todo : afficher dans l'interface
                }
            );
        });
    }

    private readResponse(station: PowerStation, res: any) {

        let jsonResponse = [];

        if (station.format && station.format.type) {
            switch (station.format.type) {
                case 'json':
                    try {
                        jsonResponse = JSON.parse(res);

                        jsonResponse.forEach(lineInResponse => {
                            console.log(
                                lineInResponse[station.format.properties.value],
                                toDate(lineInResponse[station.format.properties.end])
                            );
                            this.addPowerToTotalByDate(
                                lineInResponse[station.format.properties.value],
                                toDate(lineInResponse[station.format.properties.end])
                            );
                        });
                    }
                    catch (e) {
                        // afficher une erreur de lecture des données : erreur de parse
                    }
                    break;
                case 'csv':
                    jsonResponse = [];
                    break;
                default:
                    // afficher une erreur de lecture des données : format 'station.format.type' non pris en charge
                    break;
            }
        }
        // else : afficher une erreur de lecture des données : format de données inconnu
    }

    private addPowerToTotalByDate(power: number, date: Date) {
        const dateFoundInResult = this.result.find(r => r.datetime === date);
        if (dateFoundInResult) {
            dateFoundInResult.totalPower += power;
        }
        else {
            // on récupère la puissance cumulées aux dates antérieures
            if (this.result.length > 0) {
                power += this.result[this.result.length - 1].totalPower;
            }
            this.result.push({
                datetime: date,
                totalPower: power
            })
        }
        // pour toutes les lignes antérieures à cette date
    }

    clear(): void {
        this.result = [];
    }
}

function toDate(unix_timestamp: number): Date {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    return new Date(unix_timestamp * 1000);
}

function formatDate(date: Date): string {
    return [
        twoCharsString(date.getDate()),
        twoCharsString(date.getMonth() + 1),
        date.getFullYear().toString(),
    ].join('-');
}

function twoCharsString(number: number) {
    return number >= 10 ? number.toString() : ('0' + number.toString());
}
