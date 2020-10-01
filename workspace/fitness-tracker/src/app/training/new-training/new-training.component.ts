import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  isLoading: boolean = true;
  loadingSub: Subscription;
  exercisesChangedSub: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UIService) { }

  ngOnInit(): void {

    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    // listen to the fetched exercises events
    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });

    // fetch exercises
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.selectedExercise);
  }

  ngOnDestroy() {
    // if for some reason this component is destroyed before the subscription is initialized
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }

    // if for some reason this component is destroyed before the subscription is initialized
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
  }

}
