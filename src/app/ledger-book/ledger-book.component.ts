import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { khataEntryDTO } from '../khataEntryDTO';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ledger-book',
  templateUrl: './ledger-book.component.html',
  styleUrls: ['./ledger-book.component.scss']
})
export class LedgerBookComponent implements OnInit {

  dataSource = new MatTableDataSource<khataEntryDTO>();
  displayedColumns: string[] = ['type', 'shop', 'name', 'usedAmount'];
  data = [];
  
  constructor(private dataService: DataServiceService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.getEntry("PGS",null,null,null).subscribe((data) => { 
      console.log(data) 
      this.data = data;
    })
  }

  getTotalCost() {
    return this.data.map(t => t.usedAmount).reduce((acc, value) => acc + value, 0);
  }

  getSelectedRows() {
    // const selectedNodes = this.agGrid.api.getSelectedNodes();
    // const selectedData = selectedNodes.map( node => node.data );
    // console.log(selectedData);
    // this.dataService.editEntry = selectedData[0];
   // this.router.navigate(['/newEntry'], { queryParams: { id: selectedData[0].id }});
}
}
