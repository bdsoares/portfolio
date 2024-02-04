import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimelineService {
    constructor(private http: HttpClient) { }

    getTimeline(): Observable<any> {
        const baseUrl = window.location.origin;
        return this.http.get(`${baseUrl}/assets/config/data/timeline.json`);
    }
}
