# EASYTable

### Links

Visit EASYTable's official website for help: <https://salty-cove-11433.herokuapp.com/GettingStarted>

Checkout the documentation here: <https://salty-cove-11433.herokuapp.com/Docs>

### Getting Started

To see the resulting tables, documentation, and more, please visit the official website.


#### Creating Your First EASYTable

Before you can use the awesome features of EASYTable, you must get the library. To get started, just paste the following tag in your HTML file. Thats it! Now you can go ahead and use the library to create awesome tables!

```
<script defer type="text/javascript" src='EasyTable.js'></script>;
```
To create a new table, we call the constructor and pass in the following arguments: name of table, id of parent, and an options object-literal, set with the following attributes:`columns`, `defaultSearch`, `defaultStyle` Using the constructor below, we will create an empty table with the headers <span class="option">"Model"</span>, <span class="option">"Brand"</span>, and <span class="option">"Year</span>. This table will be appended to the HTML element with id `main`, and will use default style `1`. Additionally, it will have a library-provided default search bar, which lets users search the rows of the table. Feel free to try it out in later examples.

```
// Creating a new table.
const myTable = new EasyTable("step1", "step1Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true
})
```

### Entering Data

Adding new data is very simple, as EASYTable provides multiple methods for adding new data. For a detailed list, please visit the docs. Here, we call the `.appendRow()` method to append a few rows to the end of the table. This method only has one argument; an array of values. Note that number of elements in the array must match the number of columns; it won't be inserted otherwise.               

#### Appending Some Rows
```
myTable.appendRow(["Camry", "Toyota", "2000"])
myTable.appendRow(["Civic", "Honda", "2005"]) 
myTable.appendRow(["Accord", "Honda", "2001"]) 
myTable.appendRow(["Gustang", "Ford", "1995"]) 
myTable.appendRow(["Yaris", "Toyota", "1996"]) 
myTable.appendRow(["Model-T", "Ford", "1102"]) 
myTable.appendRow(["Enzo", "Ferrari", "1996"]) 
myTable.appendRow(["458", "Ferrari", "1996"]) 
```
### Updating the Table
                
Woops! Looks like I mis-spelled Mustang. Luckily, EASYTable
provides methods that allow users to update
tables at the granularity of rows OR cells. Realisticaly, these
methods would be used to update specific cells/rows
based on certain user interactions, and not to fix spelling
mistakes. Here, I choose to employ the
`.setCell()` method to fix
the error. This method takes 3 parameters; index of `row`, index of `col`, and the `data` to be set in the specified cell.

### Removing Data

You know what, I no longer want the Model-T in our table; its
waaaaaay too old! To delete a row, call the `.deleteRow()` method,
which only takes in one argument; the index of the `row` we wish
to delete. Conviently, this method returns a boolean value that
indicates whether the operation was successful or not. We can
use it to error check our code, but its not necessary here.

#### Removing the Model-T
```
myTable.deleteRow(5)
```
### Loading Data-Sets
Congrats! By this point, you know how to perform basic
operations, such as creating tables, and adding, updating, and
removing data. Before you move on, however, I'd like to show you
one more basic but powerful feature: loading data-sets.
EASYTable currently supports two formats; `CSV` and `JSON`. That
means if you have tabular data in either of these formats, you
can use the built-in methods to quickly load them into an
instance of EASYtable.

Note that EASYTable can only transform data from these formats;
it is up to you, the developer, to get the data-set from your
desired source (API call / database / local file).

To load a `CSV` data set, first get
the data, then call the
`.loadFromCSV()` method; this will
read the provided data, and
transform it into a table. Similarly, to load a `JSON` data-set, call
`.loadFromJSON()` . These methods can be called at anytime, and not just immidiately after instantiation.



