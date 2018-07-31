/* Developed By: Uday
 * Modified By: Ravi Kumar rathore
 * Created Date: 08/09/2017
 * Modified Date: 07/11/2018
 * CAll PlAN , Fence Module added 
 */

//Left ( > ) and right side ( < ) arrow marks are there to open side bar navigation .
//first User need to select Doctor or chemist or stockist ( any one of these customer) 
// based on that customer  user need to select either " Call Plan " or "Fence"  or " Both " checkbox
// if user celect call plan and  any date match with selected activity date then data will appear
// if user seelcted " Fence " then he need to enter distacne also , based on that near by customer will be appear
// for "both" , call plan and fence both will appear 

var mDoctorLimit = 5, mChemistLimit = 5, mStockistLimit = 5;

var dbObject = new dbAccess();
$(function () {
    init_data();
    assignEvents();
    $('#CALLPLANCKID').attr('checked', false);
    $('#fenceId').attr('checked', false);
    $('#bothId').attr('checked', false);

});

function init_data() {
//    $('#doctorNameWrapper').hide();
    loadDoctors();
    loadChemist();
    loadStockist();
    getLatestCustomerAdded();
    loadWorkedWith();
}

function loadWorkedWith() {
    $.when(dbObject.execute("Select * from " + TABLES.WORKED_WITH.TABLE)).done(function (result) {
        var resultRows = result.rows;
        var appendContents = '<div class="row" style="width: 100%">';
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendContents += '<div class="col-xs-offset-1 col-xs-5">' +
                    '<input name="WorkedwithDoctor" value="' + item[TABLES.WORKED_WITH.WORKEDWITH_ID] + '" type="checkbox" class="WorkedwithDoctor" style="padding-top: 10px;">' + item[TABLES.WORKED_WITH.WORKEDWITH_NAME] +
                    '</div>';
        }
        appendContents += '</div>';
        $('#workedWithWrapper').append(appendContents);
    });

}

