const myTable = new EasyTable("step1", "step1Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true,
    paginate: { perPage: 10, default: true }
})

const div = document.querySelector("#step1")

const input = document.createElement('input')
div.appendChild(input)

input.style.width = "75px"
input.placeholder = "Index of Col"

const sortButton = document.createElement('button')
div.appendChild(sortButton)

sortButton.innerText = "Sort"
sortButton.onclick = () => {
    myTable.sort(input.value, 1)
}

// Step 2

const step2 = new EasyTable("step2", "step2Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true,
    paginate: { perPage: 5, default: true }
})

const div2 = document.querySelector("#step2")

const csv = `Camry,	Toyota,	2000\n
Civic, Honda, 2005\n
Accord, Honda, 2001\n
Mustang, Ford, 1995\n
Aventador, Lamborghini, 2012\n
Huracan, Lamborghini, 2018\n
P1, McLaren, 2016\n`

step2.loadFromCSV(csv)
const input2 = document.createElement('input')
div2.appendChild(input2)

input2.style.width = "75px"
input2.placeholder = "Index of Col"

const sortButton2 = document.createElement('button')
div2.appendChild(sortButton2)

sortButton2.innerText = "Sort"
sortButton2.onclick = () => {
    step2.sort(input2.value, 1)
}

step2.insertCol(0, "Coolness", null, [1, 2.5, 4, 5, 7, 8.5, 9])

// Step 3

const step3 = new EasyTable("step3", "step3Table", {
    columns: ['Model', 'Brand', 'Year'],
    defaultStyle: 1,
    defaultSearch: true,
    paginate: { perPage: 5, default: true }
})

const div3 = document.querySelector("#step3")

step3.loadFromCSV(csv)
const input3 = document.createElement('input')
div3.appendChild(input3)

input3.style.width = "75px"
input3.placeholder = "Index of Col"

const sortButton3 = document.createElement('button')
div3.appendChild(sortButton3)

sortButton3.innerText = "Sort"
sortButton3.onclick = () => {
    step3.sort(input3.value, 1)
}

step3.insertCol(0, "Likes", null, [1, 2, 4, 5, 7, 8, 9])

const rows = step3.getRowCount()
const cols = step3.getColCount()

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const cell = step3.getCell(i, j)
        cell.ondblclick = () => {
            cell.style.cssText = "background-color: none;"
            if (j == 0) {
                cell.innerText = parseInt(cell.innerText) + 1
            }
        }
    }

}






