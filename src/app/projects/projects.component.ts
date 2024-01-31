import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects?: any[];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  selectProject(project: any) {
    console.log('Projeto selecionado:', project);

    // Para navegar para outra rota:
    // this.router.navigate(['/project-details', project.id]);

    // Ou para abrir um modal/diálogo:
    // this.dialogService.open(ProjectDetailsComponent, { data: project });
  }
}
