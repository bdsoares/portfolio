import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
  }
}
