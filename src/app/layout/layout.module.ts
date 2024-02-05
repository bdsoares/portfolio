import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundComponent } from './background/background.component';
import { NavComponent } from './nav/nav.component';

import { NgxParticlesModule } from "@tsparticles/angular";

@NgModule({
    declarations: [
        BackgroundComponent,
        NavComponent
    ],
    imports: [
        CommonModule,
        NgxParticlesModule
    ],
    exports: [
        BackgroundComponent,
        NavComponent
    ]
})
export class LayoutModule { }
