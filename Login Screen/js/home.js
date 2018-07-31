/***********************************************************
 *	Module Name 		: Home
 *	File Name               : home.js
 *	Author			: Uday
 *	Creation Date 		: 08/21/2017
 *	Description	  	: Home Page java script file.
 *	Requirement Key 	: 
 *	Modification    	:	
 *	SL.No	Date		Author		Description
 *      01      27/10/2017      Ravi            dcrSync() (EHome.html#DCRSYNC)
 *      02      17/11/2017      uday            modified the code to integrate reports, leaves and rcpa.    
 *************************************************************/

var NumberCount = 0;
$(function () {
    
    init_data();
    checkToSync();
    assignEvents();
    dcrSync();
    CHECKCALLPLAN();
});

function init_data() {
    DisplayDoctorsName();
    checkUnsyncedDates();
    var hash = window.location.hash;
    if (hash == "#EFFORTKPIID") {
        getKPIMonth();
    } else if (hash == "#SALESID") {
        getSalesMonth();
    }
}

function checkUnsyncedDates() {
    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DAILY_REPORT.TABLE + " WHERE " + TABLES.DAILY_REPORT.SYNC + "!='S'", [], function (tx, result) {
            NumberCount = result.rows.length;
        });
    });
}

function checkToSync() {
    if (online) {
        var currentDate = new Date(ConvertIT(new Date()));
        if ((new Date($.session.get("lastSynced")) < currentDate) || ($.session.get("lastSynced") === undefined || $.session.get("lastSynced") === "")) {
            masterSync();
        } else {
            $('#progressbar-overlay').hide();
        }
    } else {
        alert("Please Connect to internet.");
        $('#progressbar-overlay').hide();
    }
}

function assignEvents() {
    $('#DAILYREPORTIDLI').on('click tap', function (e) {
        e.preventDefault();
        $.session.set("FAV", "NO");
        if ($.session.get("DCRLOCKOPEN") == "FALSE")
        {
            $("#left_panelID").panel("close");

            alert("Your DCR is locked,Please contact Manager");
        } else {
            window.location = "index.html";
        }
    });

    $('#enteredDates').on('click tap', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location = "EnteredDates.html";
    });
    
     $('#calenderDcr').on('click tap', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location = "CalenderDcr.html";
    });

    $('#DAILYREPORTIDLINEW').click(function () {
        dbCon.transaction(function (tx) {
            tx.executeSql("SELECT * FROM " + TABLES.PARAMETER.TABLE + " WHERE UPPER(" + TABLES.PARAMETER.PARTICULAR + ")=? LIMIT 1", ["DCR_REC_NO"], function (tx, result) {
                dataset = result.rows;
                if (dataset.length > 0) {
                    for (var i = 0, item = null; i < dataset.length; i++) {
                        item = dataset.item(i);
                        if (NumberCount >= item["days"])
                        {
                            alert("You have not synchronize the data with the server");

                        } else {
                            $('#DAILYREPORTIDLI').click();
                        }
                    }
                } else {
                    $('#DAILYREPORTIDLI').click();
                }
            });
        });
    });

    $("#CALLPLANID").click(function () {
        dbCon.transaction(function (tx) {
            tx.executeSql("SELECT * FROM " + TABLES.CALLPLAN.TABLE, [], function (tx, result) {
                dataset = result.rows;
                if (dataset.length > 0) {
                    window.location = "#CALLPLANWEEKID";
                    SHOWCALLPLAN();
                } else {
                    alert("Call Plan Not Available");
                }
            }, function (tx, error) {
                alert(error.message);
            });
        });
    });

    $('.doctorvisitSelect').change(function () {
        var ele = document.getElementById("DCRWAITID");
        ele.style.display = 'none';
        var ele = document.getElementById("DCRNORECORDID");
        ele.style.display = 'none';
        $(this).next('#ErrorVISITS').remove();
    });

    $('.doctorvisitSelectLST5').change(function () {
        var ele = document.getElementById("DOCTORLIST5PLEASEWAITID");
        ele.style.display = 'none';
        var ele = document.getElementById("DOCTORLIST5NORECORDID");
        ele.style.display = 'none';
        $(this).next('#ErrorVISITS5').remove();
    });

    $("#DCVISITSUBMITID").click(function (event) {


        var ele = document.getElementById("DCRWAITID");
        ele.style.display = 'block';
        var empty_count = 0;

        $('#ErrorVISITS').remove();
        $('#ErrorVISITS').remove();
        $('#ErrorVISITI').remove();
        $('.doctorvisitINPUT').each(function (event) {
            if ($(this).val().length === 0) {
                $(this).after('<label  id="ErrorVISITI"  style="color: #F1520E;">Please Enter</label>');
                empty_count = 1;
            }
        });
        $('.doctorvisitSelect').each(function () {
            if ($('option:selected', $(this)).index() === 0) {

                $(this).after('<label  id="ErrorVISITS"  style="color: #F1520E;">Please Select</label>');
                empty_count = 1;
            } else {
                $(this).next('#ErrorVISITS').remove();
            }
        });

        if (empty_count === 1) {
            event.preventDefault();
        } else {
            GETDOCTORMONTHLYVIST();
        }
    });

    $('.SalesSelect').change(function () {
        $(this).next('#ErrorSALES').remove();
        CLearAllInfoSales();
    });

    $('#SALESMONTHID').change(function () {

        db.transaction(function (tx) {
            tx.executeSql("SELECT " + TABLES.SALES.YEAR + " FROM " + TABLES.SALES.TABLE + " WHERE " + TABLES.SALES.MONTH + "=? LIMIT 1", [$('#SALESMONTHID').val()], function (tx, result) {
                dataset = result.rows;

                if (dataset.length > 0) {
                    for (var i = 0, item = null; i < dataset.length; i++) {
                        item = dataset.item(i);
                        $("#SALESYEARID").val(item["Year"])
                    }
                } else {

                }
            });
        });
    });

    $("#FAVOURITEADDID").on('click tap', function () {

        $.session.set("FAV", "YES");
        window.location = "FavouriteAdd.html";
    });

    $('#EDETAILRECORDSSYNCID').on('click tap', function () {
        $("#left_panelID").panel("close");
//        CheckMasterRecordTOFileDownload();

//        displayEdetailingFiles();
        document.location = "EdetailSync.html";
    });

    $("#RCPAID").on('click tap', function () {
        window.location = "RCPA.html";
    });

    $("#MYLEAVESID").on('click tap', function () {
        window.location = "MyLeaves.html";
    });
}

