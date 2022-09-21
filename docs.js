// Entering data.
const step2 = new EasyTable("step2", "constructor_table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true,
    defaultSort: true,
    paginate: { perPage: 4, default: true }
})
step2.appendRow(["Camry", "Toyota", "2000"])
step2.appendRow(["Civic", "Honda", "2005"])
step2.appendRow(["Accord", "Honda", "2001"])
step2.appendRow(["Mustang", "Ford", "1995"])
step2.appendRow(["Yaris", "Toyota", "1996"])
step2.appendRow(["Model-T", "Ford", "1102"])
step2.appendRow(["Enzo", "Ferrari", "1996"])
step2.appendRow(["458", "Ferrari", "1996"])