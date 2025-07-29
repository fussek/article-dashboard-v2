import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// This interface defines the data that will be passed to the dialog
export interface ConfirmationDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  // Inject the dialog reference and the data passed to it
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    // When the user clicks "Confirm", close the dialog and return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // When the user clicks "Cancel", close the dialog and return false
    this.dialogRef.close(false);
  }
}
