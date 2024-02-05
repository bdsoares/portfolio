import { Component, OnInit } from '@angular/core';

import { ParticlesService } from '../services/particles.service';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
    headerParticlesId = 'header-particles';

    particlesData: any;

    constructor(private particleService: ParticlesService) { }

    ngOnInit(): void {
        this.particleService.getParticles().subscribe(data => {
            this.particlesData = data;
        })
    }

    async particlesInit(engine: any): Promise<void> {
        const { loadSlim } = await import("@tsparticles/slim");
        await loadSlim(engine);
    }
}
