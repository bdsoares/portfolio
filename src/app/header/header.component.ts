import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ContactService } from '../services/contact.service';
import { ParticlesService } from '../services/particles.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headerParticlesId = 'header-particles';

  particlesData: any;
  contactData: any;

  isBrowser = false;

  constructor(private contactService: ContactService, private particleService: ParticlesService, @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.particleService.getParticles().subscribe(data => {
        this.particlesData = data;
      })

      this.contactService.getContacts().subscribe(data => {
        this.contactData = data;
      })
    }
  }

  async particlesInit(engine: any): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const { loadSlim } = await import("@tsparticles/slim");
      await loadSlim(engine);
    }
  }
}