function dcrSync() {
    var selectQuery = "SELECT " + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + " FROM " + TABLES.DAILY_REPORT.TABLE + " WHERE "
            + TABLES.DAILY_REPORT.STATUS + '="C" AND ' + TABLES.DAILY_REPORT.SYNC + '!="S"';
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        var dd = $("#dcrSycDiv");
        dd.append('<br>' +
                '<div class="col-xs-12" style="background-color: white;margin-top: 10px;border-radius: 10px">' +
                '<div class="row" style="padding-top: 10px;padding-bottom: 10px;border-bottom: 1px solid gainsboro">' +
                '<label style="padding-left: 10px;font-weight: bold">DCR Sync</label>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-2" style="border-right: 1px solid gainsboro;padding-top: 5px;padding-bottom: 5px">' +
                '<span class="glyphicon glyphicon-refresh"></span>' +
                '</div>' +
                '<div class="col-xs-10" style="padding-top: 5px;padding-bottom: 5px">' +
                '<span id="dcrSyncDate" styel="font-weight:bold"></span>' +
                '</div>' +
                ' </div>' +
                '</div>');
        var dcrUnsyncedDates = "";
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
//                    $("#dcrSyncDate").val(item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]);
                dcrUnsyncedDates += item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME] + " ,";
            }
            dcrUnsyncedDates = dcrUnsyncedDates.slice(0, -1);
            $('#dcrSyncDate').text(dcrUnsyncedDates);
        }
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function masterSync() {
    getParameters();
    getSpeciality();
    getActivity();
    getCity();
    getSSParameter();
    getSamples();
    getCampaignPlanningList();
    getClosingStock();
    getSecondarySalesLastEntry();
    getKeyMessage();
    getDCRDoctorDetails();
    getDCRChemistDetails();
    getDCRStockistDetails();
    getMarketArea();
    GetWorkedWith();
    getProductGroup();
    getClassification();
    getObjection();
    getRating();
    getCommunicationPad();
    getChemistDoctorMap();
    getCompitatorBrandmapping();
    getRCPAMarketI();
//    getGuideliness();
    getRequestType();
    edetailMasterSync();
    getProductType();
}