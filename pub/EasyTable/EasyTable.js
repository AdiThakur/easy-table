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
        this.input = null
        this._setColumns()

        // Shadow DOM to encapsulate the table's CSS.
        this.shadow = document.querySelector(`#${parentId}`).attachShadow({ mode: 'closed' })
        this.shadow.appendChild(this.table)

        // Initialize search functionality.
        if (options.defaultSearch) {
            this.searchEnabled = true
            this._initializeSearchBar()
        }

        // Initialize table's style.
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
            this.rowsPerPage = options.paginate.perPage
            this.currPage = 1
            // Create default page changing buttons.
            if (options.paginate.default) {
                this._addPaginationFields()
            }
            this._paginate()
        }

        // Initialize sorting.
        if (options.defaultSort) {
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

    /** Loading from Data-sets Functionality.*/

    /**
     * @param {String} csvString    String containing data in CSV format.
     * @returns                     True on success, false otherwise.
     */
    loadFromCSV = (csvString) => {

        const lines = csvString.split("\n")
        const newRows = []

        lines.forEach(line => {
            const values = line.trim().split(",")
            if (values.length != this.colCount) {
                return false
            }
            newRows.push(values)
        })
        // Only start insertion if all of the CSV was correctly parsed.
        newRows.forEach(row => {
            this.appendRow(row)
        })
        return true
    }

    saveToCSV = () => {

        // Ensures entire table is loaded before saving.
        if (this.paginateEnabled) _paginate.call(this)

        let csvString = this.columns.join(", ") + "\n"
        const rows = this.getRowCount()
        const cols = this.colCount

        for (let i = 0; i < rows; i++) {
            const values = []
            for (let j = 0; j < cols; j++) {
                values.push(this.getCell(i, j).innerText)
            }
            csvString = csvString + values.join(", ") + "\n"
        }
        return csvString
    }

    /**
     * @param {Array[String]} json    Valid JSON string.
     * @returns {Boolean}             True on success, false otherwise.
     */
    loadFromJSON = (json) => {

        let objList
        try {
            objList = JSON.parse(json)
        } catch (error) {
            console.warn(`EasyTable.loadFromJSON: Invalid JSON. \n Error Caught: ${error}`)
            return false
        }

        objList.forEach(obj => {
            const values = []
            // Keys may not be in the same order as columns; arrange them accordingly.
            Object.keys(obj).forEach(key => {
                const col = this.columns.indexOf(key)
                values.splice(col, 0, obj[key])
            })
            this.appendRow(values)
        })
        return true
    }

    saveToJSON = () => {

        let objList = []
        const rows = this.getRowCount()

        for (let i = 0; i < rows; i++) {
            const obj = {}
            for (let j = 0; j < this.colCount; j++) {
                obj[this.columns[j]] = this.getCell(i, j).innerText.trim()
            }
            objList.push(obj)
        }
        return JSON.stringify(objList)
    }

    /** Methods for Columns. */

    // Initalize column headers provided during instantiation.
    _setColumns = () => {

        const headerRow = _createElem('tr')
        this.header.appendChild(headerRow)
        headerRow.style.cssText = "text-align: center"

        this.columns.forEach(colHeader => {
            headerRow.appendChild(this._createHeader(colHeader))
        })
    }

    // Create and return a new header with proper styles.
    _createHeader = (colHeader) => {

        const headerCell = _createElem('td')

        const container = _createElem('div')
        headerCell.appendChild(container)
        container.setAttribute("class", "headerCell")
        container.appendChild(_createText(colHeader))

        return headerCell
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

        if (dataList && dataList.length != this.body.childElementCount) {
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

        const headerCell = this._createHeader(header)

        const headerRow = this.header.children[0]
        if (i == this.colCount) {
            headerRow.appendChild(headerCell)
        } else {
            headerRow.insertBefore(headerCell, headerRow.children[i])
        }

        // Appending new data to each existing row.
        for (let j = 0; j < this.body.childElementCount; j++) {

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
        if (this.searchEnabled) this.input.parentElement.parentElement.setAttribute("colspan", this.colCount)
        // Making the pagination tray span the new column.
        if (this.paginateEnabled) this.footer.children[0].parentElement.setAttribute("colspan", this.colCount)

        return true
    }

    /** Methods for Rows (CRUD)*/

    /**
     * @param {Integer} i                       Index of the desired row.
     * @returns {HTMLTableRowElement | Null}    Returns the row element at index i if it
     *                                          exists, null otherwise.
     */
    getRow = (i) => {

        if (!_valid_index(i, this.body.childElementCount)) {
            return null
        }
        return this.body.children[i]
    }

    /**
     * @param {Integer} i                       Index of the desired row.
     * @param {Array} data                      Array of data to be set in the row at index i.
     * @returns {Boolean}                       Returns true on success, false on error.
     */
    setRow = (i, data) => {

        if (!_valid_index(i, this.body.childElementCount) || !_valid_cells(data.length, this.colCount)) {
            return false
        }
        let row = this.body.children[i]
        for (let j = 0; j < this.colCount; j++) {
            row.children[j].innerHTML = data[j]
        }
        return true
    }

    /**
     * @param {Array} cells     Array of data to be set in new row.
     * @returns {Boolean}       True on success, false on error.
     */
    appendRow = (cells) => {
        return this.insertRow(this.body.childElementCount, cells)
    }

    /**
     * @param {Integer} i       Position to insert new row.
     * @param {Array} cells     Array of data to be set in new row.
     * @returns {Boolean}       True on success, false on error.
     */
    insertRow = (i, cells) => {

        if (!_valid_index(i, this.body.childElementCount + 1) || !_valid_cells(cells.length, this.colCount)) {
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
        // Ensure that only on-page rows are displayed.
        if (this.paginateEnabled) this._paginate()

        return true
    }

    /**
     * @returns {Boolean | Null}    Returns true if successful, null otherwise.
     */
    popRow = () => {
        return this.deleteRow(this.body.childElementCount - 1)
    }

    /**
     * @param {Integer} i           Index of the row to delete.
     * @returns {Boolean | Null}    Returns true if successful, null otherwise.
     */
    deleteRow = (i) => {

        if (!_valid_index(i, this.body.childElementCount)) {
            return false
        }
        this.body.deleteRow(i)
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

        if (!_valid_index(row, this.body.childElementCount) || !_valid_index(col, this.colCount)) {
            return null
        }
        return this.body.children[row].children[col]
    }

    /**
     * @param {Integer} row     Row of desired cell.
     * @param {Integer} col     Column of desired cell.
     * @param {Any} data        Data be set in specified cell.
     * @returns {Boolean}       True on success, false otherwise.
     */
    setCell = (row, col, data) => {

        if (!_valid_index(row, this.body.childElementCount) || !_valid_index(col, this.colCount)) {
            return false
        }
        this.getCell(row, col).innerText = data
        return true
    }

    /** Search Functionality.*/

    // Creates the search bar and button.
    _initializeSearchBar = () => {

        const searchRow = _createElem('tr')
        this.header.appendChild(searchRow)

        // Cell that spans all columns; houses search bar.
        const searchCell = _createElem('td')
        searchRow.appendChild(searchCell)
        searchCell.setAttribute("colspan", this.colCount)
        searchCell.setAttribute("class", "searchCell")

        // Middle layer of div makes style manipulation easier (td's display properties are weird)
        const container = _createElem('div')
        container.setAttribute("class", "searchContainer")
        searchCell.appendChild(container)

        // Search bar.
        const searchBarInput = _createElem('input')
        container.appendChild(searchBarInput)
        this.input = searchBarInput
        searchBarInput.addEventListener("search", this.resetTable)
        searchBarInput.placeholder = "Search..."
        searchBarInput.setAttribute("type", "search")
        searchBarInput.style.cssText = "width: 85%;"

        // Search button.
        const searchButton = _createElem('button')
        container.appendChild(searchButton)

        searchButton.style.cssText = "width: 15%;"
        searchButton.innerText = "Search"
        searchButton.onclick = this._searchHelper
    }

    // Used to extract search query from the default searchbar (if enabled).
    _searchHelper = () => {
        const query = this.input.value.toUpperCase()
        this.search(query)
    }

    /**
     * Reset the table (clear the results of a search.)
     */
    resetTable = () => {

        // Reset table to show all of the original rows.
        if (this.originalBody) {
            this.body.remove()
            this.body = this.originalBody
            this.table.appendChild(this.body)
        }
        if (this.paginateEnabled) {
            this.currPage = 1
            this._paginate()
        }
    }

    /**
     * @param {String} query    Query to search.
     * @returns {Boolean}       Returns true if at least one row matches the query; false otherwise.
     */
    search = (query) => {

        if (!query) return false

        // Restore the table before modifying it to show results.
        this.resetTable()

        // New tbody to store the results.
        const newBody = _createElem('tbody')
        let found = false

        // Identify rows that match query.
        for (let i = 0; i < this.body.childElementCount; i++) {
            const currRow = this.body.children[i]
            let currRowMatches = 0
            // If any cell matches query; display row.
            for (let j = 0; j < this.colCount; j++) {
                const currCell = currRow.children[j]
                if (currCell.innerText.toUpperCase().includes(query)) {
                    currRowMatches++
                }
            }
            if (currRowMatches) {
                newBody.appendChild(currRow.cloneNode(true))
                found = true
            }
        }
        if (!found) return false

        // Original rows saved for later.
        this.originalBody = this.body.cloneNode(true)
        this.body.remove()

        // Display only the rows that match the query.
        this.table.appendChild(newBody)
        this.body = newBody

        // Paginate the results.
        if (this.paginateEnabled) this._paginate()
        return true
    }

    /** Sorting Functionality. */

    // Set-up sorting buttons for column headers at instantiation.
    _initializeSort = () => {
        const headerCells = Array.from(this.header.children[0].children)
        headerCells.forEach(header => {
            // Necessary to adjust the new buttons aestheticaly.
            header.children[0].style.cssText = "display: flex; align-items: center; justify-content: space-between;"
            console.log(header)
            this._addSortButtons(header.children[0])
        })
    }

    // Add sorting buttons to given header cell.
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

    // Callback for the default ascending sort button.
    _sortAscending = (event) => {
        const header = event.target.parentElement.parentElement.innerText.split("\n")[0]
        this.sort(this.columns.indexOf(header), 1)
    }

    // Callback for the default descending sort button.
    _sortDescending = (event) => {
        const header = event.target.parentElement.parentElement.innerText.split("\n")[0]
        this.sort(this.columns.indexOf(header), -1)
    }

    /**
     * @param {Integer} col         Index of column to sort.
     * @param {Integer} direction   1 to specify ascending order, -1 for descending order.
     */
    sort = (col, direction) => {

        const swap = (elem1, elem2) => {
            elem1.parentNode.insertBefore(elem2, elem1)
        }
        // Good ole bubble-sort.
        for (let i = 0; i < this.body.childElementCount; i++) {
            for (let j = 0; j < this.body.childElementCount - i - 1; j++) {

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
        // Paginate the sorted rows.
        if (this.paginateEnabled) {
            this._paginate()
        }
    }

    /** Pagination Functionality and Helpers */

    // Split the displayed table into set of pages.
    _paginate = () => {

        // Increment dispalyed page number if default buttons are enabled.
        if (this.pageNumberDisplay) {
            this.pageNumberDisplay.innerText = this.currPage
        }

        const firstRowIndex = (this.currPage - 1) * this.rowsPerPage
        const lastRowIndex = firstRowIndex + this.rowsPerPage - 1
        const rowCount = Math.min(this.body.childElementCount, this.body.childElementCount)

        for (let i = 0; i < rowCount; i++) {
            // Hide off-page rows.
            if (i < firstRowIndex || i > lastRowIndex) {
                this.body.children[i].style.display = "none"
            } else {
                this.body.children[i].style.display = ""
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
        prevButton.onclick = this.prevPage

        const pageNumberDisplay = _createElem("span")
        paginationTray.appendChild(pageNumberDisplay)
        pageNumberDisplay.style.cssText = "padding: 0px 10px;"
        pageNumberDisplay.innerText = "0"
        // Store reference to update later.
        this.pageNumberDisplay = pageNumberDisplay

        const nextButton = _createElem('button')
        paginationTray.appendChild(nextButton)
        nextButton.innerText = "Next"
        nextButton.onclick = this.nextPage
    }

    /**
     * Displays the previous page of the table.
     */
    prevPage = () => {
        if (!this.paginateEnabled) {
            return
        }
        this.currPage -= 1
        if (this.currPage < 1) {
            this.currPage = Math.max(Math.ceil(this.body.childElementCount / this.rowsPerPage), 1)
        }
        this._paginate()
    }

    /**
     * Displays the next page of the table.
     */
    nextPage = () => {
        if (!this.paginateEnabled) {
            return
        }
        this.currPage += 1
        if (this.currPage > Math.ceil(this.body.childElementCount / this.rowsPerPage)) {
            this.currPage = 1
        }
        this._paginate()
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

const style1 = `
        .headerCell {
            display: inline-block;
            width: 100%;

            color: white;
            min-width: 75px;
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
        .searchContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3px;
            font-size: 1.25rem;
            padding: 0px;
        }
        .searchCell {
            padding: 0px;
        }
        input {
            height: 100%;
            width: 85%;
            box-sizing: border-box;
        }
        button {
            font-size: 15px;
            height: 100%;
            box-sizing: border-box;
            min-width: fit-content; 
            padding: 0px 1px;
        }
        .sortButton {
            display: block; 
            margin: 0px; 
            width: 45px; 
            font-size: 12px;
        }
`

const style2 = `
        .headerCell {
            display: inline-block;
            width: 100%;

            color: white;
            min-width: 75px;
            background-color: #98b653fd;
            font-size: 1.75rem;
            border: 1px solid #333;
        }
        .inputCell {
            padding: 3px;
            margin: auto;
        }
        .dataCell {
            text-align: center;
            padding: 3px;
            font-size: 1.25rem;
            border: 1px solid #333;
        }
        .dataRow:nth-child(even) {
            background-color: #b1d166b6;
        }
        .searchContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3px;
            font-size: 1.25rem;
            padding: 0px;
        }
        .searchCell {
            padding: 0px;
        }
        input {
            height: 100%;
            width: 85%;
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid grey;
        }
        button {
            font-size: 15px;
            height: 100%;
            box-sizing: border-box;
            background-color: whitesmoke;
            border: 1px solid grey;
            border-radius: 5px;
            min-width: fit-content; 
            padding: 0px 1px;
        }
        .sortButton {
            display: block; 
            margin: 0px; 
            width: 45px; 
            font-size: 12px;
        }
`

const style3 = `
        .headerCell {
            display: inline-block;
            width: 100%;

            color: white;
            min-width: 75px;
            background-color: #f86868fd;
            font-size: 1.75rem;
            border: 1px solid #333;
        }
        .inputCell {
            padding: 3px;
            margin: auto;
        }
        .dataCell {
            text-align: center;
            padding: 3px;
            font-size: 1.25rem;
            border: 1px solid #333;
            background-color: rgb(241, 198, 198);
        }
        .searchContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3px;
            font-size: 1.25rem;
            padding: 0px;
        }
        .searchCell {
            padding: 0px;
        }
        input {
            height: 100%;
            width: 85%;
            box-sizing: border-box;
        }
        button {
            font-size: 15px;
            height: 100%;
            box-sizing: border-box;
            background-color: white;
            border: 1.5px lightgrey solid;
            min-width: fit-content; 
            padding: 0px 1px;
        }
        .sortButton {
            display: block; 
            margin: 0px; 
            width: 45px; 
            font-size: 12px;
        }
`