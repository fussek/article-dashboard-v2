import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/api/articles`;

  constructor(private http: HttpClient) { }

  getArticles(filters: any): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        if (Array.isArray(filters[key])) {
          filters[key].forEach((value: string) => {
            params = params.append(key, value);
          });
        } else {
          params = params.append(key, filters[key]);
        }
      }
    });
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getArticleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: any): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }

  updateArticle(id: string, article: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, article);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkArticleNumberUnique(number: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-number-unique/${number}`);
  }
}
