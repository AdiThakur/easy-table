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
    constructor(name, parentId, columns, allowSearch) {

        this.table = document.createElement('table')
        this.head = document.createElement('thead')
        this.body = document.createElement('tbody')

        this.table.setAttribute("name", name)
        this.table.appendChild(this.head)
        this.table.appendChild(this.body)

        this.columns = [...columns]
        this.colCount = this.columns.length
        this.rowCount = 0
        _setColumns(this.columns, this.head)

        // Optional Arguments
        allowSearch ? this._enableSearch(this.head, this.columns) : null

        const parentElem = document.querySelector(`#${parentId}`)
        parentElem.appendChild(this.table)
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
        for (let j = 0; j < this.colCount; j++) {
            const newCell = _createCell()
            newCell.appendChild(_createTest(cells[j]))
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
     * @param {Integer} row     Row of desired cell.
     * @param {Integer} col     Column of desired cell.
     */
    getCell = (row, col) => {

        if (!_valid_index(row, this.rowCount) || !_valid_index(col, this.colCount)) {
            return null
        }
        return this.body.children[row].children[col].innerHTML
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

    /** Search Functionality. */
    _enableSearch = () => {
        this.#addInputField()
    }

    #addInputField = () => {

        console.log("Adding form")
        const row = _createRow()
        this.head.appendChild(row)

        for (let i = 0; i < this.colCount; i++) {

            const input = document.createElement('input')
            input.type = "text"
            input.placeholder = "Type in query"
            input.style.cssText = "width: 100px"

            const cell = _createCell()
            cell.appendChild(input)
            row.appendChild(cell)
        }
        const submit = document.createElement('input')
        submit.type = "submit"
        submit.onclick = this.#search
        row.appendChild(submit)
    }

    #search = () => {

        const inputRow = this.head.lastChild
        const queries = []
        for (let i = 0; i < this.colCount; i++) {
            queries.push(inputRow.children[i].text)
        }
        console.log(queries)
    }
}

/** Private Helpers: Inaccesible by client-code. */

_setColumns = (columns, head) => {

    const headerRow = _createRow('tr')

    columns.forEach(colHeader => {
        let headerCell = _createCell()
        headerCell.appendChild(_createTest(`${colHeader}`))
        headerRow.appendChild(headerCell)
    });

    head.appendChild(headerRow)
}



_createCell = () => {
    return document.createElement('td')
}

_createRow = () => {
    return document.createElement('tr')
}

_createTest = (text) => {
    return document.createTextNode(text)
}

_valid_index = (i, max) => {
    return (0 <= i && i < max)
}

_valid_cells = (countCells, maxCells) => {
    return (countCells == maxCells)
}