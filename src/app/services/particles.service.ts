import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ParticlesService {
    private baseUrl = environment.baseHref;
    
    constructor(private http: HttpClient) { }

    getParticles(): Observable<any> {
        return this.http.get(`${this.baseUrl}assets/config/particles/main-particles.json`);
    }
}
