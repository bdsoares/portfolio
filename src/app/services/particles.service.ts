import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ParticlesService {
    constructor(private http: HttpClient) { }

    getParticles(): Observable<any> {
        const baseUrl = window.location.origin;
        return this.http.get(`${baseUrl}/assets/config/particles/main-particles.json`);
    }
}
