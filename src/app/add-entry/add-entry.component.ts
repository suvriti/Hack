import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { khataEntryDTO } from '../khataEntryDTO';
import { DataServiceService } from '../data-service.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {

  isLinear = true;

  khataEntry: khataEntryDTO = new khataEntryDTO();
  nameControl = new FormControl();
  nameOptions: string[] = ['Sale-Cash', 'Swap-Yes', 'Swap-OBC', 'Paytm', 'ved', 'sonu', 'purchase'];
  nameFilteredOptions: Observable<string[]>;
  constructor(private formBuilder: FormBuilder, public dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params['id']);
    });
    this.nameFilteredOptions = this.nameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.nameOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  public onStepChange(event: any): void {
  //  console.log(event);
    if (event.selectedIndex == 1) {
      this.khataEntry.name = this.nameControl.value;
      console.log(this.khataEntry);
    }
  }
  public submit(): void {
    
    console.log(this.khataEntry);
    this.dataService.addEntry(this.khataEntry).subscribe(data => {
      console.log(data);
    });;
  }
}
