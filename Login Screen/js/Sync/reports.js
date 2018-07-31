var Months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var SMonth = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DisplayDoctorsName() {

    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT " + TABLES.DOCTOR_INFO.NAME + "," + TABLES.DOCTOR_INFO.DOCTOR_SL_NO + " FROM " + TABLES.DOCTOR_INFO.TABLE + " ORDER BY " + TABLES.DOCTOR_INFO.NAME + " ASC", [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#DCVISITNAMEID");
            var dd1 = $("#DCVISITNAMEIDLST5");
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value="' + item[TABLES.DOCTOR_INFO.DOCTOR_SL_NO] + '">' + item[TABLES.DOCTOR_INFO.NAME] + ' </option>');
                    dd1.append('<option value="' + item[TABLES.DOCTOR_INFO.DOCTOR_SL_NO] + '">' + item[TABLES.DOCTOR_INFO.NAME] + ' </option>');
                }
            } else {
            }

        });
    });
}

function GETDOCTORMONTHLYVIST() {
    var request = {Doctor_sl_no: $("#DCVISITNAMEID").val(), Month: $("#DCVISITMONTHID").val(), Year: $("#DCVISITYEARID").val(), Employee_id: $.session.get("User_ID")};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetDoctorMonthlyVisit",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
                var ele = document.getElementById("DCRWAITID");
                ele.style.display = 'none';
                $("#DCVISITDIVID").empty();
                var dd = $("#DCVISITDIVID");
                var nid = 1;
                var DTABLE = "";
                var DBODY = "";
                var STABLE = "";
                var SBODY = "";
                var OTABLE = "";
                var OBODY = "";
                var DOCTORINFO = "";
                var ADAte = "";
                if (isUndefinedNullOrEmpty(result)) {
                    var ele = document.getElementById("DCRNORECORDID");
                    ele.style.display = 'block';
                } else if (result == "") {
                    var ele = document.getElementById("DCRNORECORDID");
                    ele.style.display = 'block';
                } else {
                    var ele = document.getElementById("DCVISITDIVID");
                    ele.style.display = 'block';
                    DOCTORINFO = GetJsonObject(result);
                    for (var sm in DOCTORINFO) {

                        if (ADAte == ConvertIT(DOCTORINFO[sm].ActivityDate)) {

                            var KEY = "";
                            var POB = "";
                            if ($.trim(DOCTORINFO[sm].Section) == "Detailing") {
                                $("#" + DTABLE).show();
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    KEY = "Not Mentioned";
                                } else {
                                    KEY = $.trim(DOCTORINFO[sm].KeyMessage);
                                }
                                $("#" + DBODY).append('<tr><td>' + $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) + ' :</td>  <td>' + KEY + '</td></tr>');
                            } else if ($.trim(DOCTORINFO[sm].Section) == "Sampling")
                            {
                                $("#" + STABLE).show();
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    POB = "Not Mentioned";
                                } else {
                                    POB = $.trim(DOCTORINFO[sm].KeyMessage);
                                }

                                $("#" + SBODY).append('<tr><td>' + $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) + ' :</td>  <td>' + POB + '</td></tr>');
                            } else if ($.trim(DOCTORINFO[sm].Section) == "others")
                            {
                                $("#" + OTABLE).show();
                                var Obj = "";
                                var objC = "";
                                var req = "";
                                var reqd = "";
                                var rate = "";
                                var remark = "";
                                var ddo = $("#" + OBODY);
                                if ($.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == "" || $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == null || $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == undefined)
                                {
                                    Obj = "Not Mentioned";
                                } else {
                                    Obj = $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME);
                                }
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    objC = "Not Mentioned";
                                } else {
                                    objC = $.trim(DOCTORINFO[sm].KeyMessage);
                                }
                                if ($.trim(DOCTORINFO[sm].Request) == "" || $.trim(DOCTORINFO[sm].Request) == null || $.trim(DOCTORINFO[sm].Request) == undefined)
                                {
                                    req = "Not Mentioned";
                                } else {
                                    req = $.trim(DOCTORINFO[sm].Request);
                                }
                                if ($.trim(DOCTORINFO[sm].RequestByDate) == "" || $.trim(DOCTORINFO[sm].RequestByDate) == null || $.trim(DOCTORINFO[sm].RequestByDate) == undefined)
                                {
                                    reqd = "Not Mentioned";
                                } else {
                                    reqd = $.trim(DOCTORINFO[sm].RequestByDate);
                                }
                                if ($.trim(DOCTORINFO[sm].REMARKS) == "" || $.trim(DOCTORINFO[sm].REMARKS) == null || $.trim(DOCTORINFO[sm].REMARKS) == undefined)
                                {
                                    remark = "Not Mentioned";
                                } else {
                                    remark = $.trim(DOCTORINFO[sm].REMARKS);
                                }
                                if ($.trim(DOCTORINFO[sm].RateCall) == "" || $.trim(DOCTORINFO[sm].RateCall) == null || $.trim(DOCTORINFO[sm].RateCall) == undefined)
                                {
                                    rate = "Not Mentioned";
                                } else {
                                    rate = $.trim(DOCTORINFO[sm].RateCall);
                                }
                                ddo.append('<tr><td> Objection :</td>  <td>' + Obj + '</td></tr>');
                                ddo.append('<tr><td> ObjectionCategory :</td>  <td>' + objC + '</td></tr>');
                                ddo.append('<tr><td> Request :</td>  <td>' + req + '</td></tr>');
                                ddo.append('<tr><td> RequestedDate :</td>  <td>' + getFormattedDate(ConvertIT(reqd)) + '</td></tr>');
                                ddo.append('<tr><td> Remark :</td>  <td>' + remark + '</td></tr>');
                                ddo.append('<tr><td> Rate :</td>  <td>' + rate + '</td></tr>');
                            }

                        } else {

                            ADAte = ConvertIT(DOCTORINFO[sm].ActivityDate);
                            var DIVID = "NEWDIVDATEID" + nid;
                            var H2ID = "HEADID" + nid;
                            DTABLE = "NEWDTID" + nid;
                            DBODY = "NEWDBID" + nid;
                            STABLE = "NEWSTID" + nid;
                            SBODY = "NEWSBID" + nid;
                            OTABLE = "NEWOTID" + nid;
                            OBODY = "NEWOBID" + nid;
                            dd.append('<div data-role="collapsible" data-theme="f"  id=' + DIVID + ' data-content-theme="d" data-inset="false" style="width: 94%; padding-left: 12px;"><h3 id=' + H2ID + '>DCR    ' + getFormattedDate(ConvertIT(DOCTORINFO[sm].ActivityDate)) + '</h3><table style="width:100% ;margin-bottom: 20px;" id=' + DTABLE + '   data-role="table" data-mode="Refresh" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-popup-theme="a"  ><thead><tr class="ui-bar-a"><th style="width:40%">Brand </th><th  style="width:60%">Key Message</th></tr></thead><tbody id=' + DBODY + '></tbody></table><table style="width:100% ;margin-bottom: 20px;" id=' + STABLE + '   data-role="table" data-mode="Refresh" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-popup-theme="a"  ><thead><tr class="ui-bar-a"><th style="width:40%">Sample </th><th  style="width:60%">Quantity</th></tr></thead><tbody id=' + SBODY + '></tbody></table><table style="width:100% ;margin-bottom: 20px;" id=' + OTABLE + '   data-role="table" data-mode="Refresh" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-popup-theme="a"  ><thead><tr class="ui-bar-a"><th style="width:40%" >Others </th><th style="width:60%" > </th></tr></thead><tbody id=' + OBODY + '></tbody></table></div>');
                            nid++;
                            $("#" + DTABLE).table();
                            $("#" + DTABLE).table("refresh");
                            $("#" + STABLE).table();
                            $("#" + STABLE).table("refresh");
                            $("#" + OTABLE).table();
                            $("#" + OTABLE).table("refresh");
                            $("#" + DTABLE).hide();
                            $("#" + STABLE).hide();
                            $("#" + OTABLE).hide();
                            var KEY = "";
                            var POB = "";
                            if ($.trim(DOCTORINFO[sm].Section) == "Detailing") {
                                $("#" + DTABLE).show();
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    KEY = "Not Mentioned";
                                } else {
                                    KEY = $.trim(DOCTORINFO[sm].KeyMessage);
                                }
                                $("#" + DBODY).append('<tr><td>' + $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) + ' :</td>  <td>' + KEY + '</td></tr>');
                            } else if ($.trim(DOCTORINFO[sm].Section) == "Sampling")
                            {
                                $("#" + STABLE).show();
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    POB = "Not Mentioned";
                                } else {
                                    POB = $.trim(DOCTORINFO[sm].KeyMessage);
                                }

                                $("#" + SBODY).append('<tr><td>' + $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) + ' :</td>  <td>' + POB + '</td></tr>');
                            } else if ($.trim(DOCTORINFO[sm].Section) == "others")
                            {
                                $("#" + OTABLE).show();
                                var Obj = "";
                                var objC = "";
                                var req = "";
                                var reqd = "";
                                var rate = "";
                                var remark = "";
                                var ddo = $("#" + OBODY);
                                if ($.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == "" || $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == null || $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME) == undefined)
                                {
                                    Obj = "Not Mentioned";
                                } else {
                                    Obj = $.trim(DOCTORINFO[sm].PRODUCTGROUPNAME);
                                }
                                if ($.trim(DOCTORINFO[sm].KeyMessage) == "" || $.trim(DOCTORINFO[sm].KeyMessage) == null || $.trim(DOCTORINFO[sm].KeyMessage) == undefined)
                                {
                                    objC = "Not Mentioned";
                                } else {
                                    objC = $.trim(DOCTORINFO[sm].KeyMessage);
                                }
                                if ($.trim(DOCTORINFO[sm].Request) == "" || $.trim(DOCTORINFO[sm].Request) == null || $.trim(DOCTORINFO[sm].Request) == undefined)
                                {
                                    req = "Not Mentioned";
                                } else {
                                    req = $.trim(DOCTORINFO[sm].Request);
                                }
                                if ($.trim(DOCTORINFO[sm].RequestByDate) == "" || $.trim(DOCTORINFO[sm].RequestByDate) == null || $.trim(DOCTORINFO[sm].RequestByDate) == undefined)
                                {
                                    reqd = "Not Mentioned";
                                } else {
                                    reqd = $.trim(DOCTORINFO[sm].RequestByDate);
                                }
                                if ($.trim(DOCTORINFO[sm].REMARKS) == "" || $.trim(DOCTORINFO[sm].REMARKS) == null || $.trim(DOCTORINFO[sm].REMARKS) == undefined)
                                {
                                    remark = "Not Mentioned";
                                } else {
                                    remark = $.trim(DOCTORINFO[sm].REMARKS);
                                }
                                if ($.trim(DOCTORINFO[sm].RateCall) == "" || $.trim(DOCTORINFO[sm].RateCall) == null || $.trim(DOCTORINFO[sm].RateCall) == undefined)
                                {
                                    rate = "Not Mentioned";
                                } else {
                                    rate = $.trim(DOCTORINFO[sm].RateCall);
                                }
                                ddo.append('<tr><td> Objection :</td>  <td>' + Obj + '</td></tr>');
                                ddo.append('<tr><td> ObjectionCategory :</td>  <td>' + objC + '</td></tr>');
                                ddo.append('<tr><td> Request :</td>  <td>' + req + '</td></tr>');
                                ddo.append('<tr><td> RequestedDate :</td>  <td>' + getFormattedDate(ConvertIT(reqd)) + '</td></tr>');
                                ddo.append('<tr><td> Remark :</td>  <td>' + remark + '</td></tr>');
                                ddo.append('<tr><td> Rate :</td>  <td>' + rate + '</td></tr>');
                            }
                        }
                    }
                }
                $("#DCVISITDIVID").collapsibleset('refresh');
            },
            error: function (result) {
                var ele = document.getElementById("DCRWAITID");
                ele.style.display = 'none';
                var ele = document.getElementById("DCRNORECORDID");
                ele.style.display = 'block';
                if (result.status == 0) {
                }
            }
        });
    }
}

