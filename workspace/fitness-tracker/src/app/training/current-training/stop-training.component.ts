import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure?</h1>
             <mat-dialog-content>
               <p>You already got {{ passedData.progress }}%</p>
             </mat-dialog-content>
             <mat-dialog-actions>
               <button mat-flat-button [mat-dialog-close]="true">Yes</button>
               <button mat-flat-button [mat-dialog-close]="false">No</button>
             </mat-dialog-actions> `
})
export class StopTrainingComponent {

  // To access the data in your dialog component, you have to use the MAT_DIALOG_DATA injection token:
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
