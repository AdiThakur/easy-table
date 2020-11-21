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

        this.table = _createElem('table')
        this.head = _createElem('thead')
        this.body = _createElem('tbody')

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
            const newCell = _createElem('td')
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
        this._addInputFields()
    }

    _addInputFields = () => {

        console.log("Adding form")
        const row = _createElem('tr')
        this.head.appendChild(row)

        for (let i = 0; i < this.colCount; i++) {

            const input = _createElem('input')
            input.type = "text"
            input.placeholder = "Search..."
            input.style.cssText = "width: 85px"

            const cell = _createElem('td')
            cell.appendChild(input)
            row.appendChild(cell)
        }
        const submit = _createElem('input')
        submit.type = "submit"
        submit.onclick = this._search
        row.appendChild(submit)
    }

    _search = () => {

        const inputRow = this.head.lastChild
        const queries = []
        const searchResultsBody = _createElem('tbody')

        for (let i = 0; i < this.colCount; i++) {
            queries.push(inputRow.children[i].lastChild.value)
        }
        const desiredMatches = queries.filter(word => {
            if (word) {
                return true
            }
        }).length

        for (let i = 0; i < this.rowCount; i++) {
            const currRow = this.body.children[i]
            let currRowMatches = 0
            for (let j = 0; j < this.colCount; j++) {
                const currCell = currRow.children[j]
                if (queries[j].includes(currCell.value)) {
                    currRowMatches++
                }
            }
            if (currRowMatches == desiredMatches) {
                searchResultsBody.appendChild(currRow)
            }
        }
        console.log("New body: ", searchResultsBody)
        this.originalBody = this.body
        this.body = searchResultsBody
    }
}

/** Private Helpers: Inaccesible by client-code. */

_setColumns = (columns, head) => {

    const headerRow = _createElem('tr')
    headerRow.style.cssText = "text-align: center"

    columns.forEach(colHeader => {
        let headerCell = _createElem('td')
        headerCell.appendChild(_createText(`${colHeader}`))
        headerRow.appendChild(headerCell)
    });

    head.appendChild(headerRow)
}

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