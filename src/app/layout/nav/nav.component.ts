import { Component, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    items?: any[];
    menuActive: boolean = false;

    constructor() { }

    ngOnInit() {
        this.items = [
            { label: 'Início', command: () => this.scrollTo('header-container') },
            { label: 'Sobre Mim', command: () => this.scrollTo('about-me-container') },
            { label: 'Meus Projetos', command: () => this.scrollTo('projects-container') },
            { label: 'Minha Timeline', command: () => this.scrollTo('timeline-container') }
        ];
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.changeMenuColor();
    }

    scrollTo(section: string) {
        const element = document.querySelector('.navigation') as HTMLElement;
        const navigationHeight = element.offsetHeight || 0;
        const targetElement = document.querySelector(`.${section}`);
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - (navigationHeight*2);
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }

    toggleMenu() {
        this.menuActive = !this.menuActive;
        this.changeMenuColor();
    }

    changeMenuColor() {
        const element = document.querySelector('.navigation') as HTMLElement;
        if (window.scrollY > (window.innerHeight - element.offsetHeight) || this.menuActive) {
            element.style.backgroundColor = '#333';
        } else {
            element.style.backgroundColor = 'transparent';
        }
    }
}