function getSalesMonth() {
    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT distinct " + TABLES.SALES.MONTH + " FROM " + TABLES.SALES.TABLE, [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#SALESMONTHID").empty();
            dd.append('<option value="0" selected>Select </option>');
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value="' + item[TABLES.SALES.MONTH] + '" selected>' + Months[item["Month"]] + ' </option>');
                }
                $('#SALESMONTHID').selectmenu();
                $('#SALESMONTHID').val("0");
                $('#SALESMONTHID').selectmenu('refresh', true);
            } else {
                $('#SALESMONTHID').selectmenu();
                $('#SALESMONTHID').val("0");
                $('#SALESMONTHID').selectmenu('refresh', true);
            }
        });
    });
}

function getKPIMonth() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT " + TABLES.EFFORT_KPI.MONTH + " FROM " + TABLES.EFFORT_KPI.TABLE, [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#EFFORTMONTHID").empty();
            dd.append('<option value="0" selected>Select </option>');
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value="' + item[TABLES.EFFORT_KPI.MONTH] + '" selected>' + Months[item[TABLES.EFFORT_KPI.MONTH]] + ' </option>');
                }
                $('#EFFORTMONTHID').selectmenu();
                $('#EFFORTMONTHID').val("0");
                $('#EFFORTMONTHID').selectmenu('refresh', true);
            } else {
            }
        });
    });
}

