import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],  // eagerly loaded routes - because we need auth pages at the start
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule {}
