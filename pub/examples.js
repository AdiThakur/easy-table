'use strict'
const log = console.log

const step1 = new EasyTable("step1", "step1Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    stylesheet: null,
    cssText: null
})

const step2 = new EasyTable("step2", "step2Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    stylesheet: null,
    cssText: null
})
step2.appendRow(["Camry", "Toyota", "2000"])
step2.appendRow(["Civic", "Honda", "2005"])
step2.appendRow(["Accord", "Honda", "2001"])
step2.appendRow(["Gustang", "Ford", "1995"])
step2.appendRow(["Yaris", "Toyota", "1996"])
step2.appendRow(["Model-T", "Ford", "1102"])
step2.insertRow(1, ["Enzo", "Ferrari", "1996"])
step2.insertRow(1, ["458", "Ferrari", "1996"])

const step3 = new EasyTable("step3", "step3Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    stylesheet: null,
    cssText: null
})
step3.appendRow(["Camry", "Toyota", "2000"])
step3.appendRow(["Civic", "Honda", "2005"])
step3.appendRow(["Accord", "Honda", "2001"])
step3.appendRow(["Gustang", "Ford", "1995"])
step3.appendRow(["Yaris", "Toyota", "1996"])
step3.appendRow(["Model-T", "Ford", "1102"])
step3.insertRow(1, ["Enzo", "Ferrari", "1996"])
step3.insertRow(1, ["458", "Ferrari", "1996"])

step3.setCell(5, 0, "Mustang")

const step4 = new EasyTable("step4", "step4Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    stylesheet: null,
    cssText: null
})
step4.appendRow(["Camry", "Toyota", "2000"])
step4.appendRow(["Civic", "Honda", "2005"])
step4.appendRow(["Accord", "Honda", "2001"])
step4.appendRow(["Gustang", "Ford", "1995"])
step4.appendRow(["Yaris", "Toyota", "1996"])
step4.appendRow(["Model-T", "Ford", "1102"])
step4.insertRow(1, ["Enzo", "Ferrari", "1996"])
step4.insertRow(1, ["458", "Ferrari", "1996"])
step4.setCell(5, 0, "Mustang")

step4.popRow()

const step5 = new EasyTable("step5", "step5Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    stylesheet: null,
    cssText: null
})
step5.appendRow(["Camry", "Toyota", "2000"])
step5.appendRow(["Civic", "Honda", "2005"])
step5.appendRow(["Accord", "Honda", "2001"])
step5.appendRow(["Gustang", "Ford", "1995"])
step5.appendRow(["Yaris", "Toyota", "1996"])
step5.appendRow(["Model-T", "Ford", "1102"])
step5.insertRow(1, ["Enzo", "Ferrari", "1996"])
step5.insertRow(1, ["458", "Ferrari", "1996"])
step5.setCell(5, 0, "Mustang")
