import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  displayedColumns: string[] = ['articleNumber', 'articleCategory', 'name', 'bicycleCategory', 'material', 'netWeightInGram', 'actions'];
  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  categoryIcons: { [key: string]: string } = {
    'Hub': 'assets/icons/hub.png',
    'Crank arm': 'assets/icons/crank.png',
    'Derailleur': 'assets/icons/derailleur.png',
    'Bottom Bracket': 'assets/icons/bottom-bracket.png',
    'Shifter': 'assets/icons/shifter.png',
    'Brake Lever': 'assets/icons/brake-lever.png',
    'Cassette': 'assets/icons/cassette.png',
    'Chain': 'assets/icons/chain.png',
    'Saddle': 'assets/icons/saddle.png',
    'Handlebar': 'assets/icons/handlebar.png',
    'Default': 'assets/icons/question.png'
  };

  bicycleCategoryBadges: { [key: string]: { abbr: string, color: string } } = {
    'Road': { abbr: 'R', color: '#E3F2FD' },
    'Gravel': { abbr: 'G', color: '#E8F5E9' },
    'e-Gravel': { abbr: 'eG', color: '#E8F5E9' },
    'MTB': { abbr: 'M', color: '#F1F8E9' },
    'e-MTB': { abbr: 'eM', color: '#F1F8E9' },
    'City': { abbr: 'C', color: '#FFF3E0' },
    'e-City': { abbr: 'eC', color: '#FFF3E0' },
    'Trekking': { abbr: 'T', color: '#EDE7F6' },
    'e-Trekking': { abbr: 'eT', color: '#EDE7F6' },
    'Foldable': { abbr: 'F', color: '#FCE4EC' },
    'Cargo': { abbr: 'Cg', color: '#F3E5F5' },
    'e-Cargo bike': { abbr: 'eCg', color: '#e0e0e0' }
  };

  articleCategories = ['Hub', 'Crank arm', 'Bottom Bracket', 'Derailleur', 'Shifter', 'Brake Lever', 'Cassette', 'Chain', 'Saddle', 'Handlebar'];
  bicycleCategories = ['Road', 'Gravel', 'e-Gravel', 'MTB', 'e-MTB', 'City', 'e-City', 'Trekking', 'e-Trekking', 'Foldable', 'Cargo', 'e-Cargo bike'];
  materials = ['Aluminium', 'Steel', 'Alloy', 'Carbon', 'Titanium', 'Nickel', 'Plastic', 'Rubber', 'Leather'];

  private currentSort: Sort = { active: '', direction: '' };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      articleCategory: [''],
      bicycleCategories: [[]],
      material: [''],
    });
  }
  
  openArticleDialog(articleId?: string): void {
    const dialogRef = this.dialog.open(ArticleFormComponent, {
      width: '600px',
      data: { id: articleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadArticles();
      }
    });
  }

  get articleCategoryControl(): FormControl {
    return this.filterForm.get('articleCategory') as FormControl;
  }
  get bicycleCategoriesControl(): FormControl {
    return this.filterForm.get('bicycleCategories') as FormControl;
  }
  get materialControl(): FormControl {
    return this.filterForm.get('material') as FormControl;
  }

  ngOnInit(): void {
    this.loadArticles();
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      takeUntil(this.destroy$),
      switchMap(formValue => this.getArticlesObservable(formValue))
    ).subscribe(data => {
      this.articles = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getArticlesObservable(formValue: any) {
    const filters = { ...formValue, sortBy: this.currentSort.active, isDescending: this.currentSort.direction === 'desc' };
    return this.articleService.getArticles(filters);
  }

  loadArticles(): void {
    this.getArticlesObservable(this.filterForm.value).subscribe(data => {
      this.articles = data;
    });
  }

  onSortChange(sort: Sort): void {
    this.currentSort = sort;
    this.loadArticles();
  }
  
  resetBicycleCategoryFilter(): void {
    this.bicycleCategoriesControl.setValue([]);
  }

  deleteArticle(id: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the article "${name}"?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteArticle(id).subscribe(() => {
          this.loadArticles();
        });
      }
    });
  }

  getIcon(category: string): string {
    return this.categoryIcons[category] || this.categoryIcons['Default'];
  }

  getBicycleCategoryBadges(categories: string): { abbr: string, color: string, fullName: string }[] {
    if (!categories) return [];
    return categories.split(',').map(cat => {
      const trimmedCat = cat.trim();
      const badgeData = this.bicycleCategoryBadges[trimmedCat];
      return badgeData 
        ? { ...badgeData, fullName: trimmedCat } 
        : { abbr: trimmedCat, color: '#E0E0E0', fullName: trimmedCat };
    });
  }

  exportAs(type: 'csv' | 'json'): void {
    const dataToExport = this.articles;
    if (!dataToExport || dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }
    const fileName = `articles-export-${new Date().getTime()}`;

    if (type === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      saveAs(blob, `${fileName}.json`);
    }

    if (type === 'csv') {
      const header = Object.keys(dataToExport[0]).join(',');
      const csv = dataToExport.map(row => Object.values(row).join(',')).join('\r\n');
      const blob = new Blob(['\ufeff' + header + '\r\n' + csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${fileName}.csv`);
    }
  }
}
