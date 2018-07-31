var dbObject = new dbAccess();
document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
}, false);
$(function () {
  //  alert(" date = " + $.session.get("ActivityDatefromCalender"));
    $('#activityDate').val($.session.get("ActivityDatefromCalender"));
    init_data();
    assignEvents();
    if (($('#activityDate').val() !== null) && ($('#activityDate').val() !== "") && (($('#activityDate').val()).length > 0)) {
        checkIfDcrDateExists(1);
    }
    // Changing the icon color and background on click or tap
    $('#otherActivity .iconsWrapper').click(function () {
        if (($('#activityDate').val() !== "") && (($('#activityDate').val()).length > 0)) {
            $('#otherActivity .iconsWrapper').css('background-color', 'white');
            $('#otherActivity .iconsWrapper').find('path').css('fill', '#FB9D27');
            $('#otherActivity .iconsWrapper').find('rect').css('fill', '#FB9D27');
            $('#otherActivity .iconsWrapper').find('polygon').css('fill', '#FB9D27');
            $('#otherActivity .iconsWrapper').find('circle').css('fill', '#FB9D27');
            $('#otherActivity .iconsWrapper').find('a').css('color', '#337ab7');
            $('#otherActivity .iconsWrapper').find('.fa-graduation-cap').css('color', '#FB9D27');

            $(this).css('background-color', '#FB9D27');
            $(this).find('path').css('fill', 'white');
            $(this).find('rect').css('fill', 'white');
            $(this).find('polygon').css('fill', 'white');
            $(this).find('circle').css('fill', 'white');
            $(this).find('a').css('color', 'white');
            $(this).find('.fa-graduation-cap').css('color', 'white');

            $('#otherActivity .iconsWrapper').removeClass('active');
            $(this).addClass('active');

            $('#descModal').modal('toggle');
        } else {
            alert("Please select activity date.");
        }
    });

});

// initialing the page
function init_data() {
    $('#headerWrapper').load('header.html', function () {
        // Hide the activity selection section.
        $('#activitySelection').hide();
        $('#backBtn').show();
        $('.glyphicon-save').hide();
        $('#saveMenu').hide();
        $('.headerText').css('width', '90%');
        $('.headerText').css('padding-left', '0');
        $('.headerText').css('margin-top', '10px');
        $('#menu-toggle').hide();
        $('#swipeRightBtn').hide();
        $('#swipeLeftBtn').hide();
        inHome = 1;
    });

    $('#activityDate').mobiscroll().date({
        theme: "ios",
        mode: "mixed",
        lang: "",
        display: "bubble",
        animate: "flip",
        maxDate: new Date()
//        defaultValue: new Date($.session.get("ActivityDate"))
    });

//    var dbObject = new dbAccess();
//    dbObject.execute(DATABASE_STRUCTURE.CREATE_TABLE_GET_TABLE_INFO, null);
//    $.when(dbObject.execute("Insert into " + TABLES.GETTABLEINFO.TABLE + " ( " +
//            TABLES.GETTABLEINFO.FULL_NAME + "," + TABLES.GETTABLEINFO.DATE +
//            ") values (?,?)", new Array(12, new Date()))).done(function (data) {
//        alert("Success");
//    }).fail(function () {
//        alert("error");
//    });
    loadDcrDate();
}
// Assgning the event.
function assignEvents() {
    var currentDate = new Date(ConvertIT(new Date()));
    $('#edetailing').click(function () {
        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "Edetailing.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#EFFORTKPIIDCK').click(function () {

        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "sampleRequest.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#SALESIDCK').click(function () {
        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "sampleIssue.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#feedback').click(function () {
        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "Feedback.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#CALLPLANID').click(function () {
        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "orderDetailing.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#Detailing').click(function () {
        if (($('#activityDate').val() !== "") && ($('#activityDate').val().length > 0))
        {
            document.location = "brandDetailing.html";
        } else {
            alert("Please select activity date.");
        }
    });

    $('#activityDate').change(function () {
        checkIfDcrDateExists(1);
    });

    $('.activityPeroid').change(function () {
        if (($.session.get('lastActivity') != $('#activityDate').val()) && ($('.btn-group label.active').attr('data-item') == "3")) {
            alert("Please select first half or full day");
            $('.btn-group label').removeClass('active');
            $('.btn-group label').removeClass('focus');
            $('.btn-group label').unbind('hover');
            $('#activityPeroidFullDay').parent('label').addClass('active');
        } else if (($.session.get('lastActivityPeroid') != "2") && ($.session.get('lastActivity') == $('#activityDate').val()) && ($('.btn-group label.active').attr('data-item') == "3")) {
            alert("Please select first half or full day");
            $('.btn-group label').removeClass('active');
            $('.btn-group label').removeClass('focus');
            $('.btn-group label').unbind('hover');
            $('#activityPeroidFullDay').parent('label').addClass('active');
        } else if (($.session.get('lastActivityPeroid') == "2") && ($.session.get('lastActivity') == $('#activityDate').val()) && ($('.btn-group label.active').attr('data-item') == "1")) {
            alert("Please select second half");
            $('.btn-group label').removeClass('active');
            $('.btn-group label').removeClass('focus');
            $('.btn-group label').unbind('hover');
            $('#activityPeroidSH').parent('label').addClass('active');
            $('#activityDate').off('click');
        } else {
            checkIfDcrDateExists(1);
        }
    });

    $('#btnActSubmit').click(function () {
        if (($('#desc').val() === "") || ($('#desc').val().length === 0)) {
            alert("Please enter the description");
        } else {
            if (($.session.get('lastActivity') != $('#activityDate').val()) && ($('.btn-group label.active').attr('data-item') == "3")) {
                alert("Please select first half or second half");
            } else {
                checkIfDcrDateExists($('#otherActivity .iconsWrapper.active').attr('data-item'), 1);
            }
        }
    });
}

