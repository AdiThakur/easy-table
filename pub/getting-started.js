'use strict'
const log = console.log

// Creating a new table.
const step1 = new EasyTable("step1", "step1Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})

// Entering data.
const step2 = new EasyTable("step2", "step2Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
step2.appendRow(["Camry", "Toyota", "2000"])
step2.appendRow(["Civic", "Honda", "2005"])
step2.appendRow(["Accord", "Honda", "2001"])
step2.appendRow(["Gustang", "Ford", "1995"])
step2.appendRow(["Yaris", "Toyota", "1996"])
step2.appendRow(["Model-T", "Ford", "1102"])
step2.appendRow(["Enzo", "Ferrari", "1996"])
step2.appendRow(["458", "Ferrari", "1996"])

const submit = document.querySelector("#add_rows_submit")
const enterData = (event) => {
    event.preventDefault()
    const model = document.querySelector("#model").value
    const brand = document.querySelector("#brand").value
    const year = document.querySelector("#year").value
    if (!model || !brand || !year) {
        alert("Please populate all fields!")
        return
    }
    step2.appendRow([model, brand, year])
    console.log([model, brand, year])
    document.querySelector("#add_rows").reset()
}
submit.onclick = enterData

// Setting cell.
const step3 = new EasyTable("step3", "step3Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
step3.appendRow(["Camry", "Toyota", "2000"])
step3.appendRow(["Civic", "Honda", "2005"])
step3.appendRow(["Accord", "Honda", "2001"])
step3.appendRow(["Gustang", "Ford", "1995"])
step3.appendRow(["Yaris", "Toyota", "1996"])
step3.appendRow(["Model-T", "Ford", "1102"])
step3.appendRow(["Enzo", "Ferrari", "1996"])
step3.appendRow(["458", "Ferrari", "1996"])

step3.setCell(3, 0, "Mustang")

// Deleting row.
const step4 = new EasyTable("step4", "step4Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
step4.appendRow(["Camry", "Toyota", "2000"])
step4.appendRow(["Civic", "Honda", "2005"])
step4.appendRow(["Accord", "Honda", "2001"])
step4.appendRow(["Mustang", "Ford", "1995"])
step4.appendRow(["Yaris", "Toyota", "1996"])
step4.appendRow(["Model-T", "Ford", "1102"])
step4.appendRow(["Enzo", "Ferrari", "1996"])
step4.appendRow(["458", "Ferrari", "1996"])

step4.deleteRow(5)

// Loading CSV.
const step5 = new EasyTable("step5", "step5Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
step5.appendRow(["Camry", "Toyota", "2000"])
step5.appendRow(["Civic", "Honda", "2005"])
step5.appendRow(["Accord", "Honda", "2001"])
step5.appendRow(["Mustang", "Ford", "1995"])
step5.appendRow(["Yaris", "Toyota", "1996"])
step5.appendRow(["Enzo", "Ferrari", "1996"])
step5.appendRow(["458", "Ferrari", "1996"])

const csv = "Huracan, Lamborghini, 2016\n Aventador, Lamborghini, 2012"

step5.loadFromCSV(csv)

// Loading JSON.
const step6 = new EasyTable("step6", "step6Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
step6.appendRow(["Camry", "Toyota", "2000"])
step6.appendRow(["Civic", "Honda", "2005"])
step6.appendRow(["Accord", "Honda", "2001"])
step6.appendRow(["Mustang", "Ford", "1995"])
step6.appendRow(["Yaris", "Toyota", "1996"])
step6.appendRow(["Enzo", "Ferrari", "1996"])
step6.appendRow(["458", "Ferrari", "1996"])

const json = `[{
    "Model": "Rogue",
    "Brand": "Nissan",
    "Year": "2014"
}]`

step6.loadFromJSON(json)

// TODO; 
// 1. Write to CSV/JSON
// 2. Fix loadFromCSV to read a single CSV STRING, not an array.