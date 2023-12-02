// creates a table from given array.
//
// Params:
// title -- title of the table
// columnTitle -- title of the column, e.g. "Attribute", the columns will be "Attribute1", "Attribute2" etc.
// row -- title of the column, e.g. "P", the columns will be "P1", "P2" etc.
// array -- numeric array of table data
//
// Returns:
// HTML code of the table built on given parameters 
window.utilsCreateTable = function createTable({ title, array, columnTitle = "Attribute", rowTitle = "P", addCustomRow = false, customRowTitle = "", addCustomColumn = false, customColumnTitle = "" }) {
    const rowsAmount = array.length;
    if (rowsAmount < 1) return ""
    const columnsAmount = array[0].length;

    var tableHTML =
        "<table id=\"input_table\" class=\"table table-bordered\">\n" +
        "<thead class=\"thead-light\">\n" +
        "<tr><th colspan=\"100%\" style=\"text-align:center;\">" + title + "</th></tr>\n" +
        "<tr>\n<th></th>\n"

    // Add the columns titles to the table
    for (let i = 0; i < columnsAmount; i++) {
        if (addCustomColumn && i == columnsAmount - 1) {
            tableHTML += "<th>" + customColumnTitle + "</th>\n"
        } else {
            tableHTML += "<th>" + columnTitle + (i + 1) + "</th>\n"
        }
    }

    // Create the body
    tableHTML += "</tr>\n</thead>\n<tbody>\n"

    // Add the rows and columns
    for (let i = 0; i < rowsAmount; i++) {
        if (addCustomRow && i == rowsAmount - 1) {
            tableHTML += "<tr>\n<th>" + customRowTitle + "</th>\n"
        } else {
            tableHTML += "<tr>\n<th>" + rowTitle + (i + 1) + "</th>\n"
        }

        for (let j = 0; j < columnsAmount; j++) {
            tableHTML += "<td>" + Math.ceil(array[i][j] * 10000) / 10000 + "</td>\n"
        }

        tableHTML += "</tr>\n"
    }

    // Close the table
    tableHTML += "</tbody>\n</table>\n"

    return tableHTML
}

// Creates the HTML layout of the calculations
window.utilCreateResult = function (
    displayColumnSumsTable,
    dividedTable,
    normalizedTable,
    isotonicDistanceWithMinimumsTable,
    isotonicCriticalDistance,
    isotonicClusters,
    isomorphicNormalizedTable,
    isomorphicDistanceWithMinimumsTable,
    isomrphicCriticalDistance,
    isomorphicClusters
) {
    var resultHtml = 
            "<h4>Обраховуємо суми колонок:</h4>\n" +
            utilsCreateTable({title: "Вхідна матриця із сумами колонок", array: displayColumnSumsTable, addCustomRow: true, customRowTitle: "Sum(Xij)" }) + 
            "<h4>Ділимо кожен елемент на суму колонки:</h4>\n" + 
            utilsCreateTable({title: "Вхідна матриця поділена на суми колонок", array: dividedTable }) +
            "<h4>Нормалізуємо матрицю:</h4>\n" +
            utilsCreateTable({title: "Нормалізована матриця", array: normalizedTable, addCustomColumn: true, customColumnTitle: "Wij"}) +
            "<hr></hr>" +
            "<h2 style=\"text-align: center;\">Ізотонічна розбивка</h2>\n" +
            "<h4>Обраховуємо відстані та мінімальні значення рядків:</h4>\n" +
            utilsCreateTable({title: "Матриця відстаней", array: isotonicDistanceWithMinimumsTable, columnTitle: "P", addCustomColumn: true, customColumnTitle: "Min Pi"}) + 
            "<h4>Критична відстань R (= Max Min Pi) = " + isotonicCriticalDistance +"</h4>\n" +
            "<h4>Можна виділити наступні кластери:</h4>\n" +
            "<h3>Кластер 1: " + isotonicClusters[0] + "\n" +
            "<h3>Кластер 2: " + isotonicClusters[1] + "\n" +
            "<hr></hr>" +
            "<h2 style=\"text-align: center;\">Ізоморфна розбивка</h2>\n" +
            "<h4>Нормалізуємо матрицю:</h4>\n" +
            utilsCreateTable({title: "Нормалізована матриця (ізоморфна)", array: isomorphicNormalizedTable}) +
            "<h4>Обраховуємо відстані та мінімальні значення рядків:</h4>\n" +
            utilsCreateTable({title: "Матриця відстаней (ізоморфна)", array: isomorphicDistanceWithMinimumsTable, columnTitle: "P", addCustomColumn: true, customColumnTitle: "Min Pi"}) +
            "<h4>Критична відстань R (= Max Min Pi) = " + isomrphicCriticalDistance +"</h4>\n" +
            "<h4>Можна виділити наступні кластери:</h4>\n" +
            "<h3>Кластер 1: " + isomorphicClusters[0] + "\n" +
            "<h3>Кластер 2: " + isomorphicClusters[1] + "\n"



    return resultHtml
}