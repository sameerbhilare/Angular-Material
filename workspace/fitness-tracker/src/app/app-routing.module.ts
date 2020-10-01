import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},

  /**
   Initially The training pages are not needed because if the user is not logged in.
   We don't need to load this in advance so therefore we can take this route and
   also put it into a training route module.
   So now we're telling angular if we're targeting slash trading you should actually load the trading module
   related code and analyze whatever is in there and in there we got the training routing module with for
   child so we will still reached this route. */
  // lazy loaded routes
  {path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule) }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule {}