function loadChemist() {
    var selectQuery = "SELECT " + TABLES.CHEMISTS.NAME + "," + TABLES.CHEMISTS.CHEMIST_ID
            + "," + TABLES.MARKET_AREA.MARKET_AREA + " FROM " + TABLES.CHEMISTS.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.CHEMISTS.TABLE + "." + TABLES.CHEMISTS.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " ORDER BY " + TABLES.CHEMISTS.NAME + " ASC LIMIT " + mChemistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedChemist' data='" + item[TABLES.CHEMISTS.CHEMIST_ID] + "'>";
            appendData += "<span>" + item[TABLES.CHEMISTS.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#chemistListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadChemistByName() {
    var selectQuery = "SELECT " + TABLES.CHEMISTS.NAME + "," + TABLES.CHEMISTS.CHEMIST_ID
            + "," + TABLES.MARKET_AREA.MARKET_AREA + " FROM " + TABLES.CHEMISTS.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.CHEMISTS.TABLE + "." + TABLES.CHEMISTS.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " WHERE " + TABLES.CHEMISTS.NAME + " LIKE '%" + $('#searchCustomer').val() + "%'" +
            " ORDER BY " + TABLES.CHEMISTS.NAME + " ASC LIMIT " + mChemistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedChemist' data='" + item[TABLES.CHEMISTS.CHEMIST_ID] + "'>";
            appendData += "<span>" + item[TABLES.CHEMISTS.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#chemistListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadDoctorsByName() {
    var selectQuery = "SELECT " + TABLES.DOCTOR_INFO.NAME + "," + TABLES.DOCTOR_INFO.CLASSIFICATION
            + "," + TABLES.DOCTOR_INFO.SPECIALITY_ID + "," + TABLES.MARKET_AREA.MARKET_AREA +
            "," + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
            " FROM " + TABLES.DOCTOR_INFO.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.DOCTOR_INFO.TABLE + "." + TABLES.DOCTOR_INFO.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " WHERE " + TABLES.DOCTOR_INFO.NAME + " LIKE '%" + $('#searchCustomer').val() + "%'" +
            " ORDER BY " + TABLES.DOCTOR_INFO.NAME + " ASC LIMIT " + mDoctorLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedDoctor' data='" + item[TABLES.DOCTOR_INFO.DOCTOR_SL_NO] + "'>";
            appendData += "<span>" + item[TABLES.DOCTOR_INFO.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.DOCTOR_INFO.CLASSIFICATION] + "|" +
                    item[TABLES.DOCTOR_INFO.SPECIALITY_ID] + "|" +
                    item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#doctorListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadDoctors() {
    var selectQuery = "SELECT " + TABLES.DOCTOR_INFO.NAME + "," + TABLES.DOCTOR_INFO.CLASSIFICATION
            + "," + TABLES.DOCTOR_INFO.SPECIALITY_ID + "," + TABLES.MARKET_AREA.MARKET_AREA +
            "," + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
            " FROM " + TABLES.DOCTOR_INFO.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.DOCTOR_INFO.TABLE + "." + TABLES.DOCTOR_INFO.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " ORDER BY " + TABLES.DOCTOR_INFO.NAME + " ASC LIMIT " + mDoctorLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedDoctor' data='" + item[TABLES.DOCTOR_INFO.DOCTOR_SL_NO] + "'>";
            appendData += "<span>" + item[TABLES.DOCTOR_INFO.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.DOCTOR_INFO.CLASSIFICATION] + "|" +
                    item[TABLES.DOCTOR_INFO.SPECIALITY_ID] + "|" +
                    item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#doctorListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadStockist() {
    var selectQuery = "SELECT " + TABLES.STOCKIST.NAME + "," + TABLES.STOCKIST.STOCKIST_ID
            + "," + TABLES.MARKET_AREA.MARKET_AREA + " FROM " + TABLES.STOCKIST.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.STOCKIST.TABLE + "." + TABLES.STOCKIST.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " ORDER BY " + TABLES.STOCKIST.NAME + " ASC LIMIT " + mStockistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedStockist' data='" + item[TABLES.STOCKIST.STOCKIST_ID] + "'>";
            appendData += "<span>" + item[TABLES.STOCKIST.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#stockiestListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadStockistByName() {
    var selectQuery = "SELECT " + TABLES.STOCKIST.NAME + "," + TABLES.STOCKIST.STOCKIST_ID
            + "," + TABLES.MARKET_AREA.MARKET_AREA + " FROM " + TABLES.STOCKIST.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.STOCKIST.TABLE + "." + TABLES.STOCKIST.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " WHERE " + TABLES.STOCKIST.NAME + " LIKE '%" + $('#searchCustomer').val() + "%'" +
            " ORDER BY " + TABLES.STOCKIST.NAME + " ASC LIMIT " + mStockistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            appendData += "<div class='row listedStockist' data='" + item[TABLES.STOCKIST.STOCKIST_ID] + "'>";
            appendData += "<span>" + item[TABLES.STOCKIST.NAME] + "</span>";
            appendData += "<br/>";
            appendData += "<font size='1'>" + item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
            appendData += "</div>";
        }
        $('#stockiestListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function assignEvents() {
    $('#doctorListSideBarWrapper').on('click', '.listedDoctor', function () {
        $('#doctorNameWrapper').show();
        $('#doctorName').text($(this).find('span').text());
        $('.customerSideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
        $.session.set("DoctorName", $(this).find('span').text());
        $.session.set("customerId", $(this).attr('data'));
        $.session.set("chemistName", "");
        $.session.set("stockiestName", "");
        $.session.set("customerDCRSLNNO", generateSLNO());
        insertInToDCRDoctor();
        insertInToLatestCustomerAdded($(this).find('span').text(), 0);

        var selectQuery = "SELECT * FROM " + TABLES.DCR_DOCTOR.TABLE + " WHERE " + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "=?";
        var selectValue = new Array($.session.get("customerId"));
        displayAddedItems();
        $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
            var dataLength = data.rows.length;
            if (dataLength === 0) {
                $('.WorkedwithDoctor').prop('checked', false);
                $('#infoModal').modal('toggle');
            }
        });
        $('.container').click();
    });

    $('#chemistListSideBarWrapper').on('click', '.listedChemist', function () {
        $('#doctorNameWrapper').show();
        $('#doctorName').text($(this).find('span').text());
        $('.customerSideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
        $.session.set("DoctorName", "");
        $.session.set("chemistName", $(this).find('span').text());
        $.session.set("customerId", $(this).attr('data'));
        $.session.set("stockiestName", "");
        $.session.set("customerDCRSLNNO", generateSLNO());
        insertInToDCRChemist();
        insertInToLatestCustomerAdded($(this).find('span').text(), 1);

        displayAddedItems();
        var selectQuery = "SELECT * FROM " + TABLES.DCR_CHEMIST.TABLE + " WHERE " + TABLES.DCR_CHEMIST.CHEMIST_ID + "=?";
        var selectValue = new Array($.session.get("customerId"));

        $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
            var dataLength = data.rows.length;
            if (dataLength === 0) {
                $('.WorkedwithDoctor').prop('checked', false);
                $('#infoModal').modal('toggle');
            }
        });
        $('.container').click();
    });

    $('#stockiestListSideBarWrapper').on('click', '.listedStockist', function () {
        $('#doctorNameWrapper').show();
        $('#doctorName').text($(this).find('span').text());
        $('.customerSideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
        $.session.set("DoctorName", "");
        $.session.set("chemistName", "");
        $.session.set("stockiestName", $(this).find('span').text());
        $.session.set("customerId", $(this).attr('data'));
        $.session.set("customerDCRSLNNO", generateSLNO());
        insertIntoDCRStockist();
        insertInToLatestCustomerAdded($(this).find('span').text(), 2);
        displayAddedItems();
        var selectQuery = "SELECT * FROM " + TABLES.DCR_STOCKIST.TABLE + " WHERE " + TABLES.DCR_STOCKIST.STOCKIST_ID + "=?";
        var selectValue = new Array($.session.get("customerId"));

        $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
            var dataLength = data.rows.length;
            if (dataLength === 0) {
                $('.WorkedwithDoctor').prop('checked', false);
                $('#infoModal').modal('toggle');
            }
        });
        $('.container').click();
    });

    $('#searchCustomer').keyup(function () {
        if ($('.sideBarNavTabs #doctorListTab').hasClass('active')) {
            mDoctorLimit = 5;
            loadDoctorsByName();
        } else if ($('.sideBarNavTabs #chemistListTab').hasClass('active')) {
            mChemistLimit = 5;
            loadChemistByName();
        } else {
            mStockistLimit = 5;
            loadStockistByName();
        }
    });

    $('#loadMoreDoctors').click(function () {
        mDoctorLimit += 5;
        if ($('#searchCustomer').val().length > 0) {
            loadDoctorsByName();
        } else {
            loadDoctors();
        }
    });

    $('#loadMoreStockiest').click(function () {
        mStockistLimit += 5;
        if ($('#searchCustomer').val().length > 0) {
            loadStockistByName();
        } else {
            loadStockist();
        }
    });

    $('#loadMoreChemist').click(function () {
        mChemistLimit += 5;
        if ($('#searchCustomer').val().length > 0) {
            loadChemistByName();
        } else {
            loadChemist();
        }
    });

    $('#doctorListTab').click(function () {
        $('#CALLPLANCKID').attr('checked', false);
        $('#fenceId').attr('checked', false);
        $('#bothId').attr('checked', false);
        loadDoctors();
    });

    $('#chemistListTab').click(function () {
        $('#CALLPLANCKID').attr('checked', false);
        $('#fenceId').attr('checked', false);
        $('#bothId').attr('checked', false);
    });

    $('#stockistListTab').click(function () {
        $('#CALLPLANCKID').attr('checked', false);
        $('#fenceId').attr('checked', false);
        $('#bothId').attr('checked', false);
    });

    $('.sideBarNavTabs li').click(function () {
        $('#searchCustomer').attr("placeholder", "Search " + $(this).find('a').text() + "...");
    });

    $('#btnSelectWorkedWith').click(function () {
        var workedWith = "";
        $('.WorkedwithDoctor').each(function () {
            if ($(this).prop('checked')) {
                workedWith += $(this).val() + ",";
            }
        });
        workedWith = workedWith.slice(0, -1);
        if ($.session.get("DoctorName") !== undefined && $.session.get("DoctorName") !== "") {
            var insertQuery = "UPDATE " + TABLES.DCR_DOCTOR.TABLE + " SET " + TABLES.DCR_DOCTOR.WORKED_WITH + "=? WHERE "
                    + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + "=?";
            $.when(dbObject.execute(insertQuery, [workedWith, $.session.get("customerDCRSLNNO")])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        } else if ($.session.get("chemistName") !== undefined && $.session.get("chemistName") !== "") {
            var insertQuery = "UPDATE " + TABLES.DCR_CHEMIST.TABLE + " SET " + TABLES.DCR_CHEMIST.WORKED_WITH + "=? WHERE "
                    + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + "=?";
            $.when(dbObject.execute(insertQuery, [workedWith, $.session.get("customerDCRSLNNO")])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        } else {
            var insertQuery = "UPDATE " + TABLES.DCR_STOCKIST.TABLE + " SET " + TABLES.DCR_STOCKIST.WORKED_WITH + "=? WHERE "
                    + TABLES.DCR_STOCKIST.DCR_STOCK_ID + "=?";
            $.when(dbObject.execute(insertQuery, [workedWith, $.session.get("customerDCRSLNNO")])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
        $.session.set('customerWorkedWith', workedWith);
//        var doctorName = $.session.get("DoctorName");
//        $('#doctorName').html(doctorName + " <b>Worked With</b> " + workedWith);
//        $.session.set("DoctorName", doctorName + " <b>Worked With</b> " + workedWith);
    });

    $("#fenceId").click(function () {



        navigator.geolocation.getCurrentPosition(onSuccessPlanfenceId, onErrorPlan, {enableHighAccuracy: true});

    });



    $("#bothId").click(function () {
        if ($("#bothId").is(':checked')) {
            console.log(" bothId is clicked");


            navigator.geolocation.getCurrentPosition(onSuccessPlanbothId, onErrorPlan, {enableHighAccuracy: true});
        }
    });

}

function insertInToDCRDoctor() {
    var selectQuery = "SELECT * FROM " + TABLES.DCR_DOCTOR.TABLE + " WHERE " + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "=?";
    var selectValue = new Array($.session.get("customerId"));

    $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
        var dataLength = data.rows.length;
        if (dataLength > 0) {
            var item = data.rows.item(0);
            $.session.set("customerDCRSLNNO", item[TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO]);
            $.session.set('customerWorkedWith', item[TABLES.DCR_DOCTOR.WORKED_WITH]);
        } else {
            var insertQuery = "INSERT INTO " + TABLES.DCR_DOCTOR.TABLE + "(" + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + "," + TABLES.DCR_DOCTOR.DCR_SL_NO
                    + "," + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "," + TABLES.DCR_DOCTOR.C_DATE + "," + TABLES.DCR_DOCTOR.STATUS
                    + "," + TABLES.DCR_DOCTOR.SYS_START_TIME + ") VALUES (?,?,?,?,?,?)";
            $.when(dbObject.execute(insertQuery, [$.session.get("customerDCRSLNNO"),
                $.session.get("ActivityId"), $.session.get("customerId"), getTimeNow(), 'N', getTimeNow()])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });

}

function insertInToDCRChemist() {
    var selectQuery = "SELECT * FROM " + TABLES.DCR_CHEMIST.TABLE + " WHERE " + TABLES.DCR_CHEMIST.CHEMIST_ID + "=?";
    var selectValue = new Array($.session.get("customerId"));

    $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
        var dataLength = data.rows.length;
        if (dataLength > 0) {
            var item = data.rows.item(0);
            $.session.set("customerDCRSLNNO", item[TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO]);
            $.session.set('customerWorkedWith', item[TABLES.DCR_DOCTOR.WORKED_WITH]);
        } else {
            var insertQuery = "INSERT INTO " + TABLES.DCR_CHEMIST.TABLE + "(" + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + "," + TABLES.DCR_CHEMIST.DCR_SL_NO
                    + "," + TABLES.DCR_CHEMIST.CHEMIST_ID + "," + TABLES.DCR_CHEMIST.CAMPAIGN
                    + "," + TABLES.DCR_CHEMIST.C_DATE + ") VALUES (?,?,?,?,?)";
            $.when(dbObject.execute(insertQuery, [$.session.get("customerDCRSLNNO"),
                $.session.get("ActivityId"), $.session.get("customerId"), '', getTimeNow()])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function insertIntoDCRStockist() {
    var selectQuery = "SELECT * FROM " + TABLES.DCR_STOCKIST.TABLE + " WHERE " + TABLES.DCR_STOCKIST.STOCKIST_ID + "=?";
    var selectValue = new Array($.session.get("customerId"));

    $.when(dbObject.execute(selectQuery, selectValue)).done(function (data) {
        var dataLength = data.rows.length;
        if (dataLength > 0) {
            var item = data.rows.item(0);
            $.session.set("customerDCRSLNNO", item[TABLES.DCR_STOCKIST.DCR_STOCK_ID]);
            $.session.set('customerWorkedWith', item[TABLES.DCR_DOCTOR.WORKED_WITH]);
        } else {
            var insertQuery = "INSERT INTO " + TABLES.DCR_STOCKIST.TABLE + "(" + TABLES.DCR_STOCKIST.DCR_STOCK_ID +
                    "," + TABLES.DCR_STOCKIST.DCR_SL_NO
                    + "," + TABLES.DCR_STOCKIST.STOCKIST_ID
                    + "," + TABLES.DCR_STOCKIST.C_DATE + ") VALUES (?,?,?,?)";
            $.when(dbObject.execute(insertQuery, [$.session.get("customerDCRSLNNO"),
                $.session.get("ActivityId"), $.session.get("customerId"), getTimeNow()])).done(function () {

            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function insertInToLatestCustomerAdded(_cutomerName, _type) {
    var deleteQuery = "DELETE FROM " + TABLES.LATEST_CUSTOMER_ADDED.TABLE;
    $.when(dbObject.execute(deleteQuery, new Array())).done(function () {
        var insertQuery = "INSERT INTO " + TABLES.LATEST_CUSTOMER_ADDED.TABLE + "(" +
                TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_DCR_SL_NO +
                "," + TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_SL_NO
                + "," + TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_NAME +
                "," + TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_TYPE +
                ") VALUES (?,?,?,?)";
        $.when(dbObject.execute(insertQuery, [$.session.get("customerDCRSLNNO"),
            $.session.get("customerId"), _cutomerName, _type])).done(function () {

        }).fail(function (error) {
            errorMessage(error.message.toString());
        });
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });

}

function getLatestCustomerAdded() {
    var selectQuery = "SELECT * FROM " + TABLES.LATEST_CUSTOMER_ADDED.TABLE;
    $.when(dbObject.execute(selectQuery, new Array())).done(function (_data) {
        var dataRows = _data.rows;
        if (dataRows.length > 0) {
            var item = dataRows.item(0);
            switch (parseInt(item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_TYPE])) {
                case 0:
                    $.session.set("DoctorName", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_NAME]);
                    $.session.set("chemistName", "");
                    $.session.set("stockiestName", "");
                    $.session.set("customerId", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_SL_NO]);
                    $.session.set("customerDCRSLNNO", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_DCR_SL_NO]);
                    break;
                case 1:
                    $.session.set("DoctorName", "");
                    $.session.set("chemistName", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_NAME]);
                    $.session.set("stockiestName", "");
                    $.session.set("customerId", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_SL_NO]);
                    $.session.set("customerDCRSLNNO", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_DCR_SL_NO]);
                    break;
                case 2:
                    $.session.set("DoctorName", "");
                    $.session.set("chemistName", "");
                    $.session.set("stockiestName", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_NAME]);
                    $.session.set("customerId", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_SL_NO]);
                    $.session.set("customerDCRSLNNO", item[TABLES.LATEST_CUSTOMER_ADDED.CUSTOMER_DCR_SL_NO]);
                    break;
                default:
            }
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

$("#CALLPLANCKID").click(function () {
    if ($("#CALLPLANCKID").is(':checked'))
    {
        console.log($.session.get("ActivityDate"));
        //var value = ConvertRTRT($.session.get("ActivityDate"))
        if ($('.sideBarNavTabs #doctorListTab').hasClass('active')) {
            console.log(" getDoctorInfoCallPlaned ");
            getDoctorInfoCallPlaned();
        } else if ($('.sideBarNavTabs #chemistListTab').hasClass('active')) {
            console.log(" getChemistInfoCallPlaned ");
            getChemistInfoCallPlaned();
        } else {
            console.log(" getStockistInfoCallPlaned ");
            getStockistInfoCallPlaned();
        }
    } else {
        init_data();
    }
});

function getDoctorInfoCallPlaned() {
    var selectQuery = "SELECT DI." + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + ", DI." + TABLES.DOCTOR_INFO.NAME + ", DI." + TABLES.DOCTOR_INFO.CLASSIFICATION + ", DI."
            + TABLES.DOCTOR_INFO.MOBILE_NO
            + ", DI."
            + TABLES.DOCTOR_INFO.SPECIALITY_ID
            + ", DI."
            + TABLES.DOCTOR_INFO.MARKET_AREA_ID
            + " FROM "
            + TABLES.DOCTOR_INFO.TABLE
            + " DI INNER JOIN "
            + TABLES.CALLPLAN.TABLE
            + " C ON DI."
            + TABLES.DOCTOR_INFO.DOCTOR_SL_NO
            + " = C."
            + TABLES.CALLPLAN.DCR_DOCTOR_SLNO
            + " LEFT JOIN "
            + TABLES.DCR_DOCTOR.TABLE
            + " DD ON C."
            + TABLES.CALLPLAN.DCR_DOCTOR_SLNO
            + " = DD."
            + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + " WHERE C."
            + TABLES.CALLPLAN.DATE
            + " = '" + $.session.get("ActivityDate") + "' AND DD."
            + TABLES.DCR_DOCTOR.DCR_SL_NO
            + " IS NULL AND  DD."
            + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + " IS NULL ORDER BY DI."
            + TABLES.DOCTOR_INFO.NAME
            + " ASC ";
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        console.log(result);
        var resultRows = result.rows;
        if (resultRows.length > 0) {
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                appendData += "<div class='row listedDoctor' data='" + item["doctor_sl_no"] + "'>";
                appendData += "<span>" + item["name"] + "</span>";
                appendData += "<br/>";
                appendData += "<font size='1'>" + item["classification"] + "|" +
                        item["speciality_id"] + "|" +
                        item["market_area_id"] + "</font>";
                appendData += "</div>";
            }
            $('#doctorListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR DOCTOR ");
        }


    }).fail(function (error) {
        errorMessage(" Error Message from getDoctorInfoCallPlaned() = " + error.message.toString() + "  error= " + error);
        console.log("getDoctorInfoCallPlaned  NO Result " + JSON.stringify(error));

    });
}

function getChemistInfoCallPlaned(Value) {
    var selectQuery = "SELECT C." + TABLES.CHEMISTS.NAME
            + ", CP." + TABLES.CALLPLANCHEMIST.CHEMIST_SLNO
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " FROM " + TABLES.CHEMISTS.TABLE
            + " C  INNER JOIN "
            + TABLES.CALLPLANCHEMIST.TABLE
            + " CP ON CP."
            + TABLES.CALLPLANCHEMIST.CHEMIST_SLNO
            + " = C." + TABLES.CHEMISTS.CHEMIST_ID
            + " INNER JOIN  "
            + TABLES.MARKET_AREA.TABLE
            + " M ON M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " = C."
            + TABLES.CHEMISTS.MARKET_AREA_ID
            + " LEFT JOIN "
            + TABLES.DCR_CHEMIST.TABLE
            + " DC ON C."
            + TABLES.CHEMISTS.CHEMIST_ID
            + " = DC."
            + TABLES.DCR_CHEMIST.CHEMIST_ID
            + " WHERE CP."
            + TABLES.CALLPLANCHEMIST.DATE
            + "='"
            + $.session.get("ActivityDate") + "' AND DC."
            + TABLES.DCR_CHEMIST.DCR_SL_NO
            + " IS NULL AND DC."
            + TABLES.DCR_CHEMIST.CHEMIST_ID
            + " IS NULL ORDER BY C." + TABLES.CHEMISTS.NAME + "  ASC";
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        console.log(resultRows);
        if (resultRows.length > 0) {
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                appendData += "<div class='row listedChemist' data='" + item['Chemist_ID'] + "'>";
                appendData += "<span>" + item["name"] + "</span>";
                appendData += "<br/>";
                appendData += "<font size='1'>" + item["market_area"] + "</font>";
                appendData += "</div>";
            }
            $('#chemistListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR CHEMIST ");
        }


    }).fail(function (error) {
        errorMessage("eRROR MESSAGE FROM getChemistInfoCallPlaned =   " + error.message.toString());
        console.log("getChemistInfoCallPlaned  NO Result " + JSON.stringify(result));

    });
}

function getStockistInfoCallPlaned() {
    var selectQuery = "SELECT C." + TABLES.STOCKIST.NAME
            + ", CP." + TABLES.CALLPLANSTOCKIST.STOCKIST_SLNO
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " FROM " + TABLES.STOCKIST.TABLE
            + " C  INNER JOIN "
            + TABLES.CALLPLANSTOCKIST.TABLE
            + " CP ON CP."
            + TABLES.CALLPLANSTOCKIST.STOCKIST_SLNO
            + " = C." + TABLES.STOCKIST.STOCKIST_ID
            + " INNER JOIN  "
            + TABLES.MARKET_AREA.TABLE
            + " M ON M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " = C."
            + TABLES.CHEMISTS.MARKET_AREA_ID
            + " LEFT JOIN "
            + TABLES.DCR_STOCKIST.TABLE
            + " DS ON C."
            + TABLES.STOCKIST.STOCKIST_ID
            + " = DS."
            + TABLES.DCR_STOCKIST.STOCKIST_ID
            + " WHERE CP."
            + TABLES.CALLPLANSTOCKIST.DATE
            + "= '"
            + $.session.get("ActivityDate") + "' AND DS."
            + TABLES.DCR_STOCKIST.DCR_SL_NO
            + " IS NULL AND DS."
            + TABLES.DCR_STOCKIST.STOCKIST_ID
            + " IS NULL ORDER BY C." + TABLES.CHEMISTS.NAME + "  ASC";

    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        if (resultRows.length > 0) {
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                appendData += "<div class='row listedStockist' data='" + item['Stockist_ID'] + "'>";
                appendData += "<span>" + item["NAME"] + "</span>";
                appendData += "<br/>";
                appendData += "<font size='1'>" + item["MARKETAREA"] + "</font>";
                appendData += "</div>";
            }
            $('#stockiestListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR STOCKIST ");
        }


    }).fail(function (error) {
        errorMessage("eRROR MESSAGE FROM getStockistInfoCallPlaned =" + error.message.toString());
        console.log("getStockistInfoCallPlaned  NO Result " + JSON.stringify(result));

    });
}

function getCurrentLocation(position) {
    showLocation(position);
}

function showLocation(position) {
    console.log("geolocation position " + position.coords.latitude + " " + position.coords.longitude);
    var lat1 = position.coords.latitude;
    var lon1 = position.coords.longitude;
    //  getFencedDoctorInfo(lat1, lon1);
    var dist = prompt("Please enter Distance ( Numeric ):", "0");
    if (dist == null || dist == "") {
        alert("You have not enter any distance . We will take 5 KM as a  Default value  ");
    } else {
        if ($("#fenceId").is(':checked')) {
            if ($('.sideBarNavTabs #doctorListTab').hasClass('active')) {
                console.log(" showLocation for doctor  ");
                getFencedDoctorInfo(lat1, lon1, dist);
            } else if ($('.sideBarNavTabs #chemistListTab').hasClass('active')) {
                console.log(" showLocation for chemist  ");
                getFencedChemist(lat1, lon1, dist);
            } else {
                console.log(" showLocation for stockist  " + lat1, lon1, dist);
                getFencedStockist(lat1, lon1, dist);
            }
        } else if ($("#bothId").is(':checked')) {
            console.log(" bothId is check insid showlocation() ");
            if ($('.sideBarNavTabs #doctorListTab').hasClass('active')) {
                console.log(" showLocation for doctor call plan and fence both   ");
                bothCallPlanAndFencingDoctor(lat1, lon1, dist);
            } else if ($('.sideBarNavTabs #chemistListTab').hasClass('active')) {
                console.log(" showLocation for chemist  ");
                bothCallPlanAndFencingChemist(lat1, lon1, dist);
            } else {
                console.log(" showLocation for stockist  ");
                bothCallPlanAndFencingStockist(lat1, lon1, dist);
            }
        } else {
            console.log("Nothing is checked ");
        }
    }
}

function getDistance(lat1, lon1, lat2, lon2) {
    console.log(" getDistance " + lat1, lon1, lat2, lon2);
    //var Radius = 6371;
    var Radius = 6356.8;
    var dLat = toRadians(lat2 - lat1);
    var dLon = toRadians(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    console.log(Radius * c * 10);
    return Radius * c * 10;
}

function toRadians(angdeg) {
    return angdeg / (180.0 * Math.PI);
}

function getFencedDoctorInfo(lat, lon, dist) {
    var selectQuery = " SELECT " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO
            + ","
            + TABLES.DOCTOR_INFO.NAME
            + ","
            + TABLES.DOCTOR_INFO.CLASSIFICATION
            + ","
            + TABLES.DOCTOR_INFO.MOBILE_NO
            + ","
            + TABLES.DOCTOR_INFO.SPECIALITY_ID
            + ","
            + TABLES.DOCTOR_INFO.MARKET_AREA_ID
            + ","
            + TABLES.DOCTOR_INFO.LATITUDE
            + ","
            + TABLES.DOCTOR_INFO.LONGITUDE
            + " FROM "
            + TABLES.DOCTOR_INFO.TABLE
            + " ORDER BY "
            + TABLES.DOCTOR_INFO.NAME
            + " ASC LIMIT " + mDoctorLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        console.log(result);
        var resultRows = result.rows;
        var exist = false;
        if (resultRows.length > 0) {
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                var distanceFromLocation = getDistance(lat, lon, item['latitude'], item['logitude'])
                console.log(Math.ceil(distanceFromLocation) + " " + dist);
                if (Math.ceil(distanceFromLocation) <= dist) {
                    exist = true;
                    appendData += "<div class='row listedDoctor' data='" + item["doctor_sl_no"] + "'>";
                    appendData += "<span>" + item["name"] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                    appendData += "<br/>";
                    appendData += "<font size='1'>" + item["classification"] + "|" +
                            item["speciality_id"] + "|" +
                            item["market_area_id"] + "</font>";
                    appendData += "</div>";
                }
            }
            if (!exist) {
                alert("Within " + dist + " K.M. there is No Doctor avilable . Please enter number greater then " + dist + " for getting doctors ");
            }
            $('#doctorListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR DOCTOR ");
        }
    }).fail(function (error) {
        errorMessage(" Error Message from getFencedDoctorInfo() = " + error.message.toString() + "  error= " + error);
        console.log("getDoctorInfoCallPlaned  NO Result " + JSON.stringify(error));
    });
}

function getFencedChemist(lat1, lon1, dist) {
    var selectQuery = "SELECT " + TABLES.CHEMISTS.NAME + "," + TABLES.CHEMISTS.CHEMIST_ID
            + "," + TABLES.MARKET_AREA.MARKET_AREA
            + ","
            + TABLES.STOCKIST.LATITUDE
            + ","
            + TABLES.STOCKIST.LONGITUDE
            + " FROM " + TABLES.CHEMISTS.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.CHEMISTS.TABLE + "." + TABLES.CHEMISTS.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " ORDER BY " + TABLES.CHEMISTS.NAME + " ASC LIMIT " + mChemistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        var exist = false;
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            var distanceFromLocation = getDistance(lat1, lon1, item['latitude'], item['logitude'])
            console.log(Math.ceil(distanceFromLocation) + " " + dist);
            if (Math.ceil(distanceFromLocation) <= dist) {
                exist = true;
                appendData += "<div class='row listedChemist' data='" + item[TABLES.CHEMISTS.CHEMIST_ID] + "'>";
                appendData += "<span>" + item[TABLES.CHEMISTS.NAME] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                appendData += "<br/>";
                appendData += "<font size='1'>" + item[TABLES.MARKET_AREA.MARKET_AREA] + "</font>";
                appendData += "</div>";
            }
        }
        if (!exist) {
            alert("Within " + dist + " K.M. there is No Chemist avilable . Please enter number greater then " + dist + " for getting Chemist ");
        }
        $('#chemistListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function getFencedStockist(lat1, lon1, dist) {
    console.log(lat1, lon1, dist);
    var selectQuery = "SELECT " + TABLES.STOCKIST.NAME + "," + TABLES.STOCKIST.STOCKIST_ID + "," + TABLES.STOCKIST.LATITUDE + "," + TABLES.STOCKIST.LONGITUDE
            + "," + TABLES.MARKET_AREA.MARKET_AREA + " FROM " + TABLES.STOCKIST.TABLE +
            " INNER JOIN " + TABLES.MARKET_AREA.TABLE +
            " ON " + TABLES.STOCKIST.TABLE + "." + TABLES.STOCKIST.MARKET_AREA_ID + "=" + TABLES.MARKET_AREA.TABLE + "." + TABLES.MARKET_AREA.MARKET_AREA_ID +
            " ORDER BY " + TABLES.STOCKIST.NAME
            + ","
            + TABLES.STOCKIST.LATITUDE
            + ","
            + TABLES.STOCKIST.LONGITUDE
            + " ASC LIMIT " + mStockistLimit;
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        var resultRows = result.rows;
        var exist = false;
        console.log(resultRows);
        for (var i = 0; i < resultRows.length; i++) {
            var item = resultRows.item(i);
            var distanceFromLocation = getDistance(lat1, lon1, item['latitude'], item['logitude'])
            console.log(Math.ceil(distanceFromLocation) + " " + dist);
            if (Math.ceil(distanceFromLocation) <= dist) {
                exist = true;
                appendData += "<div class='row listedStockist' data='" + item["stockist_id"] + "'>";
                appendData += "<span>" + item["name"] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                appendData += "<br/>";
                appendData += "<font size='1'>" + item["market_area"] + "</font>";
                appendData += "</div>";
            }
        }
        if (!exist) {
            alert("Within " + dist + " K.M. there is No Stockist avilable . Please enter number greater then " + dist + " for getting Stockist ");
        }
        $('#stockiestListSideBarWrapper').empty().append(appendData);
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function locErrorHandler(error) {
    console.log(" Errro on fecthing location = " + errorMessage(error.message.toString()));
}




function bothCallPlanAndFencingDoctor(lat, lon, dist) {
    var selectQuery = "SELECT DI." + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + ", DI." + TABLES.DOCTOR_INFO.NAME + ", DI." + TABLES.DOCTOR_INFO.CLASSIFICATION + ", DI."
            + TABLES.DOCTOR_INFO.MOBILE_NO
            + ", DI."
            + TABLES.DOCTOR_INFO.SPECIALITY_ID
            + ", DI."
            + TABLES.DOCTOR_INFO.MARKET_AREA_ID
            + ", DI."
            + TABLES.DOCTOR_INFO.LATITUDE
            + ", DI."
            + TABLES.DOCTOR_INFO.LONGITUDE
            + " FROM "
            + TABLES.DOCTOR_INFO.TABLE
            + " DI INNER JOIN "
            + TABLES.CALLPLAN.TABLE
            + " C ON DI."
            + TABLES.DOCTOR_INFO.DOCTOR_SL_NO
            + " = C."
            + TABLES.CALLPLAN.DCR_DOCTOR_SLNO
            + " LEFT JOIN "
            + TABLES.DCR_DOCTOR.TABLE
            + " DD ON C."
            + TABLES.CALLPLAN.DCR_DOCTOR_SLNO
            + " = DD."
            + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + " WHERE C."
            + TABLES.CALLPLAN.DATE
            + " = '" + $.session.get("ActivityDate") + "' AND DD."
            + TABLES.DCR_DOCTOR.DCR_SL_NO
            + " IS NULL AND  DD."
            + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + " IS NULL ORDER BY DI."
            + TABLES.DOCTOR_INFO.NAME
            + " ASC ";
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        console.log(result);
        var resultRows = result.rows;
        var exist = false;
        if (resultRows.length > 0) {
            console.log(" bothCallPlanAndFencingDoctor  result is greater than zero ");
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                var distanceFromLocation = getDistance(lat, lon, item['latitude'], item['logitude'])
                console.log(Math.ceil(distanceFromLocation) + " " + dist);
                if (Math.ceil(distanceFromLocation) <= dist) {
                    exist = true;
                    console.log(" Inide distanceFromLocation <= disrt ");
                    appendData += "<div class='row listedDoctor' data='" + item["doctor_sl_no"] + "'>";
                    appendData += "<span>" + item["name"] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                    appendData += "<br/>";
                    appendData += "<font size='1'>" + item["classification"] + "|" +
                            item["speciality_id"] + "|" +
                            item["market_area_id"] + "</font>";
                    appendData += "</div>";
                }
            }
            if (!exist) {
                alert("Within " + dist + " K.M. there is No Doctor avilable . Please enter number greater then " + dist + " for getting doctors ");
            }
            $('#doctorListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR DOCTOR WITHIN THIS DISTANCE = " + dist + " KM");
        }
    }).fail(function (error) {
        errorMessage(" Error Message from getDoctorInfoCallPlaned() = " + error.message.toString() + "  error= " + error);
        console.log("getDoctorInfoCallPlaned  NO Result " + JSON.stringify(error));
    });
}

