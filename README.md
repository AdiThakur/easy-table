# EASYTable

### Links

Visit EASYTable's official website for help: <https://salty-cove-11433.herokuapp.com/GettingStarted>

Checkout the documentation here: <https://salty-cove-11433.herokuapp.com/Docs>

### Getting Started

For the complete demo, documentation, and more, please visit the official website.

First, you must get the EASYTable library. To get started, just paste the following tag in your HTML file. Thats it! Now you can go ahead and use the library to create awesome tables!

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
