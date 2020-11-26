'use strict'
const log = console.log

const myTable = new EasyTable("myTable", "main", ['Model', 'Brand', 'Year'], true, 3)

myTable.appendRow(["Camry", "Toyota", "2000"])
myTable.appendRow(["Civic", "Honda", "2005"])
myTable.appendRow(["Accord", "Honda", "2001"])
myTable.appendRow(["Mustang", "Ford", "1995"])
myTable.appendRow(["Yaris", "Toyota", "1996"])
myTable.appendRow(["Model-T", "Ford", "1102"])
myTable.appendRow(["Enzo", "Ferrari", "1996"])
myTable.appendRow(["458", "Ferrari", "1996"])
myTable.appendRow(["458", "CarComp", "2020"])

// const enzo = myTable.popRow()
// const model = myTable.popRow()
// const civic = myTable.deleteRow(1)

const changeAccordYear = myTable.setRow(1, ["Civic", "Honda", "1970"])
console.log(changeAccordYear)

// const mustangCell = myTable.getCell(2, 0)
// console.log(mustangCell)
// mustangCell.style.cssText = "background-color: red; text-align: center"

// https://salty-cove-11433.herokuapp.com/