function bothCallPlanAndFencingChemist(lat, lon, dist) {
    var selectQuery = "SELECT C." + TABLES.CHEMISTS.NAME
            + ", C." + TABLES.CHEMISTS.LATITUDE
            + ", C." + TABLES.CHEMISTS.LONGITUDE
            + ", CP." + TABLES.CALLPLANCHEMIST.CHEMIST_SLNO
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " FROM " + TABLES.CHEMISTS.TABLE
            + " C  INNER JOIN "
            + TABLES.CALLPLANCHEMIST.TABLE
            + " CP ON CP."
            + TABLES.CALLPLANCHEMIST.CHEMIST_SLNO
            + " = C." + TABLES.CHEMISTS.CHEMIST_ID
            + " INNER JOIN  "
            + TABLES.MARKET_AREA.TABLE
            + " M ON M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " = C."
            + TABLES.CHEMISTS.MARKET_AREA_ID
            + " LEFT JOIN "
            + TABLES.DCR_CHEMIST.TABLE
            + " DC ON C."
            + TABLES.CHEMISTS.CHEMIST_ID
            + " = DC."
            + TABLES.DCR_CHEMIST.CHEMIST_ID
            + " WHERE CP."
            + TABLES.CALLPLANCHEMIST.DATE
            + "='"
            + $.session.get("ActivityDate") + "' AND DC."
            + TABLES.DCR_CHEMIST.DCR_SL_NO
            + " IS NULL AND DC."
            + TABLES.DCR_CHEMIST.CHEMIST_ID
            + " IS NULL ORDER BY C." + TABLES.CHEMISTS.NAME + "  ASC";
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        console.log(result);
        var resultRows = result.rows;
        var exist = false;
        if (resultRows.length > 0) {
            console.log(" bothCallPlanAndFencingDoctor  result is greater than zero ");
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                exist = true;
                var distanceFromLocation = getDistance(lat, lon, item['latitude'], item['logitude'])
                console.log(Math.ceil(distanceFromLocation) + " " + dist);
                if (Math.ceil(distanceFromLocation) <= dist) {
                    console.log(" Inide distanceFromLocation <= disrt ");
                    appendData += "<div class='row listedDoctor' data='" + item["chemist_id"] + "'>";
                    appendData += "<span>" + item["name"] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                    appendData += "<br/>";
                    appendData += "<font size='1'>" + item["market_area"] + "</font>";
                    appendData += "</div>";
                }
            }
            if (!exist) {
                alert("Within " + dist + " K.M. there is No Chemist avilable . Please enter number greater then " + dist + " for getting Chemist ");
            }
            $('#doctorListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR CHEMIST WITHIN THIS DISTANCE = " + dist + " KM");
        }
    }).fail(function (error) {
        errorMessage(" Error Message from bothCallPlanAndFencingChemist() = " + error.message.toString() + "  error= " + error);
        console.log("bothCallPlanAndFencingChemist  NO Result " + JSON.stringify(error));
    });
}

