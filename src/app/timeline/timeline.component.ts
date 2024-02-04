import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../services/timeline.service';


interface EventItem {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit {
  events: EventItem[] = [];

  constructor(private timelineService: TimelineService) { }

  ngOnInit(): void {
    this.timelineService.getTimeline().subscribe(data => {
      this.events = data;
    });
  }
}