function checkIfDcrDateExists(_activityType, _subActStatus) {
    var Status;
    var activityvar = '"' + Date.parse(new Date()) + '"';
    var activityID = activityvar.substring(3, 11);
    var CurrentDate = ConvertIT(new Date());
    if ((parseInt(_activityType) === 1) || (_subActStatus === 1))
    {
        Status = "C";
    } else {
        Status = "P";
    }
    var selectQuery = "SELECT * FROM " + TABLES.DAILY_REPORT.TABLE
            + " WHERE " + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "=? ORDER BY " + TABLES.DAILY_REPORT.DCR_SLNO + " DESC";
    $.when(dbObject.execute(selectQuery, [$('#activityDate').val()])).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
            var item = dataset.item(0);
            if (((item[TABLES.DAILY_REPORT.PERIOD] == "3") || (item[TABLES.DAILY_REPORT.PERIOD] == "1")) && ((item[TABLES.DAILY_REPORT.SYNC] === "U") || (item[TABLES.DAILY_REPORT.SYNC] === "S"))) {
                alert("DCR Completed for the day.");
                $('#activityDate').val("");
            } else if ((item[TABLES.DAILY_REPORT.PERIOD] == "2") && (($('.btn-group label.active').attr('data-item') == "1") || ($('.btn-group label.active').attr('data-item') == "2")) && ((item[TABLES.DAILY_REPORT.SYNC] === "U") || (item[TABLES.DAILY_REPORT.SYNC] === "S"))) {
                alert("Please select second half.");
                $('.btn-group label').removeClass('active');
                $('.btn-group label').removeClass('focus');
                $('.btn-group label').unbind('hover');
                $('#activityPeroidSH').parent('label').addClass('active');
                $('#activityDate').off('click');
            } else if ((item[TABLES.DAILY_REPORT.PERIOD] == "3") && (($('.btn-group label.active').attr('data-item') == "1") || ($('.btn-group label.active').attr('data-item') == "2")) && ((item[TABLES.DAILY_REPORT.SYNC] === "U") || (item[TABLES.DAILY_REPORT.SYNC] === "S"))) {
                alert("Please select second half.");
                $('.btn-group label').removeClass('active');
                $('.btn-group label').removeClass('focus');
                $('.btn-group label').unbind('hover');
                $('#activityPeroidSH').parent('label').addClass('active');
                $('#activityDate').off('click');
            } else if ((item[TABLES.DAILY_REPORT.PERIOD] != "3") && ($('.btn-group label.active').attr('data-item') == "3")) {
                var insertQuery = "INSERT INTO " + TABLES.DAILY_REPORT.TABLE + "(" + TABLES.DAILY_REPORT.DCR_SLNO + ","
                        + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "," + TABLES.DAILY_REPORT.PERIOD + ","
                        + TABLES.DAILY_REPORT.ACTIVITY_TYPE + "," + TABLES.DAILY_REPORT.DESCRIPTION + ","
                        + TABLES.DAILY_REPORT.CREATED_DATE + "," + TABLES.DAILY_REPORT.STATUS + ","
                        + TABLES.DAILY_REPORT.SYNC
                        + ") VALUES (?,?,?,?,?,?,?,?)";
                $.session.set("ActivityId", activityID);
                $.when(dbObject.execute(insertQuery, [activityID, $('#activityDate').val(),
                    $('.btn-group label.active').attr('data-item'), _activityType
                            , $('#desc').val(), CurrentDate, Status, "N"])).done(function (data) {
                    var insertQueryEnteredDates = "INSERT INTO " + TABLES.ENTERED_DATES.TABLE + " (" + TABLES.ENTERED_DATES.ACTIVITY_DATE
                            + "," + TABLES.ENTERED_DATES.ACTIVITY_PEROID + ") Values(?,?)";
                    var insertValuesEnteredDates = new Array($('#activityDate').val(), $('.btn-group label.active').attr('data-item'));
                    $.when(dbObject.execute(insertQueryEnteredDates, insertValuesEnteredDates)).done(function (data) {
                        console.log(" Description inserted into if  ENTERED_DATES table ");
                    }).fail(function (error) {
                        errorMessage(error.message.toString());
                    });
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else if ((item[TABLES.DAILY_REPORT.PERIOD] == "3") && ($('.btn-group label.active').attr('data-item') == "3")) {
                var updateQuery = "UPDATE " + TABLES.DAILY_REPORT.TABLE + " SET " + TABLES.DAILY_REPORT.PERIOD + "=?,"
                        + TABLES.DAILY_REPORT.ACTIVITY_TYPE + "=?," +
                        TABLES.DAILY_REPORT.STATUS + "=?," + TABLES.DAILY_REPORT.DESCRIPTION + "=? WHERE "
                        + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "=? and " + TABLES.DAILY_REPORT.SYNC + "='N'";
                var updateValues = new Array($('.btn-group label.active').attr('data-item'), _activityType
                        , Status, $('#desc').val(), $('#activityDate').val());
                var item = dataset.item(0);
                var dcrSlno = item[TABLES.DAILY_REPORT.DCR_SLNO];
                $.session.set("ActivityDate", $('#activityDate').val());
                $.when(dbObject.execute(updateQuery, updateValues)).done(function (data) {
                    $.session.set("ActivityId", dcrSlno);
                    if (_activityType !== 1) {
                        $.session.set('customerDCRSLNNO', '');
                        $.session.set('chemistName', '');
                        $.session.set('DoctorName', '');
                        $.session.set('ActivityId', '');
                        $.session.set('stockiestName', '');
                        SinkService();
//                        window.location = 'EHome.html';
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.DAILY_REPORT.TABLE + " SET " + TABLES.DAILY_REPORT.PERIOD + "=?,"
                        + TABLES.DAILY_REPORT.ACTIVITY_TYPE + "=?," +
                        TABLES.DAILY_REPORT.STATUS + "=?," + TABLES.DAILY_REPORT.DESCRIPTION + "=? WHERE "
                        + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "=?";
                var updateValues = new Array($('.btn-group label.active').attr('data-item'), _activityType
                        , Status, $('#desc').val(), $('#activityDate').val());
                var item = dataset.item(0);
                var dcrSlno = item[TABLES.DAILY_REPORT.DCR_SLNO];
                $.session.set("ActivityDate", $('#activityDate').val());
                $.when(dbObject.execute(updateQuery, updateValues)).done(function (data) {
                    $.session.set("ActivityId", dcrSlno);
                    if (_activityType !== 1) {
                        $.session.set('customerDCRSLNNO', '');
                        $.session.set('chemistName', '');
                        $.session.set('DoctorName', '');
                        $.session.set('ActivityId', '');
                        $.session.set('stockiestName', '');
                        $.session.set('customerId', '');
                        SinkService();
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        } else {
            var insertQuery = "INSERT INTO " + TABLES.DAILY_REPORT.TABLE + "(" + TABLES.DAILY_REPORT.DCR_SLNO + ","
                    + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "," + TABLES.DAILY_REPORT.PERIOD + ","
                    + TABLES.DAILY_REPORT.ACTIVITY_TYPE + "," + TABLES.DAILY_REPORT.DESCRIPTION + ","
                    + TABLES.DAILY_REPORT.CREATED_DATE + "," + TABLES.DAILY_REPORT.STATUS + ","
                    + TABLES.DAILY_REPORT.SYNC
                    + ") VALUES (?,?,?,?,?,?,?,?)";
            $.session.set("ActivityId", activityID);
            $.when(dbObject.execute(insertQuery, [activityID, $('#activityDate').val(),
                $('.btn-group label.active').attr('data-item'), _activityType
                        , $('#desc').val(), CurrentDate, Status, "N"])).done(function (data) {
                var insertQueryEnteredDates = "INSERT INTO " + TABLES.ENTERED_DATES.TABLE + " (" + TABLES.ENTERED_DATES.ACTIVITY_DATE
                        + "," + TABLES.ENTERED_DATES.ACTIVITY_PEROID + ") values (?,?)";
                var insertValuesEnteredDates = new Array($('#activityDate').val(), $('.btn-group label.active').attr('data-item'));
                $.when(dbObject.execute(insertQueryEnteredDates, insertValuesEnteredDates)).done(function (data) {
                    console.log(" Description inserted into else ENTERED_DATES table ");
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }).fail(function (error) {
                errorMessage(error.message.toString());
            });
        }
    });
}

function loadDcrDate() {
    var selectQuery = "SELECT * FROM " + TABLES.DAILY_REPORT.TABLE
            + " ORDER BY " + TABLES.DAILY_REPORT.DCR_SLNO + " DESC LIMIT 1";
    $.when(dbObject.execute(selectQuery, [])).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
            var item = dataset.item(0);
            if (((item[TABLES.DAILY_REPORT.PERIOD] == "3") || (item[TABLES.DAILY_REPORT.PERIOD] == "1")) && (item[TABLES.DAILY_REPORT.SYNC] == "S" || item[TABLES.DAILY_REPORT.SYNC] == "U")) {
                $.session.set('customerDCRSLNNO', '');
                $.session.set('chemistName', '');
                $.session.set('DoctorName', '');
                $.session.set('ActivityId', '');
                $.session.set('stockiestName', '');
                $.session.set('customerId', '');
                $.session.set('lastActivity', item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $.session.set('lastActivityPeroid', item[TABLES.DAILY_REPORT.PERIOD]);
                deleteLatestCustomerAdded();
            } else if ((item[TABLES.DAILY_REPORT.PERIOD] == "2") && (item[TABLES.DAILY_REPORT.SYNC] == "S" || item[TABLES.DAILY_REPORT.SYNC] == "U")) {
                $.session.set('lastActivity', item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $.session.set('lastActivityPeroid', item[TABLES.DAILY_REPORT.PERIOD]);
                $.session.set('lastActivitySync', item[TABLES.DAILY_REPORT.SYNC]);
                $.session.set("ActivityId", item[TABLES.DAILY_REPORT.DCR_SLNO]);
                $.session.set("ActivityDate", item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $('#activityDate').val(item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $('.btn-group label').removeClass('active');
                $('#activityPeroidSH').parent().addClass('active');
                $('#activityDate').off('click');
            } else {
                $.session.set('lastActivity', item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $.session.set('lastActivityPeroid', item[TABLES.DAILY_REPORT.PERIOD]);
                $.session.set('lastActivitySync', item[TABLES.DAILY_REPORT.SYNC]);
                $.session.set("ActivityId", item[TABLES.DAILY_REPORT.DCR_SLNO]);
                $.session.set("ActivityDate", item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $('#activityDate').val(item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                $('.btn-group label').each(function () {
                    if ($(this).attr('data-item') == item[TABLES.DAILY_REPORT.PERIOD]) {
                        $('.btn-group label').removeClass('active');
                        $(this).addClass('active');
                    }
                });
            }
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}