import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects = [
    {
      title: 'Projeto 1',
      description: 'Descrição breve do Projeto 1.',
      imageUrl: 'assets/project1.jpg',
      link: 'http://link-para-projeto1.com'
    },
    {
      title: 'Projeto 2',
      description: 'Descrição breve do Projeto 2.',
      imageUrl: 'assets/project2.jpg',
      link: 'http://link-para-projeto2.com'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
