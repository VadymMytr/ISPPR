// Params:
// inputTable -- the table that was entered by user as a 2D float array
//
// Returns:
// HTML content with result of clasterization
function createClusters(inputTable) {
    // calculating the sums of each column
    const columnSums = calculateTheSumOfColumns(inputTable)
    const displaySumsTable = addLastRowToTable(inputTable, columnSums)

    // normalizing the table
    const dividedTable = divideOnSums(inputTable, columnSums)
    const normalizedTable = normalize(dividedTable)

    // Isotonic
    const isotonicWijColumn = getLastTableColumn(normalizedTable)
    const isotonicDistancesTable = calculateDistances(isotonicWijColumn)
    const isotonicDistanceWithMinimums = addMinimumsToTheDistanceTable(isotonicDistancesTable)
    const isotonicMinimumsColumn = getLastTableColumn(isotonicDistanceWithMinimums)
    const isotonicCriticalDistance = calculateCriticalDistance(isotonicMinimumsColumn)
    const isotonicClusters = calculateClusters(isotonicCriticalDistance, isotonicMinimumsColumn)

    // Isomorphic
    const isomorphicNormalizedTable = normalizeIsomorphic(normalizedTable)
    const isomorphicDistancesTable = calculateIsomorphicDistances(isomorphicNormalizedTable)
    const isomorphicDistanceWithMinimums = addMinimumsToTheDistanceTable(isomorphicDistancesTable)
    const isomorphicMinimumsColumn = getLastTableColumn(isomorphicDistanceWithMinimums)
    const isomorphicCriticalDistance = calculateCriticalDistance(isomorphicMinimumsColumn)
    const isomorphicClusters = calculateClusters(isomorphicCriticalDistance, isomorphicMinimumsColumn)

    return utilCreateResult(
        displaySumsTable, 
        dividedTable, 
        normalizedTable,
        isotonicDistanceWithMinimums,
        isotonicCriticalDistance,
        isotonicClusters,
        isomorphicNormalizedTable,
        isomorphicDistanceWithMinimums,
        isomorphicCriticalDistance,
        isomorphicClusters
    )
}

// This method calculates the sum of each column
//
// Returns:
// array of sums, e.g. [10, 20, 30] for 3 columns with values [0,5,5], [10,5,5], [10,10,10]
function calculateTheSumOfColumns(inputTable) {
    const columnsAmount = inputTable[0].length
    const allColumnsSums = new Array(columnsAmount).fill(0)

    for (let i = 0; i < inputTable.length; i++) {
        for (let j = 0; j < inputTable[i].length; j++) {
            allColumnsSums[j] += inputTable[i][j]
        }
    }

    return allColumnsSums;
}

// Divides the input table by the columns sums. Formula: Vij = Xij / sum (Xij) [1..n]; n - amount of columns. (formula 11)
//
// Returns:
// 2D array (matrix), Vij.
function divideOnSums(inputTable, columnsSums) {
    const dividedTable = []

    for (let i = 0; i < inputTable.length; i++) {
        const row = []

        for (let j = 0; j < inputTable[i].length; j++) {
            const currentTableValue = inputTable[i][j]
            const currentColumnSum = columnsSums[j]

            row.push(currentTableValue / currentColumnSum)
        }

        dividedTable.push(row)
    }

    return dividedTable;
}

// Calculates the sum of divided values and adds it to the last column. Formula: Wij = sum (Vij) [1..m], m -- amount of rows. (formula 12)
//
// Params:
// dividedTable -- the table (2D array) with values divided by column sum
// 
// Returns:
// 2D array with the Wij value in the last column.
function normalize(dividedTable) {
    const normalizedTable = []

    for (let i = 0; i < dividedTable.length; i++) {
        const normalizedRow = [...dividedTable[i]]

        var rowSum = 0
        normalizedRow.forEach(rowValue => {
            rowSum += rowValue
        })

        normalizedRow.push(rowSum)

        normalizedTable.push(normalizedRow)
    }

    return normalizedTable;
}

