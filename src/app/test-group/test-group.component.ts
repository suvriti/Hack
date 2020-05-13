import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataServiceService } from '../data-service.service';
import { NumberValueAccessor } from '@angular/forms';

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-test-group',
  templateUrl: './test-group.component.html',
  styleUrls: ['./test-group.component.scss']
})
export class TestGroupComponent implements OnInit {

  startDate:Date = new Date();
  endDate:Date = new Date();
  public dataSource = new MatTableDataSource<any | Group>([]);

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];
  shopName: string = this.dataSourceService.shop[0];
  totalcost: number;
  constructor(
    protected dataSourceService: DataServiceService,
  ) {

    this.columns = [{
      field: 'type',
      displayName: 'Type'
    }, {
      field: 'shop',
      displayName: 'Shop'
    }, {
      field: 'name',
      displayName: 'Name'
    }, {
      field: 'usedAmount',
      displayName: 'Amount'
    },
    {
      field: 'displayDate',
      displayName: 'Date'
    },
    {
      field: 'action',
      displayName: 'Action'
    }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['type'];
  }

  getTotalCost() {
   this.totalcost = (this._alldata.map(t => t.usedAmount).reduce((acc, value) => acc + value, 0));
  console.log(this.totalcost);
  }
  delete(row) {
   console.log(row);
   this.dataSourceService.deleteEntry(row).subscribe(data => {
    console.log(data);
    this.getData(false);
  });
   }
  addOpeningBalance(){
    console.log(this.totalcost);
    this.dataSourceService.addOpeningBalance(this.shopName,this.startDate.toLocaleDateString('en-GB'),this.totalcost).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  startdateChosen(){
    this.endDate = this.startDate;
  }
  ngOnInit() {
    this.getData(false);
  }
getData(all?: Boolean){
  if(all == undefined){
    all = true;
  }
  this.dataSourceService.getEntry(this.shopName,this.startDate.toLocaleDateString('en-GB'),this.endDate.toLocaleDateString('en-GB'), all)
  .subscribe(
    (data: any) => {
        // data.forEach((item, index) => {
        //   item.id = index + 1;
        // });
        this._alldata = data;
        this._alldata.forEach(function (value) {
          value.displayDate = new Date(value.date).toDateString()
        });
        this.getTotalCost();
        this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        console.log(this.dataSource.data);
      },
    (err: any) => console.log(err)
  );
}
  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add ) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if ( add ) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }
  

}
