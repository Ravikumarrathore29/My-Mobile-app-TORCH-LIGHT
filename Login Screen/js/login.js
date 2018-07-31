/***********************************************************
 *	Module Name 		: Login
 *	File Name               : login.js
 *	Author			: Uday
 *	Creation Date 		: 08/08/2017
 *	Description	  	: Login Page
 *	Requirement Key 	: 
 *	Modification    	:	
 *	SL.No	Date		Author		Description
 
 *************************************************************/

var userName = "", Password = "";
$(function () {
    init_data();
    assignEvents();
    loadLastSync();
    loadDataRecieved();
    checkParameterLog();
});

/* Initialize the form
 * Parameter
 *  
 * Return Value
 *  
 */

function init_data() {
    createDatabase();
}

/* Create Database tables.
 * Parameter
 *  
 * Return Value
 *  
 */

function createDatabase() {
    $.when(dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_USER, null)).done(function () {
        checkUserExists();
    });
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_GET_TABLE_INFO, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DAILY_REPORT, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_PARAMETER, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_DOCTOR, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_STOCKIST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_CHEMIST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_UNLISTED_DOCTORS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SPECIALITY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DOCTOR_INFO, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_STOCKIST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CHEMISTS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_MARKET_AREA, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_ACTIVITY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_PRODUCT_GROUPS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_KEY_MSG, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SAMPLES, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_D_DETAILING, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_D_SAMPLE_DETAILS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CLASS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CATEGORY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RATING, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CALL_PLAN, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RESIGN, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_MAP_P_TABLE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CITY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_STOCK_SALES_MASTER, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_STOCK_SALES_DETAILS, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SKUMAT, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SS_PARAMETER, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_CHEMISTDOCTORMAP, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_BRANDCOMPETITORMAP, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_MARKETINTELLIGENCE, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_ADDENTRY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_ADDENTRYCHEMIST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_ADDENTRYBRAND, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_RCPA_ADDENTRYMARKETINTELLIGENCESSSS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_LOCTION_INFO, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_LOCK, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CAMPAIGN_PLAN, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_FEEDBACK_INFO, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_FILETYPE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_E_GROUP, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_FAVOURITE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_FAVOURITE_DETAIL, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_EBRANDS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_EUNLISTEDBRANDS, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_E_SAMPLE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DETAILING_TO, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_EBRANDMAP, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_E_SPECIALITY, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CONTENT, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SSC_LOSING_STOCK, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SECONDAR_SALES_LAST, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_E_DETAIL_PAGE_TRACKING, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_E_DETAIL_PAGE_LIKE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_E_DETAIL_PAGE_FAVORITES, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_E_DETAIL_PAGE_GROUPING, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_GUIDELINE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_GUIDELINE_ACCEPETED, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_REQUEST_TYPE, null);

    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_NOTIFICATION_DETAILS, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_NOTIFICATION, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_DCR_BRAND_ORDER, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_VERSION, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_EFFORT_KPI, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SALES, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_COMMUNICATION_PAD, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_LATEST_CUSTOMER_ADDED, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_PRODUCT_TYPE, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_SAMPLE_REQUEST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_ENTERED_DATES, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_WORKED_WITH, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CALLPLANCHEMIST, null);
    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_CALLPLANSTOCKIST, null);

}

/* Assign events to the screen widgets.
 * Parameter
 *  
 * Return Value
 *  
 */

function assignEvents() {
   
    $('#SubmitID').click(function () {
        if (($("#PasswordID").val() === Password) && ($("#UserID").val() === userName) && (Password !== ""))
        {
            alert("Hi ");
            window.location = "index.html";
        } else {
            if (validateForm()) {
                getUser();
            }
        }
    });

    $('.required_MCL').keyup(function () {
        $(this).next('.Error').remove();
    });
}

/* check if the user has already logged in to the application
 * Parameter
 *  
 * Return Value
 *  
 */

function checkUserExists() {
    var getUserQuery = "SELECT * FROM " + TABLES.USER.TABLE;
    $.when(dbObject.execute(getUserQuery, [])).done(function (_data) {
        var resultSet = _data.rows;
        if (resultSet.length > 0) {
            $("#PINDIVID").remove();
            $('#UserID').prop('readonly', true);

            var item = resultSet.item(0);
            $.session.set("UserName", item[TABLES.USER.USER_NAME]);
            $.session.set("User_ID", item[TABLES.USER.USER_ID]);
            $.session.set("EMPCODE", item[TABLES.USER.EMPCODE]);
            userName = item[TABLES.USER.USER_NAME];
//                UserID = item['user_id'];
//                Comapny_ID = item['Company_ID'];
//                Team_ID = item['Team_ID'];
//                Date_of_Join = item["DATEOFJOINING"];
//                Name = item['NAME'];
//                Expense = item['Expense'];
            Password = item[TABLES.USER.PASSWORD];
//                RStatus = item["status"];
//                RDATEN = item["RDATE"];
//                INSTALL = item["INSTALLED"];
//                VERSION = item["VERSION"];
//                EMPCODE = item["EMPCODE"];
//                PIN = item["PIN"];
            $("#UserID").val(item[TABLES.USER.USER_NAME]);

        }
    }).fail(function (error) {
        ajaxErrorCallBack(error);
    });
}

