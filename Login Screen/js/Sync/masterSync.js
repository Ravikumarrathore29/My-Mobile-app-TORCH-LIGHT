
var dbObject = new dbAccess();
var progValue = 0;

var SYNCCONSTANTS = {
    DOCTOR: false,
    CHEMIST: false,
    STOCKIST: false,
    ACTIVITY: false,
    SAMPLE: false,
    PRODUCT: false,
    SPECIALITY: false,
    MARKET: false,
    KEY: false,
    CLASS: false,
    LEAVES: false,
    CATEGORY: false,
    RATING: false,
    KPI: false,
    SALES: false,
    PARAMETER: false,
    CMPAD: false,
    CITY: false,
    RCPACHEMISTDOCMAP: false,
    RCPABRANDCOPETITORMAP: false,
    MARKETI: false,
    WORKEDWITH: false
};

var PALL = "", online = true;

/*
 * Function to check before Parameter sync Daily.
 * Parameters
 * 
 * Return Values
 * 
 */
function CHECKPARAMETER() {
    var selectQuery = "SELECT " + TABLES.PARAMETER.SLNO + " FROM " + TABLES.PARAMETER.TABLE;
    $.when(dbObject.execute(selectQuery, [])).done(function (data) {
        var dataset = data.rows;
        if (dataset.length !== 0) {
            PALL = "ALL";
            getParameters();
        }
    });
}

/*
 * Function to call make the call to get parameters services
 * Parameters
 * 
 * Return Values
 * 
 */

