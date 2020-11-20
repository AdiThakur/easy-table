class EasyTable {

    /**
     * Create a new table with specified name and columns, and append to to the element
     * with id parentId.
     * 
     * @param {String} name             Name of table.
     * @param {String} parentId         Id of parent element in which this table should be appended.
     * @param {Array[String]} columns   Array of strings represting column headers.
     */
    constructor(name, parentId, columns) {

        this.name = name
        this.head = document.createElement('thead')
        this.body = document.createElement('tbody')
        this.columns = [...columns]
        this.rowCount = 0

        this.table = document.createElement('table')
        this.table.setAttribute("name", name)
        this.table.appendChild(this.head)
        this.table.appendChild(this.body)

        this._setColumns()

        const parentElem = document.querySelector(`#${parentId}`)
        parentElem.appendChild(this.table)
    }

    _setColumns = () => {

        const headerRow = _createRow('tr')

        this.columns.forEach(colHeader => {
            let headerCell = _createCell()
            headerCell.appendChild(_createTest(`${colHeader}`))
            headerRow.appendChild(headerCell)
        });

        this.head.appendChild(headerRow)
    }

    /** CRUD Methods for Rows.*/

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

        if (!_valid_index(i, this.rowCount + 1) || !_valid_cells(cells.length, this.columns.length)) {
            return false
        }
        let newRow = this.body.insertRow(i)
        for (let j = 0; j < this.columns.length; j++) {
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

        if (!_valid_index(i, this.rowCount) || !_valid_cells(data.length, this.columns.length)) {
            return false
        }
        let row = this.body.children[i]
        for (let j = 0; j < this.columns.length; j++) {
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
}

/** Helpers */

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