/* Validate the form
 * Parameter
 *  
 * Return Value
 *  
 */

function validateForm() {
    var vaildatedStatus = true;
    $('.Error').remove();
    $('.required_MCL').each(function (event) {
        if ($(this).val().length === 0) {
            $(this).after('<label  class="Error"  style="color: #F1520E;">Please enter the field</label>');
            vaildatedStatus = false;
        }
    });
    return vaildatedStatus;
}

/* Get the user from the server.
 * Parameter
 *  
 * Return Value
 *  
 */

function getUser() {
    var request = {UserName: $('#UserID').val(), Password: $('#PasswordID').val(), PinNo: $('#PINID').val(), Installed: "N", deviceNumber: deviceNumber
        , deviceVersion: deviceVersion, devicePlatform: devicePlatform, deviceModel: deviceModel
        , deviceManufacturer: deviceManufacturer, deviceIsSim: deviceIsSim, deviceSerial: deviceSerial};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEmployeeId";
    $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
        if (isUndefinedNullOrEmpty(_data)) {
        } else if (_data === "") {
            alert("Please check username or password");
        } else {
            var jsonData = getJsonObject(_data);
            $.each(jsonData, function (index, item) {
                processUser(item, index, jsonData.length);
            });
        }
    }).fail(function (error) {
        ajaxErrorCallBack(error);
    });
}

/* Insert the user into the local database
 * Parameter
 *  
 * Return Value
 *  
 */

function processUser(_item, _index, _length) {
    if ((parseInt($.trim(_item["UserID"])) === 0) && (parseInt($.trim(_item["deviceChanged"])))) {
        alert("Device has been changed, Please contact administrator");
    } else if (_item["Status"] === "R") {
        var insertQuery = "INSERT INTO " + TABLES.RESIGN.TABLE + " ( " + TABLES.USER.STATUS + " ) VALUES (?)";
        var insertQueryValues = new Array("R");

        $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
            alert("Invalid Login");
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var entry = fileSystem.root;
            entry.getDirectory("KEAPRO_EDETAIL_DATA", {create: true, exclusive: false}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    console.log("Remove Recursively Succeeded");
                });
            });
        });
    } else {
        var insertQuery = "INSERT INTO " + TABLES.USER.TABLE + " ( " + TABLES.USER.USER_ID + ","
                + TABLES.USER.USER_NAME + "," + TABLES.USER.PASSWORD + "," + TABLES.USER.STATUS + ","
                + TABLES.USER.AREA_RANGE + "," + TABLES.USER.EMP_CODE + "," + TABLES.USER.NAME + ","
                + TABLES.USER.DESIGNATION + "," + TABLES.USER.DATE_OF_JOINING + "," + TABLES.USER.EXPENSE + ","
                + TABLES.USER.TERRITORY + "," + TABLES.USER.COMPANY_ID + "," + TABLES.USER.TEAM_ID + ","
                + TABLES.USER.U_STATUS + "," + TABLES.USER.R_DATE + "," + TABLES.USER.PIN + ","
                + TABLES.USER.INSTALLED + "," + TABLES.USER.VERSION
                + " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var insertQueryValues = new Array(_item["UserID"], _item["username"], _item["Password"], _item["Status"], _item["AREARANGE"], _item["EmpCode"], _item["FULLNAME"], _item["Designation"], _item["DateofJoining"], _item["Expense"], _item["TERRITORY_ID"], _item["Company_id"], _item["Team_id"], _item["UpdateStatus"], "", "", "Y", _item["Version"]);

        $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
            $.session.set("User_ID", _item["UserID"]);
            window.location = "index.html";
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });
    }

}

function loadLastSync() {
    var selectQuery = "SELECT " + TABLES.GETTABLEINFO.FULL_NAME + " FROM "
            + TABLES.GETTABLEINFO.TABLE + " WHERE "
            + TABLES.GETTABLEINFO.FULL_NAME + "='lastSynced'";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            var item = data.rows.item(0);
            $.session.set("lastSynced", item[TABLES.GETTABLEINFO.DATE]);
        }
    });
}

function loadDataRecieved() {
    var selectQuery = "SELECT " + TABLES.GETTABLEINFO.FULL_NAME + " FROM "
            + TABLES.GETTABLEINFO.TABLE + " WHERE "
            + TABLES.GETTABLEINFO.FULL_NAME + "='dataTransfered'";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            var item = data.rows.item(0);
            $.session.set("dataTransfered", item[TABLES.GETTABLEINFO.DATE]);
        }
    });
}

function checkParameterLog() {
    var selectQuery = "SELECT * FROM " + TABLES.PARAMETER.TABLE + " where " + TABLES.PARAMETER.PARTICULAR + "=? ";
    var selectValues = new Array("LOGFILE");
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        if (data.rows.length > 0) {
            $.session.set("LOGFILE", true);
        }
    });
}