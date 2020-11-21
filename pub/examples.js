'use strict'
const log = console.log

const myTable = new EasyTable("table1", "main", ['Model', 'Brand', 'Year'], true)

myTable.appendRow(["Camry", "Toyota", "2000"])
myTable.appendRow(["Civic", "Honda", "2005"])
myTable.appendRow(["Accord", "Honda", "2001"])
myTable.appendRow(["Mustang", "Ford", "1995"])
myTable.appendRow(["Yaris", "Toyota", "1996"])
myTable.appendRow(["Model-T", "Ford", "1102"])
myTable.appendRow(["485", "Ferrari", "1996"])

//fr = new FileReader()