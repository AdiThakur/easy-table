class EasyTable {

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

        // Underlying HTMLTable* objects.
        this.table = _createElem('table')
        this.header = _createElem('thead')
        this.body = _createElem('tbody')
        this.footer = _createElem('tfoot')

        this.table.setAttribute("name", name)
        this.table.appendChild(this.header)
        this.table.appendChild(this.body)
        this.table.appendChild(this.footer)

        this.columns = [...options.columns]
        this.colCount = this.columns.length
        this.rowCount = 0
        this.input = null
        this._setColumns()

        // Shadow DOM to encapsulate the table's CSS.
        this.shadow = document.querySelector(`#${parentId}`).attachShadow({ mode: 'closed' })
        this.shadow.appendChild(this.table)

        // Initialize search functionality.
        if (options.enableSearch) {
            this.searchEnabled = true
            this._addInputFields()
        }

        // Set-up table's style.
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

        // Initialize pagination.
        if (options.paginate) {
            this.paginateEnabled = true
            this.rowsPerPage = options.paginate
            this.currPage = 1
            this._addPaginationFields()
        }

        // Initialize sorting.
        if (options.sort) {
            this.sortEnabled = true
            this._initializeSort()
        }
    }

    /** General Helpers. */

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

    /** Sorting Functionality. */

    // Set-up sorting buttons for column headers at instantiation.
    _initializeSort = () => {
        const headerCells = Array.from(this.header.children[0].children)
        headerCells.forEach(header => {
            this._addSortButtons(header.children[0])
        })
    }

    // Add sorting buttons to given cell.
    _addSortButtons = (newHeaderCell) => {

        const container = _createElem('div')
        newHeaderCell.appendChild(container)
        container.style.cssText = "margin-left: 5px;"

        const createSortButton = (direction) => {
            const sortButton = _createElem('button')
            container.appendChild(sortButton)
            sortButton.setAttribute("class", "sortButton")
            sortButton.style.cssText = "display: block; margin: 0px; width: 45px; font-size: 12px"
            sortButton.innerText = direction == 1 ? "ASC" : "DSC"
            sortButton.onclick = direction == 1 ? this._sortAscending : this._sortDescending
        }

        createSortButton(1)
        createSortButton(-1)
    }

    // Callback for ascending sort button.
    _sortAscending = (event) => {
        this._sort(event, 1)
    }

    // Callback for descending sort button.
    _sortDescending = (event) => {
        this._sort(event, -1)
    }

    // Simple sorting algorithm.
    _sort = (event, direction) => {

        // Find index of col to be sorted.
        const header = event.target.parentElement.parentElement.innerText.split("\n")[0]
        const col = this.columns.indexOf(header)

        const swap = (elem1, elem2) => {
            elem1.parentNode.insertBefore(elem2, elem1)
        }
        // Good ole bubble-sort.
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.rowCount - i - 1; j++) {

                const currCell = this.body.children[j].children[col].innerText.toLowerCase()
                const nextCell = this.body.children[j + 1].children[col].innerText.toLowerCase()

                if (direction == 1) {
                    if (currCell > nextCell) {
                        swap(this.body.children[j], this.body.children[j + 1])
                    }
                } else if (direction == -1) {
                    if (currCell < nextCell) {
                        swap(this.body.children[j], this.body.children[j + 1])
                    }
                }
            }
        }
        // Pagiante the sorted rows.
        if (this.paginateEnabled) {
            this._paginate()
        }
    }

    /** Pagination Functionality and Helpers */

    // Callback for previous page button.
    _prevPage = () => {
        this.currPage -= 1
        if (this.currPage < 1) {
            this.currPage = Math.ceil(this.rowCount / this.rowsPerPage)
        }
        this._paginate()
    }

    // Callback for next page button.
    _nextPage = () => {
        this.currPage += 1
        if (this.currPage > Math.ceil(this.rowCount / this.rowsPerPage)) {
            this.currPage = 1
        }
        this._paginate()
    }

    // Split the displayed table into set of pages.
    _paginate = () => {

        this.pageNumberDisplay.innerText = this.currPage

        const firstRowIndex = (this.currPage - 1) * this.rowsPerPage
        const lastRowIndex = firstRowIndex + this.rowsPerPage - 1

        this._resetTable()

        for (let i = 0; i < this.rowCount; i++) {
            // Hide off-page rows.
            if (i < firstRowIndex || i > lastRowIndex) {
                this.body.children[i].style.display = "none"
            }
        }
    }

    // Add buttons to navigate the pages of the table.
    _addPaginationFields = () => {

        // Houses the prev and next buttons, and the page number.
        const cell = _createElem('td')
        this.footer.appendChild(cell)
        cell.setAttribute("colspan", this.colCount)

        const paginationTray = _createElem('div')
        cell.appendChild(paginationTray)
        paginationTray.style.cssText = "width: fit-content; margin: auto; padding: 5px;"

        const prevButton = _createElem('button')
        paginationTray.appendChild(prevButton)
        prevButton.innerText = "Prev"
        prevButton.onclick = this._prevPage

        const pageNumberDisplay = _createElem("span")
        paginationTray.appendChild(pageNumberDisplay)
        pageNumberDisplay.style.cssText = "padding: 0px 10px;"
        pageNumberDisplay.innerText = "0"
        // Store reference to update later.
        this.pageNumberDisplay = pageNumberDisplay

        const nextButton = _createElem('button')
        paginationTray.appendChild(nextButton)
        nextButton.innerText = "Next"
        nextButton.onclick = this._nextPage
    }

    /** Methods for Columns. */

    // Initalize column headers provided during instantiation.
    _setColumns = () => {

        const headerRow = _createElem('tr')
        this.header.appendChild(headerRow)
        headerRow.style.cssText = "text-align: center"

        this.columns.forEach(colHeader => {

            const headerCell = _createElem('td')
            headerRow.appendChild(headerCell)

            const container = _createElem('div')
            headerCell.appendChild(container)
            container.setAttribute("class", "headerCell")
            container.appendChild(_createText(colHeader))
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
        this.columns.splice(i, 0, header)

        const headerCell = _createElem('td')
        headerCell.setAttribute("class", "headerCell")
        headerCell.appendChild(_createText(header))

        const headerRow = this.header.children[0]
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

        this.colCount++

        // Add sort buttons for new column.
        if (this.sortEnabled) this._addSortButtons(headerCell)
        // Making search bar span the new column.
        if (this.searchEnabled) this.input.parentElement.setAttribute("colspan", this.colCount)
        // Making the pagination tray span the new column.
        if (this.paginateEnabled) this.footer.children[0].setAttribute("colspan", this.colCount)

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
        // Ensure that only on-page rows are displayed.
        if (this.paginateEnabled) this._paginate()

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
        // Ensure that only on-page rows are displayed.
        if (this.paginateEnabled) this._paginate()

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

    /** Search Functionality.*/

    // Creates the search bar and button.
    _addInputFields = () => {

        const searchRow = _createElem('tr')
        this.header.appendChild(searchRow)

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
        searchBarInput.style.cssText = "width: 85%; margin: 0px; padding: 0px; box-sizing: border-box;"

        // Search button.
        const searchButton = _createElem('button')
        searchCell.appendChild(searchButton)

        searchButton.style.cssText = "width: 15%; margin: 0px; padding: 0px;  box-sizing: border-box;"
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

        const query = this.input.value.toUpperCase()
        if (!query) return

        for (let i = 0; i < this.rowCount; i++) {
            this.body.children[i].style.display = ""
        }



        // Identify rows that match query.
        for (let i = 0; i < this.rowCount; i++) {
            const currRow = this.body.children[i]
            let currRowMatches = 0
            // If any cell matches query; display row.
            for (let j = 0; j < this.colCount; j++) {
                console.log(`Row: ${i} Col: ${j}`)
                const currCell = currRow.children[j]
                if (currCell.innerText.toUpperCase().includes(query)) {
                    currRowMatches++
                }
            }
            if (!currRowMatches) {
                currRow.style.display = "none"
            }
        }
        //if (this.paginateEnabled) this._paginate()
    }
}

/** Default Styles. */

const style1 = `
    .headerCell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 100px;
        text-align: center;
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
        display: flex;
        align-items: center;
        justify-content: space-between;

        color: white;
        min-width: 100px;
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

    button {
        font-size: 12px;
    }
`

const style3 = `
    .headerCell {
        display: flex;
    align-items: center;
    justify-content: space-between;

        min-width: 100px;
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