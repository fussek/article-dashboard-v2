import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  articles: any[] = [];
private apiUrl = 'http://localhost:5193/api/articles'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.articles = data;
    });
  }
}