import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  isEditMode = false;
  currentIconPath: string | null = null;
  private articleId: string | null = null;

  private categoryIconMap: { [key: string]: string } = {
    'Hub': 'assets/icons/hub.png',
    'Crank arm': 'assets/icons/crank.png',
    'Derailleur': 'assets/icons/derailleur.png',
    'Bottom Bracket': 'assets/icons/bottom-bracket.png',
    'Shifter': 'assets/icons/shifter.png',
    'Brake Lever': 'assets/icons/brake-lever.png',
    'Cassette': 'assets/icons/cassette.png',
    'Chain': 'assets/icons/chain.png',
    'Saddle': 'assets/icons/saddle.png',
    'Handlebar': 'assets/icons/handlebar.png'
  };

  articleCategories = ['Hub', 'Crank arm', 'Bottom Bracket', 'Derailleur', 'Shifter', 'Brake Lever', 'Cassette', 'Chain', 'Saddle', 'Handlebar'];
  bicycleCategories = ['Road', 'Gravel', 'e-Gravel', 'MTB', 'e-MTB', 'City', 'e-City', 'Trekking', 'e-Trekking', 'Foldable', 'Cargo', 'e-Cargo bike'];
  materials = ['Aluminium', 'Steel', 'Alloy', 'Carbon', 'Titanium', 'Nickel', 'Plastic', 'Rubber', 'Leather'];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    public dialogRef: MatDialogRef<ArticleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string | null }
  ) {
    this.articleForm = this.fb.group({
      articleNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required, Validators.maxLength(30)]], 
      articleCategory: ['', Validators.required],
      bicycleCategory: [[], Validators.required],
      material: ['', Validators.required],
      netWeightInGram: [0, Validators.min(1)],
      lengthInMm: [0],
      widthInMm: [0],
      heightInMm: [0],
    });
  }

  ngOnInit(): void {
    this.articleId = this.data.id;
    if (this.articleId) {
      // EDIT MODE
      this.isEditMode = true;
      this.articleService.getArticleById(this.articleId).subscribe(data => {
        const formData = {
          ...data,
          bicycleCategory: data.bicycleCategory ? data.bicycleCategory.split(',') : []
        };
        this.articleForm.patchValue(formData);
        this.updateDialogIcon(data.articleCategory);
        this.articleForm.get('articleNumber')?.disable();
      });
    } else {
      // ADD MODE
      const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
      this.articleForm.get('articleNumber')?.setValue(randomNumber);
      this.articleForm.get('articleNumber')?.disable();
      const defaultCategory = this.articleCategories[0];
      this.articleForm.get('articleCategory')?.setValue(defaultCategory);
      this.updateDialogIcon(defaultCategory);
    }

    this.articleForm.get('articleCategory')?.valueChanges.subscribe(value => {
      this.updateDialogIcon(value);
    });
  }

  private updateDialogIcon(category: string | null): void {
    this.currentIconPath = this.categoryIconMap[category!] || null;
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      return;
    }
    
    this.articleForm.get('articleNumber')?.enable();

    const submissionData = {
      ...this.articleForm.value,
      bicycleCategory: this.articleForm.value.bicycleCategory.join(',')
    };
    
    this.articleForm.get('articleNumber')?.disable();

    const saveOperation = this.isEditMode && this.articleId
      ? this.articleService.updateArticle(this.articleId, submissionData)
      : this.articleService.createArticle(submissionData);

    saveOperation.subscribe(() => {
      this.dialogRef.close('saved');
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
