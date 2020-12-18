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
    // stylesheet: "EasyTable/EasyTable.css",
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


const step21 = new EasyTable("step21", "step21Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    // stylesheet: "EasyTable/EasyTable.css",
    stylesheet: null,
    cssText: null
})
step21.appendRow(["Camry", "Toyota", "2000"])
step21.appendRow(["Civic", "Honda", "2005"])
step21.appendRow(["Accord", "Honda", "2001"])
step21.appendRow(["Gustang", "Ford", "1995"])
step21.appendRow(["Yaris", "Toyota", "1996"])
step21.appendRow(["Model-T", "Ford", "1102"])
step21.insertRow(1, ["Enzo", "Ferrari", "1996"])
step21.insertRow(1, ["458", "Ferrari", "1996"])

step21.appendCol("Purchases", 0, null)


const step22 = new EasyTable("step22", "step22Table", {
    columns: ['Model', 'Brand', 'Year'],
    colNumbering: true,
    enableSearch: true,
    enableSort: true,
    defaultStyle: 2,
    // stylesheet: "EasyTable/EasyTable.css",
    stylesheet: null,
    cssText: null
})
step22.appendRow(["Camry", "Toyota", "2000"])
step22.appendRow(["Civic", "Honda", "2005"])
step22.appendRow(["Accord", "Honda", "2001"])
step22.appendRow(["Gustang", "Ford", "1995"])
step22.appendRow(["Yaris", "Toyota", "1996"])
step22.appendRow(["Model-T", "Ford", "1102"])
step22.insertRow(1, ["Enzo", "Ferrari", "1996"])
step22.insertRow(1, ["458", "Ferrari", "1996"])



// step22.insertCol(3, "Ratings", null, [
//     "4/10",
//     "9/10",
//     "10/10",
//     "3/10",
//     "4/10",
//     "7/10",
//     "2/10",
//     "1/10"
// ])

step22.appendCol("Purchases", null, [
    "4/10",
    "9/10",
    "10/10",
    "3/10",
    "4/10",
    "7/10",
    "2/10",
    "1/10"
])

step22.appendCol("Ratings", "Purchasessssssssssssssssssssss", null)


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
    // stylesheet: "EasyTable/EasyTable.css",
    cssText: null,
    sort: true,
    paginate: 4
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
step5.appendRow(["Model-A", "Ford", "1996"])
step5.appendRow(["Model-B", "Ford", "1996"])
step5.appendRow(["Model-C", "Ford", "1996"])
step5.appendRow(["Model-D", "Ford", "1996"])

step5.insertCol(3, "Rating", null, [
    "0.1",
    "0.2",
    "0.4",
    "0.3",
    "0.7",
    "0.5",
    "0.5",
    "0.2"
])

//TODO: 

// FIXES

// 1. Fix styling for headers and shit.
// 2. Factor out code to create col headers (insertCol appends a text node, while setColumns creates a text node within a DIV)
// 3. Encapsulate the results of search so that paginate and sort work JUST for the results, and not entire table (maybe create a new tbody, populate with search results, and replace the current table.body with the new tbody elem.)

// 4. Grant users access to _search, _sort, and _next/_prevPage functions (Give them an option to use the default elements, or use their own custom elements, with the provided functions set as callbacks)

// 5. Package code like mark showed in circle generator example.

// Features

// 1. Load from CSV/JSON
// 2. Save to CSV/JSON
// 3. 