import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { khataEntryDTO } from './khataEntryDTO';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  type = ['Incoming','Outgoing'];
  shop = ['PGS']

  getEntryURL = "/khata/getEntry";
  addEntryURL = "/khata/addEntry";
  deleteEntryURL = "/khata/deleteEntry";
  createOpenBalURL ='/khata/createOpenBal';

  editEntry:khataEntryDTO;
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
  public addEntry(khataEntry:khataEntryDTO): Observable<{}> {
    console.log("In add Entry");
    console.log(khataEntry);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.post<khataEntryDTO>(this.addEntryURL, khataEntry, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  public deleteEntry(khataEntry:khataEntryDTO): Observable<{}> {
    console.log("In delete Entry");
    console.log(khataEntry);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.post<khataEntryDTO>(this.deleteEntryURL, khataEntry, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  getEntry(name,startDate,endDate, all) {
    console.log("In get Entry");
    let params = new HttpParams().set("name",name).set("startDate", startDate).set("endDate", endDate).set("all", all);
    return this.http.get<khataEntryDTO[]>(this.getEntryURL,{params:params})
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }
  addOpeningBalance(name,startDate,balance) {
    console.log("In app opening balance");
    let params = new HttpParams().set("name",name).set("startDate", startDate).set("balance", balance);
    return this.http.get<khataEntryDTO[]>(this.createOpenBalURL,{params:params})
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }
}
