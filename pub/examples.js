'use strict'
const log = console.log

const myTable = new EasyTable("table1", "main", ['col1', 'col2', 'col3'], true)

myTable.appendRow([1, 2, 3])
myTable.appendRow([4, 5, 6])
myTable.appendRow([7, 8, 9])

log(myTable.getCell(0, 0))
log(myTable.setCell(1, 1, "Sup"))