import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }
  apiUrl: string;

  apiHeaders: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    })
  }

  async getApiUrlJson() {
    const result = await this.http.get("./assets/config/settings.json").toPromise();
    this.apiUrl = result['apiUrl'];
  }

  getDashboardDetails() {
    return this.http.get(this.apiUrl + "analyze", this.apiHeaders);
  }
}
