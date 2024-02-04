import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    constructor(private http: HttpClient) { }

    getProjects(): Observable<any> {
        const baseUrl = window.location.origin;
        return this.http.get(`${baseUrl}/assets/config/data/projects.json`);
    }
}