function bothCallPlanAndFencingStockist(lat, lon, dist) {
    var selectQuery = "SELECT C." + TABLES.STOCKIST.NAME
            + ", C." + TABLES.STOCKIST.LATITUDE
            + ", C." + TABLES.STOCKIST.LONGITUDE
            + ", CP." + TABLES.CALLPLANSTOCKIST.STOCKIST_SLNO
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA
            + ", M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " FROM " + TABLES.STOCKIST.TABLE
            + " C  INNER JOIN "
            + TABLES.CALLPLANSTOCKIST.TABLE
            + " CP ON CP."
            + TABLES.CALLPLANSTOCKIST.STOCKIST_SLNO
            + " = C." + TABLES.STOCKIST.STOCKIST_ID
            + " INNER JOIN  "
            + TABLES.MARKET_AREA.TABLE
            + " M ON M."
            + TABLES.MARKET_AREA.MARKET_AREA_ID
            + " = C."
            + TABLES.CHEMISTS.MARKET_AREA_ID
            + " LEFT JOIN "
            + TABLES.DCR_STOCKIST.TABLE
            + " DS ON C."
            + TABLES.STOCKIST.STOCKIST_ID
            + " = DS."
            + TABLES.DCR_STOCKIST.STOCKIST_ID
            + " WHERE CP."
            + TABLES.CALLPLANSTOCKIST.DATE
            + "= '"
            + $.session.get("ActivityDate") + "' AND DS."
            + TABLES.DCR_STOCKIST.DCR_SL_NO
            + " IS NULL AND DS."
            + TABLES.DCR_STOCKIST.STOCKIST_ID
            + " IS NULL ORDER BY C." + TABLES.CHEMISTS.NAME + "  ASC";
    var values = new Array();
    var appendData = "";
    $.when(dbObject.execute(selectQuery, values)).done(function (result) {
        console.log(result);
        var resultRows = result.rows;
        var exist = false;
        if (resultRows.length > 0) {
            console.log(" bothCallPlanAndFencingDoctor  result is greater than zero ");
            for (var i = 0; i < resultRows.length; i++) {
                var item = resultRows.item(i);
                exist = true;
                var distanceFromLocation = getDistance(lat, lon, item['latitude'], item['logitude'])
                console.log(Math.ceil(distanceFromLocation) + " " + dist);
                if (Math.ceil(distanceFromLocation) <= dist) {

                    console.log(" Inide distanceFromLocation <= disrt ");
                    appendData += "<div class='row listedDoctor' data='" + item["Stockist_SLNO"] + "'>";
                    appendData += "<span>" + item["name"] + "  (~" + distanceFromLocation.toFixed(2) + " Kms)" + "</span>";
                    appendData += "<br/>";
                    appendData += "<font size='1'>" + item["classification"] + "|" +
                            item["speciality_id"] + "|" +
                            item["market_area_id"] + "</font>";
                    appendData += "</div>";
                }
            }
            if (!exist) {
                alert("Within " + dist + " K.M. there is No Doctor avilable . Please enter number greater then " + dist + " for getting doctors ");
            }
            $('#doctorListSideBarWrapper').empty().append(appendData);
        } else {
            alert("NO CALL PLAN FOR STOCKIST WITHIN THIS DISTANCE = " + dist + " KM");
        }
    }).fail(function (error) {
        errorMessage(" Error Message from getDoctorInfoCallPlaned() = " + error.message.toString() + "  error= " + error);
        console.log("getDoctorInfoCallPlaned  NO Result " + JSON.stringify(error));
    });
}

var onSuccessPlanfenceId = function (position) {
    if ($("#fenceId").is(':checked')) {
        getCurrentLocation(position);
    }
};


var onSuccessPlanbothId = function (position) {
    if ($("#bothId").is(':checked')) {
        getCurrentLocation(position);
    }
};

// onError Callback receives a PositionError object
//
function onErrorPlan(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}