function getParameters() {
    var request;
    if (PALL === "" || PALL === undefined || PALL === null) {
        request = {Employee_id: $.session.get("User_ID"), EffectiveDate: $.session.get("PARAMETER")};
    } else {
        request = {Employee_id: $.session.get("User_ID"), EffectiveDate: $.session.get("PARAMETER"), ALL: PALL};
    }
    var jsondata = JSON.stringify(request);
    var serviceName = "GetParameter";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.PARAMETER = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processParameter(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.PARAMETER.SL_NO + " FROM " + TABLES.PARAMETER.TABLE + " WHERE "
                                + TABLES.PARAMETER.SL_NO + "=?";
                        var selectValues = new Array(item["Slno"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.PARAMETER.TABLE + " ( "
                                        + TABLES.PARAMETER.SL_NO + ","
                                        + TABLES.PARAMETER.PARTICULAR + ","
                                        + TABLES.PARAMETER.DATE + ","
                                        + TABLES.PARAMETER.STATUS + ","
                                        + TABLES.PARAMETER.MONTH + ","
                                        + TABLES.PARAMETER.YEAR + ","
                                        + TABLES.PARAMETER.DAYS
                                        + " ) VALUES (?,?,?,?,?,?,?)";
                                var insertQueryValues = new Array(item["Slno"], item["Particular"], item["ActivityDate"],
                                        item["Status"], item["Month"], item["Year"], item["Days"]);

//                                $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
//                                    if (_index === _length) {
//                                        SYNCCONSTANTS.PARAMETER = true;
//                                        progValue += 4;
//                                        progBar.setValue(progValue);
//                                    }
//                                }).fail(function (error) {
//                                    SYNCCONSTANTS.PARAMETER = false;
//                                    errorMessage(error.message.toString());
//                                });
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.PARAMETER = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.PARAMETER = false;
                                    console.log("line number 116 error " + error.message.toString());
                                    errorMessage(error.message.toString());
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.PARAMETER.TABLE + " SET "
                                        + TABLES.PARAMETER.PARTICULAR + "=?,"
                                        + TABLES.PARAMETER.DATE + "=?,"
                                        + TABLES.PARAMETER.STATUS + "=?,"
                                        + TABLES.PARAMETER.MONTH + "=?,"
                                        + TABLES.PARAMETER.YEAR + "=?,"
                                        + TABLES.PARAMETER.DAYS
                                        + "=? WHERE " + TABLES.PARAMETER.SL_NO + "=?";
                                var updateQueryValues = new Array(item["Particular"], item["ActivityDate"], item["Status"], item["Month"],
                                        item["Year"], item["Days"], item["Slno"]);
//                                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
//                                    if (_index === _length) {
//                                        SYNCCONSTANTS.PARAMETER = true;
//                                        progValue += 4;
//                                        progBar.setValue(progValue);
//                                    }
//                                }).fail(function (error) {
//                                    SYNCCONSTANTS.PARAMETER = false;
//                                    errorMessage(error.message.toString());
//                                });
                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.PARAMETER = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.PARAMETER = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                    CHECKCALLPLAN();
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}

/*
 * Function to process each item of the parameter call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processParameter(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.PARAMETER.SL_NO + " FROM " + TABLES.PARAMETER.TABLE + " WHERE "
            + TABLES.PARAMETER.SL_NO + "=?";
    var selectValues = new Array(_item["Slno"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.PARAMETER.TABLE + " ( "
                    + TABLES.PARAMETER.SL_NO + ","
                    + TABLES.PARAMETER.PARTICULAR + ","
                    + TABLES.PARAMETER.DATE + ","
                    + TABLES.PARAMETER.STATUS + ","
                    + TABLES.PARAMETER.MONTH + ","
                    + TABLES.PARAMETER.YEAR + ","
                    + TABLES.PARAMETER.DAYS
                    + " ) VALUES (?,?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["Slno"], _item["Particular"], _item["ActivityDate"],
                    _item["Status"], _item["Month"], _item["Year"], _item["Days"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.PARAMETER = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.PARAMETER = false;
                console.log("line number 200 error " + error.message.toString());
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.PARAMETER.TABLE + " SET "
                    + TABLES.PARAMETER.PARTICULAR + "=?,"
                    + TABLES.PARAMETER.DATE + "=?,"
                    + TABLES.PARAMETER.STATUS + "=?,"
                    + TABLES.PARAMETER.MONTH + "=?,"
                    + TABLES.PARAMETER.YEAR + "=?,"
                    + TABLES.PARAMETER.DAYS
                    + "=? WHERE " + TABLES.PARAMETER.SL_NO + "=?";
            var updateQueryValues = new Array(_item["Particular"], _item["ActivityDate"], _item["Status"], _item["Month"],
                    _item["Year"], _item["Days"], _item["Slno"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.PARAMETER = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.PARAMETER = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get speciality services
 * Parameters
 * 
 * Return Values
 * 
 */
function getSpeciality() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("SPECIALITY")};
    var jsondata = JSON.stringify(request);
    console.log("GetSpeciality " + jsondata);
    var serviceName = "GetSpeciality";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.SPECIALITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processSpeciality(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.SPECIALITY.SPEC_ID + " FROM "
                                + TABLES.SPECIALITY.TABLE + " WHERE "
                                + TABLES.SPECIALITY.SPEC_ID + "=?";
                        var selectValues = new Array(item["SPECIALITY_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.SPECIALITY.TABLE + " ( "
                                        + TABLES.SPECIALITY.SPEC_ID + ","
                                        + TABLES.SPECIALITY.NAME + ","
                                        + TABLES.SPECIALITY.S_NAME + " ) VALUES (?,?,?)";
                                var insertQueryValues = new Array(item["SPECIALITY_ID"], item["SPECIALITY_NAME"], item["SPECIALITY_CODE"]);
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.SPECIALITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.SPECIALITY.TABLE + " SET "
                                        + TABLES.SPECIALITY.NAME + "=?,"
                                        + TABLES.SPECIALITY.S_NAME
                                        + "=? WHERE " + TABLES.SPECIALITY.SPEC_ID + "=?";
                                var updateQueryValues = new Array(item["SPECIALITY_NAME"], item["SPECIALITY_CODE"], item["SPECIALITY_ID"]);
                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.SPECIALITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}

/*
 * Function to process each item of the speciality call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processSpeciality(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.SPECIALITY.SPEC_ID + " FROM "
            + TABLES.SPECIALITY.TABLE + " WHERE "
            + TABLES.SPECIALITY.SPEC_ID + "=?";
    var selectValues = new Array(_item["SPECIALITY_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.SPECIALITY.TABLE + " ( "
                    + TABLES.SPECIALITY.SPEC_ID + ","
                    + TABLES.SPECIALITY.NAME + ","
                    + TABLES.SPECIALITY.S_NAME + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["SPECIALITY_ID"], _item["SPECIALITY_NAME"], _item["SPECIALITY_CODE"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.SPECIALITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.SPECIALITY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.SPECIALITY.TABLE + " SET "
                    + TABLES.SPECIALITY.NAME + "=?,"
                    + TABLES.SPECIALITY.S_NAME
                    + "=? WHERE " + TABLES.SPECIALITY.SPEC_ID + "=?";
            var updateQueryValues = new Array(_item["SPECIALITY_NAME"], _item["SPECIALITY_CODE"], _item["SPECIALITY_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.SPECIALITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.SPECIALITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get activity services
 * Parameters
 * 
 * Return Values
 * 
 */
function getActivity() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetActivity";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.ACTIVITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processActivity(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + " FROM "
                                + TABLES.ACTIVITY.TABLE + " WHERE "
                                + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + "=?";
                        var selectValues = new Array(item["Activity_Type_ID"]);
                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {


                                var insertQuery = "INSERT INTO " + TABLES.ACTIVITY.TABLE + " ( "
                                        + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + ","
                                        + TABLES.ACTIVITY.ACTIVITY_NAME + " ) VALUES (?,?)";
                                var insertQueryValues = new Array(item["Activity_Type_ID"], item["Activity_Name"]);
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.ACTIVITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });


                            } else {
                                var updateQuery = "UPDATE " + TABLES.ACTIVITY.TABLE + " SET "
                                        + TABLES.ACTIVITY.ACTIVITY_NAME
                                        + "=? WHERE " + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + "=?";
                                var updateQueryValues = new Array(item["Activity_Name"], item["Activity_Type_ID"]);
                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.ACTIVITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Activity call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processActivity(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + " FROM "
            + TABLES.ACTIVITY.TABLE + " WHERE "
            + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + "=?";
    var selectValues = new Array(_item["Activity_Type_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.ACTIVITY.TABLE + " ( "
                    + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + ","
                    + TABLES.ACTIVITY.ACTIVITY_NAME + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["Activity_Type_ID"], _item["Activity_Name"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.ACTIVITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.ACTIVITY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.ACTIVITY.TABLE + " SET "
                    + TABLES.ACTIVITY.ACTIVITY_NAME
                    + "=? WHERE " + TABLES.ACTIVITY.ACTIVITY_TYPE_ID + "=?";
            var updateQueryValues = new Array(_item["Activity_Name"], _item["Activity_Type_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.ACTIVITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.ACTIVITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get City services
 * Parameters
 * 
 * Return Values
 * 
 */
function getCity() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("CITY")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetCityMaster";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.CITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processCity(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.CITY.CITY_ID + " FROM "
                                + TABLES.CITY.TABLE + " WHERE "
                                + TABLES.CITY.CITY_ID + "=?";
                        var selectValues = new Array(item["CITY_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.CITY.TABLE + " ( "
                                        + TABLES.CITY.CITY_ID + ","
                                        + TABLES.CITY.NAME
                                        + " ) VALUES (?,?)";
                                var insertQueryValues = new Array(item["CITY_ID"], item["CITY_NAME"]);
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.CITY = false;
                                    errorMessage(error.message.toString());
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.CITY.TABLE + " SET "
                                        + TABLES.CITY.NAME
                                        + "=? WHERE " + TABLES.CITY.CITY_ID + "=?";
                                var updateQueryValues = new Array(item["CITY_NAME"], item["CITY_ID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.CITY = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the city call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processCity(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CITY.CITY_ID + " FROM "
            + TABLES.CITY.TABLE + " WHERE "
            + TABLES.CITY.CITY_ID + "=?";
    var selectValues = new Array(_item["CITY_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CITY.TABLE + " ( "
                    + TABLES.CITY.CITY_ID + ","
                    + TABLES.CITY.NAME
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["CITY_ID"], _item["CITY_NAME"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.CITY.TABLE + " SET "
                    + TABLES.CITY.NAME
                    + "=? WHERE " + TABLES.CITY.CITY_ID + "=?";
            var updateQueryValues = new Array(_item["CITY_NAME"], _item["CITY_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Secoundary Sales Parameters services
 * Parameters
 * 
 * Return Values
 * 
 */
function getSSParameter() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetSSParameter";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.ACTIVITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processSSParameter(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Secoundary Sales Parameters call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processSSParameter(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.SS_PARAMETER.SS_ENTRY + " FROM "
            + TABLES.SS_PARAMETER.TABLE;
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.SS_PARAMETER.TABLE + " ( "
                    + TABLES.SS_PARAMETER.SS_ENTRY + ","
                    + TABLES.SS_PARAMETER.CS_ENTRY + ","
                    + TABLES.SS_PARAMETER.PR_ENTRY + ","
                    + TABLES.SS_PARAMETER.SR_ENTRY + ","
                    + TABLES.SS_PARAMETER.OS_ENTRY + ","
                    + TABLES.SS_PARAMETER.RT_ENTRY + ","
                    + TABLES.SS_PARAMETER.CUT_OFF_DAY + ","
                    + TABLES.SS_PARAMETER.WARNING_DAY
                    + " ) VALUES (?,?,?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["SS_entry"], _item["CS_Entry"], _item["PR_Entry"], _item["SR_Entry"],
                    _item["OS_Entry"], _item["Receipt_entry"], _item["cutoffday"], _item["warning_day"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.SS_PARAMETER.TABLE + " SET "
                    + TABLES.SS_PARAMETER.SS_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.CS_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.PR_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.SR_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.OS_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.RT_ENTRY + "=?,"
                    + TABLES.SS_PARAMETER.CUT_OFF_DAY
                    + "=?, " + TABLES.SS_PARAMETER.WARNING_DAY + "=?";
            var updateQueryValues = new Array(_item["SS_entry"], _item["CS_Entry"], _item["PR_Entry"],
                    _item["SR_Entry"], _item["OS_Entry"], _item["Receipt_entry"], _item["cutoffday"], _item["warning_day"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get samples services
 * Parameters
 * 
 * Return Values
 * 
 */
function getSamples() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("SAMPLE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "spGetProduct";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.SAMPLE = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processSamples(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.SAMPLES.SAMPLE_ID + " FROM "
                                + TABLES.SAMPLES.TABLE + " WHERE "
                                + TABLES.SAMPLES.SAMPLE_ID + "=?";
                        var selectValues = new Array(item["PRODUCT_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.SAMPLES.TABLE + " ( "
                                        + TABLES.SAMPLES.SAMPLE_ID + ","
                                        + TABLES.SAMPLES.SAMPLE_NAME + ","
                                        + TABLES.SAMPLES.PRODUCT_GROUP_ID + ","
                                        + TABLES.SAMPLES.UNIT_OF_MEASURE + ","
                                        + TABLES.SAMPLES.PRODUCT_TYPE_ID + ","
                                        + TABLES.SAMPLES.RATE + " ) VALUES (?,?,?,?,?,?)";
                                var insertQueryValues = new Array(item["PRODUCT_ID"], item["PRODUCTNAME"],
                                        item["PRODUCTGROUP_ID"], item["UNITOFMEASURE"], item["PRODUCTTYPE_ID"], item["RATE"]);



                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.SAMPLE = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.SAMPLE = false;
                                    errorMessage(error.message.toString());
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.SAMPLES.TABLE + " SET "
                                        + TABLES.SAMPLES.SAMPLE_NAME + "=?,"
                                        + TABLES.SAMPLES.PRODUCT_GROUP_ID + "=?,"
                                        + TABLES.SAMPLES.UNIT_OF_MEASURE + "=?,"
                                        + TABLES.SAMPLES.RATE
                                        + "=? WHERE " + TABLES.SAMPLES.SAMPLE_ID + "=?";
                                var updateQueryValues = new Array(item["PRODUCTNAME"], item["PRODUCTGROUP_ID"],
                                        item["UNITOFMEASURE"], item["RATE"], item["PRODUCT_ID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.SAMPLE = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.SAMPLE = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the samples call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processSample(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.SAMPLES.SAMPLE_ID + " FROM "
            + TABLES.SAMPLES.TABLE + " WHERE "
            + TABLES.SAMPLES.SAMPLE_ID + "=?";
    var selectValues = new Array(_item["PRODUCT_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.SAMPLES.TABLE + " ( "
                    + TABLES.SAMPLES.SAMPLE_ID + ","
                    + TABLES.SAMPLES.SAMPLE_NAME + ","
                    + TABLES.SAMPLES.PRODUCT_GROUP_ID + ","
                    + TABLES.SAMPLES.UNIT_OF_MEASURE + ","
                    + TABLES.SAMPLES.PRODUCT_TYPE_ID + ","
                    + TABLES.SAMPLES.RATE + " ) VALUES (?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["PRODUCT_ID"], _item["PRODUCTNAME"],
                    _item["PRODUCTGROUP_ID"], _item["UNITOFMEASURE"], _item["PRODUCTTYPE_ID"], _item["RATE"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.SAMPLE = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.SAMPLE = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.SAMPLES.TABLE + " SET "
                    + TABLES.SAMPLES.SAMPLE_NAME + "=?,"
                    + TABLES.SAMPLES.PRODUCT_GROUP_ID + "=?,"
                    + TABLES.SAMPLES.UNIT_OF_MEASURE + "=?,"
                    + TABLES.SAMPLES.RATE
                    + "=? WHERE " + TABLES.SAMPLES.SAMPLE_ID + "=?";
            var updateQueryValues = new Array(_item["PRODUCTNAME"], _item["PRODUCTGROUP_ID"],
                    _item["UNITOFMEASURE"], _item["RATE"], _item["PRODUCT_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.SAMPLE = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.SAMPLE = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Campaign Planning List services
 * Parameters
 * 
 * Return Values
 * 
 */

function getCampaignPlanningList() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetCampaignPlanningList";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.ACTIVITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processCampaignPlanningList(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Campaign Planning List call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processCampaignPlanningList(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CAMPAIGNPLAN.CAMPAIGN_ID + " FROM "
            + TABLES.CAMPAIGNPLAN.TABLE + " WHERE "
            + TABLES.CAMPAIGNPLAN.CAMPAIGN_ID + "=? and "
            + TABLES.CAMPAIGNPLAN.CHEMIST_ID + "=? and "
            + TABLES.CAMPAIGNPLAN.DOCTOR_SL_NO + "=?";
    var selectValues = new Array(_item["CAMPAIGN_ID"], _item["CHEMIST_ID"], _item["DOCTOR_SL_NO"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CAMPAIGNPLAN.TABLE + " ( "
                    + TABLES.CAMPAIGNPLAN.CAMPAIGN_ID + ","
                    + TABLES.CAMPAIGNPLAN.NAME + ","
                    + TABLES.CAMPAIGNPLAN.STATUS_CODE + ","
                    + TABLES.CAMPAIGNPLAN.FROM_DATE + ","
                    + TABLES.CAMPAIGNPLAN.TO_DATE + ","
                    + TABLES.CAMPAIGNPLAN.CHEMIST_ID + ","
                    + TABLES.CAMPAIGNPLAN.DOCTOR_SL_NO
                    + " ) VALUES (?,?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["CAMPAIGN_ID"], _item["NAME"], _item["STATUS_CODE"],
                    _item["FROMDATE"], _item["TODATE"], _item["CHEMIST_ID"], _item["DOCTOR_SL_NO"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.CAMPAIGNPLAN.TABLE + " SET "
                    + TABLES.CAMPAIGNPLAN.NAME + "=?,"
                    + TABLES.CAMPAIGNPLAN.STATUS_CODE + "=?,"
                    + TABLES.CAMPAIGNPLAN.FROM_DATE + "=?,"
                    + TABLES.CAMPAIGNPLAN.TO_DATE + "=?,"
                    + TABLES.CAMPAIGNPLAN.CHEMIST_ID + "=?,"
                    + TABLES.CAMPAIGNPLAN.DOCTOR_SL_NO
                    + "=? WHERE " + TABLES.CAMPAIGNPLAN.CAMPAIGN_ID + "=?";
            var updateQueryValues = new Array(_item["NAME"], _item["STATUS_CODE"], _item["FROMDATE"],
                    _item["TODATE"], _item["CHEMIST_ID"], _item["DOCTOR_SL_NO"], _item["CAMPAIGN_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Closing Stock services
 * Parameters
 * 
 * Return Values
 * 
 */

function getClosingStock() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetClosingStock";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.ACTIVITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processClosingStock(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Closing Stock call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processClosingStock(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.SSCLOSINGSTOCK.STOCKIST_ID + " FROM "
            + TABLES.SSCLOSINGSTOCK.TABLE + " WHERE "
            + TABLES.SSCLOSINGSTOCK.STOCKIST_ID + "=? and "
            + TABLES.SSCLOSINGSTOCK.MONTH + "=? and "
            + TABLES.SSCLOSINGSTOCK.YEAR + "=? and "
            + TABLES.SSCLOSINGSTOCK.PRODUCT_ID + "=?";

    var selectValues = new Array(_item["AW_ID"], _item["Month"], _item["Year"], _item["Product_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.SSCLOSINGSTOCK.TABLE + " ( "
                    + TABLES.SSCLOSINGSTOCK.STOCKIST_ID + ","
                    + TABLES.SSCLOSINGSTOCK.MONTH + ","
                    + TABLES.SSCLOSINGSTOCK.YEAR + ","
                    + TABLES.SSCLOSINGSTOCK.PRODUCT_ID + ","
                    + TABLES.SSCLOSINGSTOCK.CLOSING_STOCK
                    + " ) VALUES (?,?,?,?,?)";
            var insertQueryValues = new Array(_item["AW_ID"], _item["Month"], _item["Year"], _item["Product_ID"], _item["Closing_stock"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                console.log("line number 1038 error " + error.message.toString());
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.SSCLOSINGSTOCK.TABLE + " SET "
                    + TABLES.SSCLOSINGSTOCK.MONTH + "=?,"
                    + TABLES.SSCLOSINGSTOCK.YEAR + "=?,"
                    + TABLES.SSCLOSINGSTOCK.PRODUCT_ID + "=?,"
                    + TABLES.SSCLOSINGSTOCK.CLOSING_STOCK
                    + "=? WHERE " + TABLES.SSCLOSINGSTOCK.STOCKIST_ID + "=?";
            var updateQueryValues = new Array(_item["Month"], _item["Year"], _item["Product_ID"], _item["Closing_stock"], _item["AW_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Secondary Sales Last Entry services
 * Parameters
 * 
 * Return Values
 * 
 */

function getSecondarySalesLastEntry() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetSecondarySalesLastEntry";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.ACTIVITY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processSecondarySalesLastEntry(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Secondary Sales Last Entry call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processSecondarySalesLastEntry(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.SECONDARSALESLAST.ID + " FROM "
            + TABLES.SECONDARSALESLAST.TABLE + " WHERE "
            + TABLES.SECONDARSALESLAST.ID + "=?";
    var selectValues = new Array(_item["STOCKIST_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.SECONDARSALESLAST.TABLE + " ( "
                    + TABLES.SECONDARSALESLAST.ID + ","
                    + TABLES.SECONDARSALESLAST.MONTH + ","
                    + TABLES.SECONDARSALESLAST.YEAR
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["STOCKIST_ID"], _item["Month"], _item["Year"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                console.log("line number 1131 error " + error.message.toString());
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.SECONDARSALESLAST.TABLE + " SET "
                    + TABLES.SECONDARSALESLAST.MONTH + "=?,"
                    + TABLES.SECONDARSALESLAST.YEAR
                    + "=? WHERE " + TABLES.SECONDARSALESLAST.ID + "=?";
            var updateQueryValues = new Array(_item["Month"], _item["Year"], _item["STOCKIST_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.CITY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.CITY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Key Message services
 * Parameters
 * 
 * Return Values
 * 
 */

function getKeyMessage() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "spGetKeyMessage";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.KEY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processKeyMessage(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.KEY_MSG.KEY_ID + " FROM "
                                + TABLES.KEY_MSG.TABLE + " WHERE "
                                + TABLES.KEY_MSG.KEY_ID + "=?";
                        var selectValues = new Array(item["Key_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.KEY_MSG.TABLE + " ( "
                                        + TABLES.KEY_MSG.KEY_ID + ","
                                        + TABLES.KEY_MSG.BRAND_ID + ","
                                        + TABLES.KEY_MSG.KEY_CODE
                                        + " ) VALUES (?,?,?)";
                                var insertQueryValues = new Array(item["Key_ID"], item["Brand_ID"], item["KeyMessage"]);


                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.KEY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.KEY = false;
                                    errorMessage(error.message.toString());
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.KEY_MSG.TABLE + " SET "
                                        + TABLES.KEY_MSG.BRAND_ID + "=?,"
                                        + TABLES.KEY_MSG.KEY_CODE
                                        + "=? WHERE " + TABLES.KEY_MSG.KEY_ID + "=?";
                                var updateQueryValues = new Array(item["Brand_ID"], item["KeyMessage"], item["Key_ID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.KEY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.KEY = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Key Message call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processKeyMessage(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.KEY_MSG.KEY_ID + " FROM "
            + TABLES.KEY_MSG.TABLE + " WHERE "
            + TABLES.KEY_MSG.KEY_ID + "=?";
    var selectValues = new Array(_item["Key_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.KEY_MSG.TABLE + " ( "
                    + TABLES.KEY_MSG.KEY_ID + ","
                    + TABLES.KEY_MSG.BRAND_ID + ","
                    + TABLES.KEY_MSG.KEY_CODE
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["Key_ID"], _item["Brand_ID"], _item["KeyMessage"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.KEY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.KEY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.KEY_MSG.TABLE + " SET "
                    + TABLES.KEY_MSG.BRAND_ID + "=?,"
                    + TABLES.KEY_MSG.KEY_CODE
                    + "=? WHERE " + TABLES.KEY_MSG.KEY_ID + "=?";
            var updateQueryValues = new Array(_item["Brand_ID"], _item["KeyCode"], _item["Key_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.KEY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.KEY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}



/*
 * Function to call make the call to get DCR Doctor Details services
 * Parameters
 * 
 * Return Values
 * 
 */

function getDCRDoctorDetails() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetDCRDoctorDetails";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            console.log("getDCRDoctorDetails = " + _data);
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.DOCTOR = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                //console.log("getDCRDoctorDetails = " + JSON.stringify(jsonData));
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processCity(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + " FROM "
                                + TABLES.DOCTOR_INFO.TABLE + " WHERE "
                                + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + " =?";
                        var selectValues = new Array(item["DOCTOR_SL_NO"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.DOCTOR_INFO.TABLE + " ( "
                                        + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + ","
                                        + TABLES.DOCTOR_INFO.REGISTRATION_NO + ","
                                        + TABLES.DOCTOR_INFO.NAME + ","
                                        + TABLES.DOCTOR_INFO.CLASSIFICATION + ","
                                        + TABLES.DOCTOR_INFO.MOBILE_NO + ","
                                        + TABLES.DOCTOR_INFO.SPECIALITY_ID + ","
                                        + TABLES.DOCTOR_INFO.MARKET_AREA_ID + ","
                                        + TABLES.DOCTOR_INFO.LATITUDE + ","
                                        + TABLES.DOCTOR_INFO.LONGITUDE
                                        + " ) VALUES (?,?,?,?,?,?,?,?,?)";
                                var lati = (Math.random() * (0.5) + 12.5);
                                var longi = (Math.random() + 77);
                                var lat = lati.toFixed(6);
                                var long = longi.toFixed(6);
                                var insertQueryValues = new Array(item["DOCTOR_SL_NO"], item["REGISTRATION_NO"], item["Name"],
                                        item["classification"], item["MOBILE_NO"], item["SPECIALITY_NAME"],
                                        item["MARKETAREA_ID"], lat, longi);

                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);

                                    }
                                    //this function is given temporary , when all doctor location is confirmed/ fiexd from data base then remove this 

                                }, function (tx, error) {
                                    SYNCCONSTANTS.CITY = false;
                                    console.log ("getDCRDoctorDetails ="+ errorMessage(error.message.toString()));
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.DOCTOR_INFO.TABLE + " SET "
                                        + TABLES.DOCTOR_INFO.REGISTRATION_NO + "=?,"
                                        + TABLES.DOCTOR_INFO.NAME + "=?,"
                                        + TABLES.DOCTOR_INFO.CLASSIFICATION + "=?,"
                                        + TABLES.DOCTOR_INFO.MOBILE_NO + "=?,"
                                        + TABLES.DOCTOR_INFO.SPECIALITY_ID + "=?,"
                                        + TABLES.DOCTOR_INFO.MARKET_AREA_ID
                                        + "=? WHERE " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + "=?";
                                var updateQueryValues = new Array(item["REGISTRATION_NO"], item["Name"], item["classification"],
                                        item["MOBILE_NO"], item["SPECIALITY_NAME"], item["MARKETAREA_ID"], item["DOCTOR_SL_NO"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CITY = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.CITY = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {
                            console.log(error);
                        });
                    });
                });
            }
        }).fail(function (error) {
            console.log(error)
        });
    }
}

/*
 * Function to process each item of the DCR Doctor Details call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processDCRDoctorDetails(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + " FROM "
            + TABLES.DOCTOR_INFO.TABLE + " WHERE "
            + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + "=?";
    var selectValues = new Array(_item["DOCTOR_SL_NO"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.DOCTOR_INFO.TABLE + " ( "
                    + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + ","
                    + TABLES.DOCTOR_INFO.REGISTRATION_NO + ","
                    + TABLES.DOCTOR_INFO.NAME + ","
                    + TABLES.DOCTOR_INFO.CLASSIFICATION + ","
                    + TABLES.DOCTOR_INFO.MOBILE_NO + ","
                    + TABLES.DOCTOR_INFO.SPECIALITY_ID + ","
                    + TABLES.DOCTOR_INFO.MARKET_AREA_ID
                    + " ) VALUES (?,?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["DOCTOR_SL_NO"], _item["REGISTRATION_NO"], _item["Name"],
                    _item["classification"], _item["MOBILE_NO"], _item["SPECIALITY_NAME"],
                    _item["MARKETAREA_ID"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.DOCTOR = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.DOCTOR = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.DOCTOR_INFO.TABLE + " SET "
                    + TABLES.DOCTOR_INFO.REGISTRATION_NO + "=?,"
                    + TABLES.DOCTOR_INFO.NAME + "=?,"
                    + TABLES.DOCTOR_INFO.CLASSIFICATION + "=?,"
                    + TABLES.DOCTOR_INFO.MOBILE_NO + "=?,"
                    + TABLES.DOCTOR_INFO.SPECIALITY_ID + "=?,"
                    + TABLES.DOCTOR_INFO.MARKET_AREA_ID
                    + "=? WHERE " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + "=?";
            var updateQueryValues = new Array(_item["REGISTRATION_NO"], _item["Name"], _item["classification"],
                    _item["MOBILE_NO"], _item["SPECIALITY_NAME"], _item["MARKETAREA_ID"], _item["DOCTOR_SL_NO"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.DOCTOR = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.DOCTOR = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}


/*
 * Function to call make the call to get DCR Chemist Details services
 * Parameters
 * 
 * Return Values
 * 
 */

function getDCRChemistDetails() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetDCRChemistDetails";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.CHEMIST = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processDCRChemistDetails(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.CHEMISTS.CHEMIST_ID + " FROM "
                                + TABLES.CHEMISTS.TABLE + " WHERE "
                                + TABLES.CHEMISTS.CHEMIST_ID + "=?";
                        var selectValues = new Array(item["CHEMIST_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.CHEMISTS.TABLE + " ( "
                                        + TABLES.CHEMISTS.CHEMIST_ID + ","
                                        + TABLES.CHEMISTS.NAME + ","
                                        + TABLES.CHEMISTS.MARKET_AREA_ID + ","
                                        + TABLES.CHEMISTS.PHONE + ","
                                        + TABLES.CHEMISTS.LATITUDE + ","
                                        + TABLES.CHEMISTS.LONGITUDE
                                        + " ) VALUES (?,?,?,?,?,?)";
                                var lati = (Math.random() * (0.5) + 12.5);
                                var longi = (Math.random() + 77);
                                var lat = lati.toFixed(6);
                                var long = longi.toFixed(6);

                                var insertQueryValues = new Array(item["CHEMIST_ID"], item["NAME"], item["MARKETAREA_ID"], item["PHONE1"], lat, longi);
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CHEMIST = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.CHEMIST = false;
                                  console.log( "getDCRChemistDetails = "+ errorMessage(error.message.toString())) ;
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.CHEMISTS.TABLE + " SET "
                                        + TABLES.CHEMISTS.NAME + "=?,"
                                        + TABLES.CHEMISTS.MARKET_AREA_ID + "=?,"
                                        + TABLES.CHEMISTS.PHONE
                                        + "=? WHERE " + TABLES.CHEMISTS.CHEMIST_ID + "=?";
                                var updateQueryValues = new Array(item["NAME"], item["MARKETAREA_ID"], item["PHONE1"], item["CHEMIST_ID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.CHEMIST = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.CHEMIST = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the DCR Chemist Details call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processDCRChemistDetails(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CHEMISTS.CHEMIST_ID + " FROM "
            + TABLES.CHEMISTS.TABLE + " WHERE "
            + TABLES.CHEMISTS.CHEMIST_ID + "=?";
    var selectValues = new Array(_item["CHEMIST_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CHEMISTS.TABLE + " ( "
                    + TABLES.CHEMISTS.CHEMIST_ID + ","
                    + TABLES.CHEMISTS.NAME + ","
                    + TABLES.CHEMISTS.MARKET_AREA_ID + ","
                    + TABLES.CHEMISTS.PHONE
                    + " ) VALUES (?,?,?,?)";
            var insertQueryValues = new Array(_item["CHEMIST_ID"], _item["NAME"], _item["MARKETAREA_ID"], _item["PHONE1"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CHEMIST = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CHEMIST = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.CHEMISTS.TABLE + " SET "
                    + TABLES.CHEMISTS.NAME + "=?,"
                    + TABLES.CHEMISTS.MARKET_AREA_ID + "=?,"
                    + TABLES.CHEMISTS.PHONE
                    + "=? WHERE " + TABLES.CHEMISTS.CHEMIST_ID + "=?";
            var updateQueryValues = new Array(_item["NAME"], _item["MARKETAREA_ID"], _item["PHONE1"], _item["CHEMIST_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CHEMIST = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CHEMIST = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get DCR Stockist Details services
 * Parameters
 * 
 * Return Values
 * 
 */

function getDCRStockistDetails() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetDCRStockistDetails";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.STOCKIST = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processDCRStockistDetails(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the DCR Stockist Details call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processDCRStockistDetails(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.STOCKIST.STOCKIST_ID + " FROM "
            + TABLES.STOCKIST.TABLE + " WHERE "
            + TABLES.STOCKIST.STOCKIST_ID + "=?";
    var selectValues = new Array(_item["STOCKIST_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.STOCKIST.TABLE + " ( "
                    + TABLES.STOCKIST.STOCKIST_ID + ","
                    + TABLES.STOCKIST.NAME + ","
                    + TABLES.STOCKIST.MARKET_AREA_ID + ","
                    + TABLES.STOCKIST.PHONE + ","
                    + TABLES.STOCKIST.CODE + ","
                    + TABLES.STOCKIST.CITY + ","
                    + TABLES.STOCKIST.LATITUDE + ","
                    + TABLES.STOCKIST.LONGITUDE 
                    + " ) VALUES (?,?,?,?,?,?,?,?)";
            var lati = (Math.random() * (0.5) + 12.5);
            var longi = (Math.random() + 77);
            var lat = lati.toFixed(6);
            var long = longi.toFixed(6);
            var insertQueryValues = new Array(_item["STOCKIST_ID"], _item["NAME"], _item["MARKETAREA_ID"],
                    _item["Phone"], _item["Stockist_Code"], _item["City_ID"], lat, longi);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.STOCKIST = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.STOCKIST = false;
               console.log(" processDCRStockistDetails  " + errorMessage(error.message.toString())) ;
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.STOCKIST.TABLE + " SET "
                    + TABLES.STOCKIST.NAME + "=?,"
                    + TABLES.STOCKIST.MARKET_AREA_ID + "=?,"
                    + TABLES.STOCKIST.PHONE + "=?,"
                    + TABLES.STOCKIST.CODE + "=?,"
                    + TABLES.STOCKIST.CITY
                    + "=? WHERE " + TABLES.STOCKIST.STOCKIST_ID + "=?";
            var updateQueryValues = new Array(_item["NAME"], _item["MARKETAREA_ID"], _item["Phone"],
                    _item["Stockist_Code"], _item["City_ID"], _item["STOCKIST_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.STOCKIST = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.STOCKIST = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Market Area services
 * Parameters
 * 
 * Return Values
 * 
 */

function getMarketArea() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MARKET")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetMarketarea";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.MARKET = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                     processMarketArea(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.MARKET_AREA.MARKET_AREA_ID + " FROM "
                                + TABLES.MARKET_AREA.TABLE + " WHERE "
                                + TABLES.MARKET_AREA.MARKET_AREA_ID + "=?";
                        var selectValues = new Array(item["MARKETAREA_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.MARKET_AREA.TABLE + " ( "
                                        + TABLES.MARKET_AREA.MARKET_AREA_ID + ","
                                        + TABLES.MARKET_AREA.MARKET_AREA
                                        + " ) VALUES (?,?)";
                                var insertQueryValues = new Array(item["MARKETAREA_ID"], item["MARKETAREA"]);
                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.MARKET = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });
                            } else {

                                var updateQuery = "UPDATE " + TABLES.MARKET_AREA.TABLE + " SET "
                                        + TABLES.MARKET_AREA.MARKET_AREA + "=?,"
                                        + "=? WHERE " + TABLES.MARKET_AREA.MARKET_AREA_ID + "=?";
                                var updateQueryValues = new Array(item["MARKETAREA"], item["MARKETAREA_ID"]);
                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.MARKET = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Market Area call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processMarketArea(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.MARKET_AREA.MARKET_AREA_ID + " FROM "
            + TABLES.MARKET_AREA.TABLE + " WHERE "
            + TABLES.MARKET_AREA.MARKET_AREA_ID + "=?";
    var selectValues = new Array(_item["MARKETAREA_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.MARKET_AREA.TABLE + " ( "
                    + TABLES.MARKET_AREA.MARKET_AREA_ID + ","
                    + TABLES.MARKET_AREA.MARKET_AREA + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["MARKETAREA_ID"], _item["MARKETAREA"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.MARKET = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.MARKET = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.MARKET_AREA.TABLE + " SET "
                    + TABLES.MARKET_AREA.MARKET_AREA
                    + "=? WHERE " + TABLES.MARKET_AREA.MARKET_AREA_ID + "=?";
            var updateQueryValues = new Array(_item["MARKETAREA"], _item["MARKETAREA_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.MARKET = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.MARKET = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Product Group services
 * Parameters
 * 
 * Return Values
 * 
 */

function getProductGroup() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MARKET")};
    var jsondata = JSON.stringify(request);
    var serviceName = "spGetProductGroup";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.PRODUCT = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                     processMarketArea(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + " FROM "
                                + TABLES.PRODUCTGROUPS.TABLE + " WHERE "
                                + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=?";
                        var selectValues = new Array(item["PRODUCTGROUP_ID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.PRODUCTGROUPS.TABLE + " ( "
                                        + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + ","
                                        + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME
                                        + " ) VALUES (?,?)";
                                var insertQueryValues = new Array(item["PRODUCTGROUP_ID"], item["PRODUCTGROUPNAME"]);

                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.PRODUCT = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.PRODUCT = false;
                                    errorMessage(error.message.toString());
                                });
                            } else {

                                var updateQuery = "UPDATE " + TABLES.PRODUCTGROUPS.TABLE + " SET " +
                                        TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME
                                        + "=? WHERE " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=?";
                                var updateQueryValues = new Array(item["PRODUCTGROUPNAME"], item["PRODUCTGROUP_ID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.PRODUCT = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.PRODUCT = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Product Group call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processProductGroup(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + " FROM "
            + TABLES.PRODUCTGROUPS.TABLE + " WHERE "
            + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=?";
    var selectValues = new Array(_item["PRODUCTGROUP_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.PRODUCTGROUPS.TABLE + " ( "
                    + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + ","
                    + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["PRODUCTGROUP_ID"], _item["PRODUCTGROUPNAME"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.PRODUCT = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.PRODUCT = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.PRODUCTGROUPS.TABLE + " SET " +
                    TABLES.PRODUCT_GROUP_NAME
                    + "=? WHERE " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=?";
            var updateQueryValues = new Array(_item["PRODUCTGROUPNAME"], _item["PRODUCTGROUP_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.PRODUCT = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.PRODUCT = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Classification services
 * Parameters
 * 
 * Return Values
 * 
 */
function getClassification() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MARKET")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetClassification";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.CLASS = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processClassification(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Classification call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processClassification(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CLASS.CLASS_ID + " FROM "
            + TABLES.CLASS.TABLE + " WHERE "
            + TABLES.CLASS.CLASS_ID + "=?";
    var selectValues = new Array(_item["Classification_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CLASS.TABLE + " ( "
                    + TABLES.CLASS.CLASS_ID + ","
                    + TABLES.CLASS.NAME + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["Classification_ID"], _item["Classification_Name"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CLASS = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CLASS = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.CLASS.TABLE + " SET "
                    + TABLES.CLASS.NAME
                    + "=? WHERE " + TABLES.CLASS.CLASS_ID + "=?";
            var updateQueryValues = new Array(_item["Classification_Name"], _item["Classification_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CLASS = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CLASS = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Objection services
 * Parameters
 * 
 * Return Values
 * 
 */
function getObjection() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MARKET")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetObjection";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.CATEGORY = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processObjection(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Objection call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processObjection(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CATEGORY.CATEGORY_ID + " FROM "
            + TABLES.CATEGORY.TABLE + " WHERE "
            + TABLES.CATEGORY.CATEGORY_ID + "=?";
    var selectValues = new Array(_item["ObjectionCategoryID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CATEGORY.TABLE + " ( "
                    + TABLES.CATEGORY.CATEGORY_ID + ","
                    + TABLES.CATEGORY.CATEGORY_NAME
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["ObjectionCategoryID"], _item["ObjectionCategory"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CATEGORY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CATEGORY = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.CATEGORY.TABLE + " SET "
                    + TABLES.CATEGORY.CATEGORY_NAME
                    + "=? WHERE " + TABLES.CATEGORY.CATEGORY_ID + "=?";
            var updateQueryValues = new Array(_item["ObjectionCategory"], _item["ObjectionCategoryID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CATEGORY = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CATEGORY = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}


/*
 * Function to call make the call to get Rating services
 * Parameters
 * 
 * Return Values
 * 
 */
function getRating() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MARKET")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetRate";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.RATING = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processRating(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Rating call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processRating(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.RATING.RATING_ID + " FROM "
            + TABLES.RATING.TABLE + " WHERE "
            + TABLES.RATING.RATING_ID + "=?";
    var selectValues = new Array(_item["RateCallID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.RATING.TABLE + " ( "
                    + TABLES.RATING.RATING_ID + ","
                    + TABLES.RATING.RATING_NAME
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["RateCallID"], _item["RateCall"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RATING = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RATING = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.RATING.TABLE + " SET "
                    + TABLES.RATING.RATING_NAME
                    + "=? WHERE " + TABLES.RATING.RATING_ID + "=?";
            var updateQueryValues = new Array(_item["RateCall"], _item["RateCallID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RATING = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RATING = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Communication Pad services
 * Parameters
 * 
 * Return Values
 * 
 */
function getCommunicationPad() {
    var edate = $.session.get("CMPAD");
    if (edate == "" || edate == undefined || edate == null)
    {
        edate = ConvertIT(new Date());
    }
    var request = {Employee_id: $.session.get("User_ID"), EffectiveDate: edate};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetCommunicationPad";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.CMPAD = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processCommunicationPad(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Communication Pad call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processCommunicationPad(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.COMMUNICATION_PAD.COMMUNICATION_ID + " FROM "
            + TABLES.COMMUNICATION_PAD.TABLE + " WHERE "
            + TABLES.COMMUNICATION_PAD.COMMUNICATION_ID + "=?";
    var selectValues = new Array(_item["COMMUNICATION_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.COMMUNICATION_PAD.TABLE + " ( "
                    + TABLES.COMMUNICATION_PAD.COMMUNICATION_ID + ","
                    + TABLES.COMMUNICATION_PAD.MESSAGE_SENT_BY + ","
                    + TABLES.COMMUNICATION_PAD.VALID_FROM + ","
                    + TABLES.COMMUNICATION_PAD.VALID_TO + ","
                    + TABLES.COMMUNICATION_PAD.MESSAGE + ","
                    + TABLES.COMMUNICATION_PAD.CREATED_DATE
                    + " ) VALUES (?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["COMMUNICATION_ID"], _item["MessageSentBy"], _item["VALIDFROM"],
                    _item["VALIDTO"], _item["message"], _item["created_date"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CMPAD = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CMPAD = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.COMMUNICATION_PAD.TABLE + " SET "
                    + TABLES.COMMUNICATION_PAD.MESSAGE_SENT_BY + "=?,"
                    + TABLES.COMMUNICATION_PAD.VALID_FROM + "=?,"
                    + TABLES.COMMUNICATION_PAD.VALID_TO + "=?,"
                    + TABLES.COMMUNICATION_PAD.MESSAGE + "=?,"
                    + TABLES.COMMUNICATION_PAD.CREATED_DATE
                    + "=? WHERE " + TABLES.COMMUNICATION_PAD.COMMUNICATION_ID + "=?";
            var updateQueryValues = new Array(_item["MessageSentBy"], _item["VALIDFROM"], _item["VALIDTO"],
                    _item["message"], _item["created_date"], _item["COMMUNICAT0ION_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.CMPAD = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.CMPAD = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Chemist Doctor Map services
 * Parameters
 * 
 * Return Values
 * 
 */
function getChemistDoctorMap() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("CHEMISTDOCTORMAP")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetChemistDoctorMap";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.RCPACHEMISTDOCMAP = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                dbCon.transaction(function (tx) {
                    $.each(jsonData, function (index, item) {
//                    processChemistDoctorMap(item, index, (jsonData.length - 1));
                        var selectQuery = "SELECT " + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + " FROM "
                                + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " WHERE "
                                + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + "=?";
                        var selectValues = new Array(item["CHEMISTID"]);

                        tx.executeSql(selectQuery, selectValues, function (tx, result) {
                            var resultSetLength = result.rows.length;
                            if (resultSetLength === 0) {
                                var insertQuery = "INSERT INTO " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " ( "
                                        + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + ","
                                        + TABLES.RCPA_CHEMISTDOCTORMAP.DOCTOR_SL_NO
                                        + " ) VALUES (?,?)";
                                var insertQueryValues = new Array(item["CHEMISTID"], item["DOCTORID"]);


                                tx.executeSql(insertQuery, insertQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.RCPACHEMISTDOCMAP = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.RCPACHEMISTDOCMAP = false;
                                    errorMessage(error.message.toString());
                                });
                            } else {
                                var updateQuery = "UPDATE " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " SET "
                                        + TABLES.RCPA_CHEMISTDOCTORMAP.DOCTOR_SL_NO
                                        + "=? WHERE " + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + "=?";
                                var updateQueryValues = new Array(item["DOCTORID"], item["CHEMISTID"]);

                                tx.executeSql(updateQuery, updateQueryValues, function (tx, result) {
                                    if (index === (jsonData.length - 1)) {
                                        SYNCCONSTANTS.RCPACHEMISTDOCMAP = true;
                                        progValue += 4;
                                        progBar.setValue(progValue);
                                    }
                                }, function (tx, error) {
                                    SYNCCONSTANTS.RCPACHEMISTDOCMAP = false;
                                    errorMessage(error.message.toString());
                                });
                            }
                        }, function (tx, error) {

                        });
                    });
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Chemist Doctor Map call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processChemistDoctorMap(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + " FROM "
            + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " WHERE "
            + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + "=?";
    var selectValues = new Array(_item["CHEMISTID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " ( "
                    + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + ","
                    + TABLES.RCPA_CHEMISTDOCTORMAP.DOCTOR_SL_NO
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["CHEMISTID"], _item["DOCTORID"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RCPACHEMISTDOCMAP = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RCPACHEMISTDOCMAP = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " SET "
                    + TABLES.RCPA_CHEMISTDOCTORMAP.DOCTOR_SL_NO
                    + "=? WHERE " + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + "=?";
            var updateQueryValues = new Array(_item["DOCTORID"], _item["CHEMISTID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RCPACHEMISTDOCMAP = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RCPACHEMISTDOCMAP = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}


/*
 * Function to call make the call to get Compitator Brand Mapping services
 * Parameters
 * 
 * Return Values
 * 
 */
function getCompitatorBrandmapping() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("CHEMISTDOCTORMAP")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetCompitatorBrandmapping";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.RCPABRANDCOPETITORMAP = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processChemistDoctorMap(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Compitator Brand Mapping call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processCompitatorBrandmapping(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.RCPA_BrandCompetitorMap.PRODUCT_GROUP_ID + " FROM "
            + TABLES.RCPA_BrandCompetitorMap.TABLE + " WHERE "
            + TABLES.RCPA_BrandCompetitorMap.PRODUCT_GROUP_ID + "=?";
    var selectValues = new Array(_item["BRAND_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.RCPA_BrandCompetitorMap.TABLE + " ( "
                    + TABLES.RCPA_BrandCompetitorMap.PRODUCT_GROUP_ID + ","
                    + TABLES.RCPA_BrandCompetitorMap.COMPETITOR_ID + ","
                    + TABLES.RCPA_BrandCompetitorMap.COMPETITOR_NAME + ","
                    + TABLES.RCPA_BrandCompetitorMap.MOLECULE
                    + " ) VALUES (?,?,?,?)";
            var insertQueryValues = new Array(_item["BRAND_ID"], _item["COMPETITOR_ID"], _item["COMPETITORBRAND"], _item["MOLECULE"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RCPABRANDCOPETITORMAP = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RCPABRANDCOPETITORMAP = false;
                errorMessage(error.message.toString());
            });

        } else {
            var updateQuery = "UPDATE " + TABLES.RCPA_BrandCompetitorMap.TABLE + " SET "
                    + TABLES.RCPA_BrandCompetitorMap.COMPETITOR_ID + "=?,"
                    + TABLES.RCPA_BrandCompetitorMap.COMPETITOR_NAME + "=?,"
                    + TABLES.RCPA_BrandCompetitorMap.MOLECULE
                    + "=? WHERE " + TABLES.RCPA_BrandCompetitorMap.PRODUCT_GROUP_ID + "=?";
            var updateQueryValues = new Array(_item["COMPETITOR_ID"], _item["COMPETITORBRAND"], _item["MOLECULE"], _item["BRAND_ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.RCPABRANDCOPETITORMAP = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.RCPABRANDCOPETITORMAP = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}


/*
 * Function to call make the call to get RCPA MarketI services
 * Parameters
 * 
 * Return Values
 * 
 */
function getRCPAMarketI() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MarketIntelligence")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetMarketInteligence";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                SYNCCONSTANTS.MARKETI = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processMarketIntillegence(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Market Intillegence call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processMarketIntillegence(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + " FROM "
            + TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " WHERE "
            + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " ( "
                    + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + ","
                    + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME
                    + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["MARKTINTELIGENCE"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " SET " +
                    TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME + "=? WHERE "
                    + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + "=?";
            var updateQueryValues = new Array(_item["MARKTINTELIGENCE"], _item["ID"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}


/*
 * Function to call make the call to get Guideliness services
 * Parameters
 * 
 * Return Values
 * 
 */
function getGuideliness() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MarketIntelligence")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetGuidliness";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.MARKETI = true;
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processGuideliness(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Guideliness call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processGuideliness(_item, _index, _length) {
    var selectQuery = "SELECT" + TABLES.GUIDELINE.GUIDELINE_ID + " FROM "
            + TABLES.GUIDELINE.TABLE + " WHERE "
            + TABLES.GUIDELINE.GUIDELINE_ID + "=?";
    var selectValues = new Array(_item["guidelineId"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.GUIDELINE.TABLE + " ( "
                    + TABLES.GUIDELINE.GUIDELINE_ID + ","
                    + TABLES.GUIDELINE.GUIDELINE_MSG + ","
                    + TABLES.GUIDELINE.NEED_ACCEPTANCE + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["guidelineId"], _item["guidelineMsg"], _item["needAcceptance"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.GUIDELINE.TABLE + " SET "
                    + TABLES.GUIDELINE.GUIDELINE_MSG + "=?,"
                    + TABLES.GUIDELINE.NEED_ACCEPTANCE
                    + "=? WHERE " + TABLES.GUIDELINE.GUIDELINE_ID + "=?";
            var updateQueryValues = new Array(_item["guidelineMsg"], _item["needAcceptance"], _item["guidelineId"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Request Type services
 * Parameters
 * 
 * Return Values
 * 
 */
function getRequestType() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MarketIntelligence")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetRequestType";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.MARKETI = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processRequestType(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}

/*
 * Function to process each item of the Request Type call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processRequestType(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.REQUESTTYPE.REQUEST_ID + " FROM "
            + TABLES.REQUESTTYPE.TABLE + " WHERE "
            + TABLES.REQUESTTYPE.REQUEST_ID + "=?";
    var selectValues = new Array(_item["Request_Id"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = " INSERT INTO " + TABLES.REQUESTTYPE.TABLE +
                    " ( " + TABLES.REQUESTTYPE.REQUEST_ID + "," + TABLES.REQUESTTYPE.REQUEST_NAME + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["Request_Id"], _item["Request_Name"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.REQUESTTYPE.TABLE + " SET "
                    + TABLES.REQUESTTYPE.REQUEST_NAME
                    + "=? WHERE " + TABLES.REQUESTTYPE.REQUEST_ID + "=?";
            var updateQueryValues = new Array(_item["Request_Name"], _item["Request_Id"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Function to call make the call to get Request Type services
 * Parameters
 * 
 * Return Values
 * 
 */
function getProductType() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("MarketIntelligence")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetProductType";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
//                SYNCCONSTANTS.MARKETI = true;
                progValue += 4;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processProductType(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}

/*
 * Function to process each item of the Request Type call and insert into database.
 * Parameters
 *  _item: The one of the item from result of call to service.
 *  _index: The index of the item.
 *  _length: The length of the result from the call to service.
 * Return Vaules
 */

function processProductType(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID + " FROM "
            + TABLES.PRODUCT_TYPE.TABLE + " WHERE "
            + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID + "=?";
    var selectValues = new Array(_item["PRODUCTTYPE_ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = " INSERT INTO " + TABLES.PRODUCT_TYPE.TABLE +
                    " ( " + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID + "," + TABLES.PRODUCT_TYPE.NAME + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_item["PRODUCTTYPE_ID"], _item["NAME"]);
            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.PRODUCT_TYPE.TABLE + " SET "
                    + TABLES.PRODUCT_TYPE.NAME
                    + "=? WHERE " + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID + "=?";
            var updateQueryValues = new Array(_item["PRODUCTTYPE_ID"], _item["NAME"]);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function insertInToTableInfo(_name) {
    var selectQuery = "SELECT " + TABLES.GETTABLEINFO.FULL_NAME + " FROM "
            + TABLES.GETTABLEINFO.TABLE + " WHERE "
            + TABLES.GETTABLEINFO.FULL_NAME + "=?";
    var selectValues = new Array(_name);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = " INSERT INTO " + TABLES.GETTABLEINFO.TABLE +
                    " ( " + TABLES.GETTABLEINFO.FULL_NAME + "," + TABLES.GETTABLEINFO.DATE + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_name, ConvertIT(new Date()));
            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.GETTABLEINFO.TABLE + " SET "
                    + TABLES.GETTABLEINFO.DATE
                    + "=? WHERE " + TABLES.GETTABLEINFO.NAME + "=?";
            var updateQueryValues = new Array(ConvertIT(new Date()), _name);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function insertDataTransfered(_name, _dataTransfered) {
    var selectQuery = "SELECT " + TABLES.GETTABLEINFO.FULL_NAME + " FROM "
            + TABLES.GETTABLEINFO.TABLE + " WHERE "
            + TABLES.GETTABLEINFO.FULL_NAME + "=?";
    var selectValues = new Array(_name);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = " INSERT INTO " + TABLES.GETTABLEINFO.TABLE +
                    " ( " + TABLES.GETTABLEINFO.FULL_NAME + "," + TABLES.GETTABLEINFO.DATE + " ) VALUES (?,?)";
            var insertQueryValues = new Array(_name, _dataTransfered);
            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        } else {
            var updateQuery = "UPDATE " + TABLES.GETTABLEINFO.TABLE + " SET "
                    + TABLES.GETTABLEINFO.DATE
                    + "=? WHERE " + TABLES.GETTABLEINFO.NAME + "=?";
            var updateQueryValues = new Array(_dataTransfered, _name);
            $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

/*
 * Error message to be displayed if problem in database insertion or updation.
 * Parameter
 *  _message: Error message.
 */
function errorMessage(_message) {
    alert(_message);
}


/*
 * Error message to be displayed if problem in ajax call.
 * Parameter
 *  _message: Error message.
 */
function ajaxErrorCallBack(_message) {
//    alert(_message);
}

function GetWorkedWith() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("WORKEDWITH")};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetWorkedWith",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
                $.session.set("INT", "YES");
                var WORKEDWITH;
                if (isUndefinedNullOrEmpty(result)) {
                    SYNCCONSTANTS.WORKEDWITH = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                } else if (result == "") {
                    SYNCCONSTANTS.WORKEDWITH = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                } else {
                    WORKEDWITH = getJsonObject(result);
                    if (WORKEDWITH.length > 0) {
//                        db.transaction(function (tx) {
//                            tx.executeSql('DELETE FROM WorkedWith', [], function (tx, result) {
                        for (var sm in WORKEDWITH)
                        {
                            InsertIntoWorkedWith($.trim(WORKEDWITH[sm].workedwith_id), $.trim(WORKEDWITH[sm].workedwith_name), $.trim(WORKEDWITH[sm].order_no), $.trim(WORKEDWITH[sm].workedwith_sequence), sm, (WORKEDWITH.length - 1), $.trim(WORKEDWITH[sm].Deleted));

                        }
                    }
//                            });
//                        });
                }
//                INSERTINTOTABLEINFO("WORKEDWITH");
                $.session.set("WORKEDWITH", ConvertIT(new Date()));
            },
            error: function (result) {
                SYNCCONSTANTS.WORKEDWITH = false;
                if (result.status == 0) {
                    $.session.set("INT", "NOT");
                }
            }
        });
    }
}

function InsertIntoWorkedWith(_workedWithId, _workedWithName, _orderNo, _wwSequence, id, length, deleted) {
    var selectQuery = "select " + TABLES.WORKED_WITH.WORKEDWITH_ID + " from " + TABLES.WORKED_WITH.TABLE + " where " + TABLES.WORKED_WITH.WORKEDWITH_ID + "=?"
    $.when(dbObject.execute(selectQuery, [_workedWithId])).done(function (result) {
        var resultRows = result.rows;
        if (resultRows.length > 0) {
            if (id == length) {
                SYNCCONSTANTS.WORKEDWITH = true;
                progValue += 4;
                progBar.setValue(progValue);
            }
        } else {
            var insertQuery = 'insert into ' + TABLES.WORKED_WITH.TABLE + '(' + TABLES.WORKED_WITH.WORKEDWITH_ID + ',' + TABLES.WORKED_WITH.WORKEDWITH_NAME + ',' + TABLES.WORKED_WITH.ORDER_NO + ',' + TABLES.WORKED_WITH.WORKEDWITH_SEQUENCE + ')values(?,?,?,?)';
            $.when(dbObject.execute(insertQuery, [_workedWithId, _workedWithName, _orderNo, _wwSequence])).done(function (result) {
                if (id == length) {
                    SYNCCONSTANTS.WORKEDWITH = true;
                    progValue += 4;
                    progBar.setValue(progValue);
                }
            });
        }
    });

}
/*
 * Function to insert into the log file.
 * Parameters
 * _serviceName : service in which error occured.
 * _errorMessage : error description text.
 * Return Values
 * 
 */
function insertIntoLogFile(_serviceName, _errorMessage) {
//    if ($.session.get("LOGFILE") === "true") {
    window.logToFile.info('Service Name: ' + _serviceName + ' , Result: Error, Exception: ' + _errorMessage + "\n\n");
//    }
}
