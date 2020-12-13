class EasyTable extends HTMLElement {

    /**
     * Create a new table with specified name and columns, and append it to to the element
     * with id parentId.
     * 
     * @param {String} name             Name of table.
     * @param {String} parentId         Id of parent element in which this table should be appended.
     * @param {Array[String]} columns   Array of strings represting column headers.
     * @param {Object} options          Object literal containing all constructor options.
     */
    constructor(name, parentId, options) {

        super()

        // Underlying HTMLTable* objects.
        this.table = _createElem('table')
        this.head = _createElem('thead')
        this.body = _createElem('tbody')
        this.table.setAttribute("name", name)
        this.table.appendChild(this.head)
        this.table.appendChild(this.body)

        this.columns = [...options.columns]
        this.colCount = this.columns.length
        this.rowCount = 0
        this.input = null
        this._setColumns()

        // Search
        if (options.enableSearch) {
            this.search = true
            this._addInputFields()
        }

        // Shadow DOM to encapsulate the component.
        this.shadow = document.querySelector(`#${parentId}`).attachShadow({ mode: 'closed' })

        // Table's style.
        if (options.stylesheet) {
            const link = _createElem('link')
            link.setAttribute('rel', 'stylesheet')
            link.setAttribute('href', `${options.stylesheet}`)
            this.shadow.appendChild(link)
        } else if (options.cssText) {
            const style = _createElem('style')
            this.shadow.appendChild(style)
        } else {
            const style = _createElem('style')
            style.textContent = this._selectStyle(options.defaultStyle)
            this.shadow.appendChild(style)
        }

        this.shadow.appendChild(this.table)
    }

    /** Helpers */

    _selectStyle = (styleNum) => {
        switch (styleNum) {
            case 1:
                return style1
            case 2:
                return style2
            case 3:
                return style3
            default:
                return style1
        }
    }

    /** Methods for Columns. */

    // Initalize column headers provided during instantiation.
    _setColumns = () => {

        const headerRow = _createElem('tr')
        this.head.appendChild(headerRow)
        headerRow.style.cssText = "text-align: center"

        this.columns.forEach(colHeader => {
            let headerCell = _createElem('td')
            headerCell.setAttribute("class", "headerCell")
            headerCell.appendChild(_createText(`${colHeader}`))
            headerRow.appendChild(headerCell)
        });
    }

    /**
     * @param {String} header           Header of new col.
     * @param {Any} defaultData         Default data to be set in each row of the new col.
     * @param {Array | Null} dataList   Array of data to be set in the rows of the new col.
     * @returns {Boolean}               True on success, false on error.
     */
    appendCol = (header, defaultData, dataList) => {

        return this.insertCol(this.colCount, header, defaultData, dataList)
    }

    /**
     * @param {Integer} i               Position to insert new col.   
     * @param {String} header           Header of new col.
     * @param {Any} defaultData         Default data to be set in each row of the new col.
     * @param {Array | Null} dataList   Array of data to be set in the rows of the new col.
     * @returns {Boolean}               True on success, false on error.
     */
    insertCol = (i, header, defaultData, dataList) => {

        if (dataList && dataList.length != this.rowCount) {
            return false
        }
        if (!_valid_index(i, this.colCount + 1)) {
            return false
        }
        if (!dataList && (defaultData === null)) {
            return false
        }

        // Create and insert new header cell.
        this.columns.push(header)

        const headerCell = _createElem('td')
        headerCell.setAttribute("class", "headerCell")
        headerCell.appendChild(_createText(header))

        const headerRow = this.head.children[0]
        if (i == this.colCount) {
            headerRow.appendChild(headerCell)
        } else {
            headerRow.insertBefore(headerCell, headerRow.children[i])
        }

        // Appending new data to each existing row.
        for (let j = 0; j < this.rowCount; j++) {

            const row = this.body.children[j]
            const cell = _createElem('td')
            cell.setAttribute("class", "dataCell")
            // Setting data for new cell.
            if (defaultData != null) {
                cell.appendChild(_createText(defaultData))
            } else if (dataList) {
                cell.appendChild(_createText(dataList[j]))
            }
            // Inserting new data-cell.
            if (i == this.colCount) {
                row.appendChild(cell)
            } else {
                row.insertBefore(cell, row.children[i])
            }
        }

        // Making search bar span newly created column.
        this.input.parentElement.setAttribute("colspan", ++this.colCount)
        return true
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
     * @param {Integer} i       Position to insert new row.
     * @param {Array} cells     Array of data to be set in new row.
     * @returns {Boolean}       True on success, false on error.
     */
    insertRow = (i, cells) => {

        if (!_valid_index(i, this.rowCount + 1) || !_valid_cells(cells.length, this.colCount)) {
            return false
        }
        // Create new row; populate it well cells that contain specified data.
        let newRow = this.body.insertRow(i)
        newRow.setAttribute("class", "dataRow")

        for (let j = 0; j < this.colCount; j++) {
            const newCell = _createElem('td')
            newCell.setAttribute("class", "dataCell")
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
            row.children[j].innerHTML = data[j]
        }
        return true
    }

    /**
     * @returns {HTMLTableRowElement | Null}    Returns true if successful, null otherwise.
     */
    popRow = () => {
        return this.deleteRow(this.rowCount - 1)
    }

    /**
     * @param {Integer} i                       Index of the row to delete.
     * @returns {HTMLTableRowElement | Null}    Returns true if successful, null otherwise.
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
        this.getCell(row, col).innerText = data
        return true
    }


    /** Search Functionality Helpers.*/


    // Creates the search bar and button.
    _addInputFields = () => {

        const searchRow = _createElem('tr')
        this.head.appendChild(searchRow)

        // Cell that spans all columns; houses search bar.
        const searchCell = _createElem('td')
        searchRow.appendChild(searchCell)
        searchCell.setAttribute("colspan", this.colCount)

        // Search bar.
        const searchBarInput = _createElem('input')
        searchCell.appendChild(searchBarInput)
        this.input = searchBarInput
        searchBarInput.addEventListener("search", this._resetTable)

        searchBarInput.placeholder = "Search..."
        searchBarInput.setAttribute("type", "search")
        searchBarInput.style.cssText = "width: 75%; margin: 0px; padding: 0px; box-sizing: border-box;"

        // Search button.
        const searchButton = _createElem('button')
        searchCell.appendChild(searchButton)

        searchButton.style.cssText = "width: 25%; margin: 0px; padding: 0px;  box-sizing: border-box;"
        searchButton.innerText = "Search"
        searchButton.onclick = this._search
    }

    // Reset table to initial state.
    _resetTable = (e) => {
        // Show all rows.
        for (let i = 0; i < this.rowCount; i++) {
            this.body.children[i].style.display = ""
        }
    }

    // Search algo; Displayed rows contain one or more cells that matches the search query.
    _search = () => {

        this._resetTable()

        const inputRow = this.head.lastChild
        const query = this.input.value.toUpperCase()

        if (!query) {
            return
        }

        // Identify rows that match query.
        for (let i = 0; i < this.rowCount; i++) {
            const currRow = this.body.children[i]
            let currRowMatches = 0
            // If any cell matches query; display row.
            for (let j = 0; j < this.colCount; j++) {
                const currCell = currRow.children[j]
                if (currCell.innerText.toUpperCase().includes(query)) {
                    currRowMatches++
                }
            }
            if (!currRowMatches) {
                currRow.style.display = "none"
            }
        }
    }
}

// Declaring custom element.
customElements.define('easy-table', EasyTable)

/** Default Styles. */

const style1 = `
    .headerCell {
        background-color: rgb(194, 187, 187);
        font-size: 1.75rem;
        border: 1px solid #333;
    }

    .inputCell {
        padding: 3px;
        margin: auto;
    }

    .dataCell {
        padding: 3px;
        background-color: rgb(241, 241, 241);
        font-size: 1.25rem;
        border: 1px solid #333;
    }
`

const style2 = `
    .headerCell {
        color: white;
        background-color: #007c77;
        font-size: 1.75rem;
        border: 1px solid #333;
    }

    .inputCell {
        padding: 3px;
        margin: auto;
    }

    .dataCell {
        padding: 3px;
        font-size: 1.25rem;
        border: 1px solid #333;
    }

    .dataRow:nth-child(even) {
        background-color: #bbb;
    }
`

const style3 = `
    .headerCell {
        background-color: rgb(91, 126, 223);
        font-size: 1.75rem;
        border: 1px solid #333;
    }

    .inputCell {
        padding: 3px;
        margin: auto;
    }

    .dataCell {
        padding: 3px;
        font-size: 1.25rem;
        border: 1px solid #333;
    }

    .dataRow:nth-child(even) {
        background-color: rgb(163, 184, 243);
    }
`

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