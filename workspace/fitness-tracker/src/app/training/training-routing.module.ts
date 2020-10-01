import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { TrainingComponent } from './training.component';

const routes: Routes = [
  // removing 'training' path as it is added in the app-routing.module.ts
  /**
   * Also removing 'canActivate' because the disadvantage if we use can actually wait here.
   * We check whether we are allowed to enter this component is training component
   * AFTER we lazy loaded the whole module.
   * Now we can simply save that and don't download the module if we don't have access anyways
   * so this is why checking it here is too late to have an optimal app at least.
   * Fix - remove canActivate from here and add 'canLoad into app-routing.module.ts'
   */
  {path: '', component: TrainingComponent}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TrainingRoutingModule {

}
