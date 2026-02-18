import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioCopy, PortfolioDynamicContent } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioContentService {
  private readonly http = inject(HttpClient);
  private readonly portfolioDataUrl = 'assets/data/portfolio-data.json';
  private readonly portfolioI18nUrl = 'assets/data/portfolio-i18n.json';

  getPortfolioData(): Observable<PortfolioDynamicContent> {
    return this.http.get<PortfolioDynamicContent>(this.portfolioDataUrl);
  }

  getPortfolioI18n(): Observable<PortfolioCopy> {
    return this.http.get<PortfolioCopy>(this.portfolioI18nUrl);
  }
}
