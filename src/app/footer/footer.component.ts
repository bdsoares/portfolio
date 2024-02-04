import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contactData: any;
  currentYear: number = new Date().getFullYear();

  constructor(private concactService: ContactService) { }

  ngOnInit() {
    this.concactService.getContacts().subscribe(data => {
      this.contactData = data;
    })
  }

  removeMailtoPrefix(text: string): string {
    if (text.startsWith('mailto:')) {
      return text.substring(7);
    }
    return text;
  }
}