// checking the parameter table call plan exists for this user...
function CHECKCALLPLAN() {
//    console.log("  CHECKCALLPLAN function called  = " );
//    var DATE = getLastSunday();
    var DATE = "";
    if (($.session.get("LastActivityDate") === undefined) || ($.session.get("LastActivityDate") === "") || ($.session.get("LastActivityDate") === null)) {
        DATE = $.session.get("Date_of_Join");
    } else {
        DATE = $.session.get("LastActivityDate");
    }
    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.PARAMETER.TABLE + "  WHERE UPPER(" + TABLES.PARAMETER.PARTICULAR + ")=? LIMIT 1", ["CALL_PLAN"], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                //$("#CALLPLANDTRID").show();
                SELECTCALLPLAN(DATE);
           //      console.log("  CALL_PLAN  avilabel   " );
            } else {
               // $("#CALLPLANDTRID").hide();
             //   console.log("  CALL_PLAN Not avilabel   " );
            }
        });
    });
}
// checking the call information for current week exists in local db if not calling the wcf services
function SELECTCALLPLAN(DATE) {
    // console.log("  SELECTCALLPLAN function called  = " );
    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.CALLPLAN.TABLE + " ORDER BY " + TABLES.CALLPLAN.DATE + " LIMIT 1", [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if (new Date(item["DATE"]) > new Date(DATE)) {
                    } else {
                    //    console.log("Delete call plan functuion ");
                        DELETEALLPLAN(DATE);
                        GetCallPlan(DATE);
                    }
                }
            } else {
                GetCallPlan(DATE);
            }
        });
        tx.executeSql("SELECT * FROM " + TABLES.CALLPLANCHEMIST.TABLE + " ORDER BY " + TABLES.CALLPLANCHEMIST.DATE + " LIMIT 1", [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if (new Date(item["DATE"]) > new Date(DATE)) {
                    } else {
                        DELETECALLPLANCHEMIST(DATE);
                        GetCallPlanchemist(DATE);
                    }
                }
            } else {
                GetCallPlanchemist(DATE);
            }
        });
        tx.executeSql("SELECT * FROM " + TABLES.CALLPLANSTOCKIST.TABLE + " ORDER BY " + TABLES.CALLPLANSTOCKIST.DATE + " LIMIT 1", [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if (new Date(item["DATE"]) > new Date(DATE)) {
                    } else {
                        DELETECALLPLANSTOCKIST(DATE);
                        GetCallPlanstockist(DATE);
                    }
                }
            } else {
                GetCallPlanstockist(DATE);
            }
        });
    });
}
// deleting the call plan from local db after that week finished
function DELETEALLPLAN(DATE) {
  //  console.log("  DELETEALLPLAN function called  = " );
    dbCon.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.CALLPLAN.TABLE, [], Check, onError);
    });
}

function DELETECALLPLANCHEMIST(DATE) {
    //console.log("  DELETECALLPLANCHEMIST function called  = " );
    dbCon.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.CALLPLANCHEMIST.TABLE, [], Check, onError);
    });
}

function DELETECALLPLANSTOCKIST(DATE) {
     //  console.log("  DELETECALLPLANSTOCKIST function called  = " );
    dbCon.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.CALLPLANSTOCKIST.TABLE, [], Check, onError);
    });
}








