import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimelineService {
    constructor(private http: HttpClient) { }

    getTimeline(): Observable<any> {
        return this.http.get('/assets/config/data/timeline.json');
    }
}
