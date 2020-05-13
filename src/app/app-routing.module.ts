import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { LedgerBookComponent } from './ledger-book/ledger-book.component';
import { HomeComponent } from './home/home.component';
import { TestGroupComponent } from './test-group/test-group.component';


const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'newEntry',component:AddEntryComponent},
  {path:'ledger',component:LedgerBookComponent},
  {path:'ledger-beta',component:TestGroupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
