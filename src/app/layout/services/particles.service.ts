import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ParticlesService {
    constructor(private http: HttpClient) { }

    getParticles(): Observable<any> {
        return this.http.get('/assets/config/particles/main-particles.json');
    }
}
