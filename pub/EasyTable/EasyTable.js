class EasyTable {

    /**
     * Create a new table with specified name and columns, and append it to to the element
     * with id parentId.
     * 
     * @param {String} name             Name of table.
     * @param {String} parentId         Id of parent element in which this table should be appended.
     * @param {Array[String]} columns   Array of strings represting column headers.
     * @param {Boolean} allowSearch     Boolean to enable search functionality on columns.
     */
    constructor(name, parentId, columns, allowSearch, defaultStyle) {

        this.table = _createElem('table')
        this.head = _createElem('thead')
        this.body = _createElem('tbody')

        this.table.setAttribute("name", name)
        this.table.appendChild(this.head)
        this.table.appendChild(this.body)

        this.columns = [...columns]
        this.colCount = this.columns.length
        this.rowCount = 0

        this.style = defaultStyle
        this.inputs = []

        this._setColumns()

        // Optional Arguments
        allowSearch ? this._addInputFields() : null

        const parentElem = document.querySelector(`#${parentId}`)
        parentElem.appendChild(this.table)
    }

    // Helpers to initialize the table.
    _setColumns = () => {

        console.log("headerCell" + this.style)

        const headerRow = _createElem('tr')
        headerRow.style.cssText = "text-align: center"

        this.columns.forEach(colHeader => {
            let headerCell = _createElem('td')
            headerCell.setAttribute("class", "headerCell" + this.style)
            headerCell.appendChild(_createText(`${colHeader}`))
            headerRow.appendChild(headerCell)
        });

        this.head.appendChild(headerRow)
    }

    /** Methods for Rows (CRUD)*/

    /**
     * @param {Array} cells     Array of data to be set in new row.
     * @returns {Boolean}       True on success, false on error.
     */
    appendRow = (cells) => {
        return this.insertRow(this.rowCount, cells)
    }

    /**
     * @param {Integer} i       
     * @param {Array} cells     Array of data to be set in new row.
     * @returns {Boolean}       True on success, false on error.
     */
    insertRow = (i, cells) => {

        if (!_valid_index(i, this.rowCount + 1) || !_valid_cells(cells.length, this.colCount)) {
            return false
        }
        let newRow = this.body.insertRow(i)
        newRow.setAttribute("class", "dataRow" + this.style)
        for (let j = 0; j < this.colCount; j++) {
            const newCell = _createElem('td')
            newCell.setAttribute("class", "dataCell" + this.style)
            newCell.appendChild(_createText(cells[j]))
            newRow.appendChild(newCell)
        }
        this.rowCount++
        return true
    }

    /**
     * @param {Integer} i                       Index of the desired row.
     * @returns {HTMLTableRowElement | Null}    Returns the row element at index i if it
     *                                          exists, null otherwise.
     */
    getRow = (i) => {

        if (!_valid_index(i, this.rowCount)) {
            return null
        }
        return this.body.children[i]
    }

    /**
     * @param {Integer} i                       Index of the desired row.
     * @param {Array} data                      Array of data to be set in the row at index i.
     * @returns {HTMLTableRowElement | Null}    Returns true on success, false on error.
     */
    setRow = (i, data) => {

        if (!_valid_index(i, this.rowCount) || !_valid_cells(data.length, this.colCount)) {
            return false
        }
        let row = this.body.children[i]
        for (let j = 0; j < this.colCount; j++) {
            const element = row.children[j]
            element.innerHTML = data[j]
        }
        return true
    }

    /**
     * @returns {HTMLTableRowElement | Null}    Returns the last row element if successful, null
     *                                          otherwise.
     */
    popRow = () => {

        let row = { ...this.body.lastChild }
        if (this.deleteRow(this.rowCount - 1)) {
            return row
        }
        return null
    }

    /**
     * @param {Integer} i                       Index of the row to delete.
     * @returns {HTMLTableRowElement | Null}    Returns true if successful, false on error.
     */
    deleteRow = (i) => {

        if (!_valid_index(i, this.rowCount)) {
            return false
        }
        this.body.deleteRow(i)
        this.rowCount--
        return true
    }

    /** Methods for Cells. */

    /**
     * @param {Integer} row                     Row of desired cell.
     * @param {Integer} col                     Column of desired cell.
     * @returns {HTMLTableCellElement | Null}   Returns cell at position (row, col) on success, null
     *                                          on failure.
     */
    getCell = (row, col) => {

        if (!_valid_index(row, this.rowCount) || !_valid_index(col, this.colCount)) {
            return null
        }
        return this.body.children[row].children[col]
    }

    /**
     * @param {Integer} row     Row of desired cell.
     * @param {Integer} col     Column of desired cell.
     * @param {Any} data        Data be set in specified cell.
     */
    setCell = (row, col, data) => {

        if (!_valid_index(row, this.rowCount) || !_valid_index(col, this.colCount)) {
            return false
        }
        this.body.children[row].children[col].innerHTML = data
        return true
    }

    /** Search Functionality Helpers.*/

    // Populate input fields for search functionality.
    _addInputFields = () => {

        const row = _createElem('tr')
        this.head.appendChild(row)

        for (let i = 0; i < this.colCount; i++) {
            const input = _createElem('input')
            // input.type = "search"
            input.type = "text"
            input.placeholder = "Search..."
            input.setAttribute("class", "inputCell" + this.style)

            const cell = _createElem('td')
            cell.appendChild(input)
            row.appendChild(cell)
            this.inputs.push(input)
        }
        const createButton = (value, callback, parent) => {
            let button = _createElem('input')
            button.type = "submit"
            button.value = value
            button.onclick = callback
            parent.appendChild(button)
        }
        createButton("Search", this._search, row)
        createButton("Clear", this._resetTable, row)
    }

    // Reset table to initial state.
    _resetTable = (clearInput) => {

        // Show all rows.
        for (let i = 0; i < this.rowCount; i++) {
            const currRow = this.body.children[i]
            currRow.style.display = ""
        }
        // Clear inputs.
        if (clearInput) {
            this.inputs.forEach(input => {
                input.value = ""
            });
        }
    }

    _search = () => {

        this._resetTable(false)

        const inputRow = this.head.lastChild
        const queries = []

        // Grab search queries.
        for (let i = 0; i < this.colCount; i++) {
            queries.push(inputRow.children[i].lastChild.value)
        }
        const desiredMatches = queries.filter(word => {
            if (word) {
                return true
            }
        }).length

        // Identify rows that match ALL queries.
        for (let i = 0; i < this.rowCount; i++) {
            const currRow = this.body.children[i]
            let currRowMatches = 0
            for (let j = 0; j < this.colCount; j++) {
                const currCell = currRow.children[j]
                if (queries[j].includes(currCell.innerText)) {
                    currRowMatches++
                }
            }
            if (currRowMatches != desiredMatches) {
                currRow.style.display = "none"
            }
        }
    }
}

/** Wrappers to minimize line length and line wrapping. */

_createElem = (elemString) => {
    return document.createElement(elemString)
}
_createText = (text) => {
    return document.createTextNode(text)
}
_valid_index = (i, max) => {
    return (0 <= i && i < max)
}
_valid_cells = (countCells, maxCells) => {
    return (countCells == maxCells)
}