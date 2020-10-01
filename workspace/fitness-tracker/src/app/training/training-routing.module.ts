import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { TrainingComponent } from './training.component';

const routes: Routes = [
  // removing 'training' path as it is added in the app-routing.module.ts
  {path: '', component: TrainingComponent, canActivate: [ AuthGuard ]}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TrainingRoutingModule {

}
