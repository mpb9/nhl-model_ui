import { EventEmitter } from "@angular/core";
import { Column, Query, Table, Website } from "./query.model";
import axios from "axios";

const MY_QUERIES = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_queries.php';
export class QueryService{
  private tables: Table[] = [
    { 
      name: 'full_reg_season_stats',
      columns: [
        { name: 'year', type: 'VARCHAR(9)'}, { name: 'team', type: 'VARCHAR'},
        { name: 'gp', type: 'INT(2)'}, { name: 'record', type: 'VARCHAR(8)'},
        { name: 'pts', type: 'INT(3)'}, { name: 'w', type: 'INT(2)'},
        { name: 'l', type: 'INT(2)'}, { name: 't', type: 'INT(2)'},
        { name: 'otl', type: 'INT(2)'}, { name: 'pts_pct', type: 'FLOAT'},
        { name: 'g', type: 'INT(3)'}, { name: 'ga', type: 'INT(3)'},
        { name: 'pp_pct', type: 'FLOAT'}, { name: 'pk_pct', type: 'FLOAT'},
        { name: 's_per_gp', type: 'FLOAT'}, { name: 'sa_per_gp', type: 'FLOAT'}
      ]
    }
  ];

  private websites: Website[] = [
    {
      baseUrl: 'https://www.statmuse.com/nhl/something',
      extensions: [
        '/ask?q=nhl+team+records+in+the+2021%2F2022+season',
        '/ask?q=nhl+team+records+in+the+2020%2F2021+season'
      ]
    }
  ];

  public query: Query = {
    table: new Table('', []),
    website: new Website('', []) 
  };

  // NEED TO HAVE A CURRENT WEBSITE / TABLE SO ALTERING WON'T CHANGE THEM UNTIL SUBMITTED

  // QUERY METHODS
  queryChanged = new EventEmitter<Query>();
  loadQueries(){
    axios({
      method: "post",
      url: `${MY_QUERIES}`,
      headers: { "content-type": "application/json" }
    }).then((result) => {
      const all_saved_queries = result.data;
      
      all_saved_queries.forEach((saved_query: { table: { table_name: string; columns: Column[]; }; website: { base_url: string; extensions: string[]; }; }) => {
        
        const saved_table = new Table(
          saved_query.table.table_name,
          saved_query.table.columns
        );
        this.addTable(saved_table);

        this.addWebsite(new Website(
          saved_query.website.base_url,
          saved_query.website.extensions
        ));

      });

      
    }).catch((error) => {
      console.log(error);
    });
    return this.getQuery();
  }
  updateQuery(){
    this.printQuery();
    this.queryChanged.emit(this.query);
  }
  updateQueryWebsite(website: Website){
    this.query.website = website;
    this.updateQuery();
  }
  updateQueryTable(table: Table){
    this.query.table = table;
    this.updateQuery();
  }
  getQuery(){
    return this.query;
  }
  getNewQuery(){
    this.query = {
      table: new Table('', []),
      website: new Website('', []) 
    };
    return this.query;
  }
  printQuery(){
    console.log("QUERY UPDATED:");
    console.log("WEBSITE: " + this.query.website.baseUrl);
    console.log("  extensions: [");
    this.query.website.extensions.forEach(ext => console.log("   " + ext));
    console.log("  ]");
    console.log("TABLE: " + this.query.table.name);
    console.log("  columns: [");
    this.query.table.columns.forEach(col => console.log("   [name: " + col.name + ", type: " + col.type + "]"));
    console.log("  ]");
    console.log("");
  }

  // TABLE METHODS
  tablesChanged = new EventEmitter<Table[]>();

  loadTables(){
    
  }
  updateTables(){
    this.tablesChanged.emit(this.tables.slice());
  }
  getTables(){
    return this.tables.slice();
  }
  addTable(table: Table){
    //ADD TIMESTAMP
    this.tables.push(table);
    this.updateTables();
  }

  // WEBSITE METHODS
  websitesChanged = new EventEmitter<Website[]>();
  updateWebsites(){
    this.websitesChanged.emit(this.websites.slice());
  }
  getWebsites(){
    return this.websites.slice();
  }
  addWebsite(website: Website){
    //ADD TIMESTAMP
    this.websites.push(website);
    this.updateWebsites();
  }


}