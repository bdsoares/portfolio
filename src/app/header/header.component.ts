import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headerParticlesId = 'header-particles';
  
  particlesUrl: any;

  isBrowser = false;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadJsonFile();
    }
  }

  async loadJsonFile() {
    this.http.get('/assets/config/particles/main-particles.json').subscribe(
      data => {
        this.particlesUrl = data;
      },
      error => {
        console.error("Erro ao carregar o arquivo JSON:", error);
      }
    );
  }

  async particlesInit(engine: any): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const { loadSlim } = await import("@tsparticles/slim");
      await loadSlim(engine);
    }
  }
}
