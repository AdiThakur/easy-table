'use strict'
const log = console.log

const step1 = new EasyTable("step1", "step1Table", ['Model', 'Brand', 'Year'], true, 3)

const step2 = new EasyTable("step2", "step2Table", ['Model', 'Brand', 'Year'], true, 3)
step2.appendRow(["Camry", "Toyota", "2000"])
step2.appendRow(["Civic", "Honda", "2005"])
step2.appendRow(["Accord", "Honda", "2001"])
step2.appendRow(["Gustang", "Ford", "1995"])
step2.appendRow(["Yaris", "Toyota", "1996"])
step2.appendRow(["Model-T", "Ford", "1102"])
step2.insertRow(1, ["Enzo", "Ferrari", "1996"])
step2.insertRow(1, ["458", "Ferrari", "1996"])

const step3 = new EasyTable("step3", "step3Table", ['Model', 'Brand', 'Year'], true, 3)
step3.appendRow(["Camry", "Toyota", "2000"])
step3.appendRow(["Civic", "Honda", "2005"])
step3.appendRow(["Accord", "Honda", "2001"])
step3.appendRow(["Gustang", "Ford", "1995"])
step3.appendRow(["Yaris", "Toyota", "1996"])
step3.appendRow(["Model-T", "Ford", "1102"])
step3.insertRow(1, ["Enzo", "Ferrari", "1996"])
step3.insertRow(1, ["458", "Ferrari", "1996"])

step3.setCell(5, 0, "Mustang")
// https://salty-cove-11433.herokuapp.com/examples.html