function dbConstructor() {
    this.dbConnection = null;
}
var dbCon = openDatabase(DATABASE.NAME, DATABASE.VERSION, DATABASE.DISPLAY_NAME, DATABASE.MAX_SIZE);
function dbAccess() {
    // DB instance constructor
    this.constructor = dbConstructor;
    // Function to get database instance if already exists or create a database instance
    this.getDBConnection = function () {
        if (this.dbConnection === null) {
            this.dbConnection = openDatabase(DATABASE.NAME, DATABASE.VERSION, DATABASE.DISPLAY_NAME, DATABASE.MAX_SIZE);
        }
        return this.dbConnection;
    };
    // Function to execute database query.
    this.execute = function (_query, _parameter) {
//        this.constructor();
        return $.Deferred(function (d) {
            dbCon.transaction(function (tx) {
                tx.executeSql(_query, _parameter, successWrapper(d), failureWrapper(d));
            });
        });
    };
    this.selectALL = function (_tableName, _columnNames) {
        var query = "SELECT " + _columnNames + " FROM " + _tableName;
        this.execute(query, []);
    };
    this.selectWithFilterWhere = function (_tableName, _columnNames, _whereCondition) {
    };
}

/* Database query execute success call back
 * Parameter
 *  d: deferred Object
 * Return Value
 *  resolved sucess Data from ajax call.
 */
function successWrapper(d) {
    return (function (tx, data) {
        d.resolve(data);
    });
}

/* Database query execute error call back
 * Parameter
 *  d: deferred Object
 * Return Value
 *  resolved error Data from ajax call.
 */
function failureWrapper(d) {
    return (function (tx, error) {
        d.reject(error);
    });
}