// Formula 13.
//
// Params:
// normalizedTable -- the table (2D array) with normalized values
// 
// Returns:
// 2D array with the Wij value in the last column.
function normalizeIsomorphic(normalizedTable) {
    return normalizedTable.map((row) => {
        const normalizedRow = [...row]
        const lastValue = normalizedRow.pop() || 1

        return normalizedRow.map((value) => value / lastValue)
    });
}

// Calculates the distances between Wi and Wj. Formula: Dij = abs (Wj - Wj). (formula 13)
//
// Params: 
// WijColumn -- the array of Wij table rows sums values
//
// Returns:
// 2D array of distances (Dij)
function calculateDistances(WijColumn) {
    const distancesTable = []

    for (let i = 0; i < WijColumn.length; i++) {
        const distanceRow = []

        for (let j = 0; j < WijColumn.length; j++) {
            const distance = Math.abs(WijColumn[i] - WijColumn[j])
            distanceRow.push(distance)
        }

        distancesTable.push(distanceRow)
    }

    return distancesTable;
}

// Calculates the distances between Zij and Zkj. (formula 15)
//
// Params: 
// normalizedTable -- the normalized isomorphic table
//
// Returns:
// 2D array of distances (Dik)
function calculateIsomorphicDistances(normalizedTable) {
    const distancesTable = []

    for (let i = 0; i < normalizedTable.length; i++) {
        const distanceRow = []

        for (let j = 0; j < normalizedTable.length; j++) {
            if (j == i) {
                distanceRow.push(0)
            } else {
                var sum = 0
                normalizedTable[i].map((item, k) => Math.pow(item - normalizedTable[j][k], 2)).forEach(item => sum += item)
                distanceRow.push(Math.sqrt(sum))
            }
        }

        distancesTable.push(distanceRow)
    }

    return distancesTable;
}

// Calculates the minimum value of each row and adds it to the last column of given table of distances (formula 13, minimums)
// 
// Params:
// distancesTable -- table of calculated distances
//
// Returns:
// 2D array (table) of distances with the last column of minimums
function addMinimumsToTheDistanceTable(distancesTable) {
    const resultTable = []

    for (let i = 0; i < distancesTable.length; i++) {
        const distancesRow = [...distancesTable[i]]
        const minValue = Math.min(...distancesRow.filter((e) => e > 0))

        distancesRow.push(minValue)
        resultTable.push(distancesRow)
    }

    return resultTable;
}

// Calculates the maximum value of minimums, the critical distance. (formula 13)
// 
// Params:
// minimumsColumn -- array of minimums values
//
// Returns:
// critical distance, the max number of the minimums column
function calculateCriticalDistance(minimumsColumn) {
    const notNullMinimums = minimumsColumn.filter(value => value > 0)
    return Math.max(...notNullMinimums);
};

// Calculates the clusters from the minimums and the critical number
function calculateClusters(criticalDistance, minimums) {
    const differences = minimums.map((distance, index) => ({ object: ("P" + (index + 1)), distance })).sort((first, second) => first.distance - second.distance)
    const firstCluster = differences.filter((object) => object.distance === criticalDistance).map((object) => object.object);
    const secondCluster = differences.filter((object) => object.distance !== criticalDistance).map((object) => object.object);

    return [firstCluster, secondCluster];
}

// Adds the custom last row to the given table
// 
// Params:
// table -- the table where last row should be added
// lastRow -- the given last row that should be added to the table
//
// Returns:
// the "table" 2D array with the "lastRow" row in the end
function addLastRowToTable(table, lastRow) {
    const concatTable = table.map(row => [...row])
    concatTable.push(lastRow)

    return concatTable;
}

// Transforms the table to get only it's last column (e.g. to receive Wij values from the normalized table)
// 
// Params:
// table -- the given table to receive the last column
//
// Returns:
// 2D array that contains only last column 
function getLastTableColumn(table) {
    return table.map((row) => row[row.length - 1]);
}
