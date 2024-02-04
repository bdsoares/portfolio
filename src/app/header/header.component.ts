import { Component, OnInit } from '@angular/core';

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

  constructor(private contactService: ContactService, private particleService: ParticlesService) { }

  ngOnInit(): void {
    this.particleService.getParticles().subscribe(data => {
      this.particlesData = data;
    })

    this.contactService.getContacts().subscribe(data => {
      this.contactData = data;
    })
  }

  async particlesInit(engine: any): Promise<void> {
    const { loadSlim } = await import("@tsparticles/slim");
    await loadSlim(engine);
  }
}
