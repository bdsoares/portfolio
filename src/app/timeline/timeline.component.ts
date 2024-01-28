import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {

  timelineItems = [
    {
      date: '2023',
      title: 'Engenheiro de Software na Empresa X',
      description: 'Descrição do trabalho realizado na Empresa X.'
    },
    {
      date: '2022',
      title: 'Mestrado em Ciência da Computação',
      description: 'Descrição do mestrado e principais aprendizados.'
    }
  ];

  particlesUrl: any;

  constructor() { }
}
