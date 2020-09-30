import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog,
              private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const step = this.trainingService.getRunnigExercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;

      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);

    // If you want to share data with your dialog,
    // you can use the data option to pass information to the dialog component.
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else { // false (clicking on No button) or undefined (clicking outside dialog box) case.
        // resume timer
        this.startOrResumeTimer();
      }
    });
  }

}
