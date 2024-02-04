import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(private http: HttpClient) { }

    getContacts(): Observable<any> {
        const baseUrl = window.location.origin;
        return this.http.get(`${baseUrl}/assets/config/data/contact.json`);
    }
}
