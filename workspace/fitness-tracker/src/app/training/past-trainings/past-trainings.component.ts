import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from "@ngrx/store";
import { Exercise } from '../exercise.model';
import * as fromTraining from '../training.reducer';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {

  // columns to be displayed in given order
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];

  /** Type of data source we expect to render.
   *  Note - we will receive an array of Exercise,
   *  but for MatTableDataSource, we have to pass only the type of data (in this case just <Exercise>)
   *  It will automatically figure out that it will receive array of Exercise elements
   **/
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.store
      .select(fromTraining.getFinishedExercise)
      .subscribe((exercises) => (this.dataSource.data = exercises));

    // fetch finished exercises
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    // we have to add sort and pagination only after view is rendered, so ngAfterViewInit() is a good fit.
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
