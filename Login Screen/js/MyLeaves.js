
function ConvertIT(input) {

    var d = new Date(input);
    var a = d.getFullYear();

    var b = ("0" + (d.getMonth() + 1)).slice(-2);
    var c = ("0" + d.getDate()).slice(-2);
    var e = b + '/' + c + '/' + a;
    return e;
}



$(document).ready(function () {

    $("#DATEFROMID").click(function () {

        $('#balanceID').val("");
        $('#ApplyID').val("");

        $('#required_LEAVESSID').val("0");
        $('#required_LEAVESSID').selectmenu('refresh', true);

    });

    $("#DATETOID").click(function () {
        $('#balanceID').val("");
        $('#ApplyID').val("");

        $('#required_LEAVESSID').val("0");
        $('#required_LEAVESSID').selectmenu('refresh', true);

    });

    $.session.set("PASS", 'F');
    var Period;
    DisplayLEAVETYPElist();
    $('.required_LEAVES').keypress(function () {
        $(this).next('#ErrorD').remove();
    });

    $('.required_LEAVESD').keypress(function () {
        $(this).next('#ErrorD').remove();
    });
    $('.required_LEAVES').mousedown(function () {
        $(this).next('#ErrorD').remove();
    });
    $('.required_LEAVESS').change(function () {
        $(this).next('#ErrorE').remove();
        DisplayLEAVETYPEBList();
    });
    // for checking the all selection are made or not
    $("#MyleaveSubmitID").click(function (event) {

        var empty_count = 0;
        // variable to store error occured status
        $('#ErrorE').remove();
        $('#ErrorD').remove();
        $('#ErrorD').remove();
        $('#ErrorD').remove();
        $('#ErrorD').remove();
        $('.required_LEAVES').each(function (event) {
            if ($(this).val().length === 0) {

                $(this).after('<label  id="ErrorD"  style="color: #F1520E;">Please enter</label>');
                empty_count = 1;
            }
        });
        $('.required_LEAVESD').each(function (event) {
            if ($(this).val().length === 0) {

                $(this).after('<label  id="ErrorD"  style="color: #F1520E;">Please enter</label>');
                empty_count = 1;
            }
        });
        $('.required_LEAVESS').each(function () {
            if ($('option:selected', $(this)).index() === 0) {

                $(this).after('<label  id="ErrorE"  style="color: #F1520E;">Please Select</label>');
                empty_count = 1;
            } else {
                $(this).next('#ErrorE').hide();
            }
        });
        if (empty_count === 1) {
            event.preventDefault();
        } else {
            if ((new Date($('#DATEFROMID').val())) < new Date(ConvertIT(new Date()))) {

                if ((new Date($('#DATETOID').val())) >= new Date(ConvertIT(new Date()))) {
                    alert("Please change the to date");
                } else {
                    $.session.set("PASS", 'T');
                    if ($('#DATEFROMID').val() == $("#DATETOID").val())
                    {
//                    if($("#DATEFROMIDFLIP").val()==$("#DATETOIDFLIP").val()){
//                                        GETLeavesInfo("0.5");
//                                           }
//                    else{
                        if (($("#DATEFROMIDFLIP").val() == "PM") && ($("#DATETOIDFLIP").val() == "AM"))
                        {
                            alert("Please change your selection");

                        } else {
                            GETLeavesInfo($("#ApplyID").val());
                        }
//                            else{
//                                           GETLeavesInfo("1.0");
//                                }
//                   
//                        }       
                    } else {
//                        var date1 = new Date($('#DATEFROMID').val());
//                        var date2 = new Date($("#DATETOID").val());
//                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
//                        var NDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
//                        var NEWDAYS;
//                        if($("#DATEFROMIDFLIP").val()==$("#DATETOIDFLIP").val()){
//                                        NEWDAYS= (parseFloat(NDays)+parseFloat(0.5)).toFixed(1);
//                                           }
//                        else if(($("#DATEFROMIDFLIP").val()=="AM")&& ($("#DATETOIDFLIP").val()=="PM")){
//                                    NEWDAYS= (parseFloat(NDays)+parseFloat(1.0)).toFixed(1);
//                                   
//                                 }
//                                 
//                        else if(($("#DATEFROMIDFLIP").val()=="PM")&& ($("#DATETOIDFLIP").val()=="AM")){
//                                    NEWDAYS= parseFloat(NDays).toFixed(1);
//                                 }
                        GETLeavesInfo($("#ApplyID").val());


                    }
                }

            } else {
                $.session.set("PASS", 'F');
                if ($('#DATEFROMID').val() == $("#DATETOID").val())
                {
//                    if($("#DATEFROMIDFLIP").val()==$("#DATETOIDFLIP").val()){
//                                        GETLeavesInfo("0.5");
//                                           }
//                    else{
                    if (($("#DATEFROMIDFLIP").val() == "PM") && ($("#DATETOIDFLIP").val() == "AM"))
                    {
                        alert("Please change your selection");

                    } else {
                        GETLeavesInfo($("#ApplyID").val());
                    }
//                            else{
//                                           GETLeavesInfo("1.0");
//                                }
//                   
//                        }       
                } else {
//                        var date1 = new Date($('#DATEFROMID').val());
//                        var date2 = new Date($("#DATETOID").val());
//                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
//                        var NDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
//                        var NEWDAYS;
//                        if($("#DATEFROMIDFLIP").val()==$("#DATETOIDFLIP").val()){
//                                        NEWDAYS= (parseFloat(NDays)+parseFloat(0.5)).toFixed(1);
//                                           }
//                        else if(($("#DATEFROMIDFLIP").val()=="AM")&& ($("#DATETOIDFLIP").val()=="PM")){
//                                    NEWDAYS= (parseFloat(NDays)+parseFloat(1.0)).toFixed(1);
//                                   
//                                 }
//                                 
//                        else if(($("#DATEFROMIDFLIP").val()=="PM")&& ($("#DATETOIDFLIP").val()=="AM")){
//                                    NEWDAYS= parseFloat(NDays).toFixed(1);
//                                 }
                    GETLeavesInfo($("#ApplyID").val());


                }
            }
        }





    });
})
// select option for  leave type 
function DisplayLEAVETYPElist() {

    var request = {Company_ID: $.session.get("Comapny_ID")}
    var jsondata = JSON.stringify(request);
    //MapptomainRCPA
    $.ajax({
        type: "POST",
        url: $.session.get("URL") + "GETLEAVETYPEMaster",
        data: jsondata,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processdata: true,
        crossDomain: true,
        success: function (result) {

            var PARAMETER;
            PARAMETER = getJsonObject(result);
            var dd = $("#required_LEAVESSID");
            for (var doc in PARAMETER)
            {
                dd.append('<option value=' + $.trim(PARAMETER[doc].PID) + '>' + $.trim(PARAMETER[doc].VALUE) + '</option>');
            }


        },
        error: function (result) {

        }
    });
}

// dispalying the leave balance depending on leave type selection from local db....
function DisplayLEAVETYPEBList() {



    var empty_count = 0;
    // variable to store error occured status
    $('#ErrorE').remove();
    $('#ErrorD').remove();
    $('#ErrorD').remove();
    $('#ErrorD').remove();
    $('#ErrorD').remove();
    $('.required_LEAVES').each(function (event) {
        if ($(this).val().length === 0) {

            $(this).after('<label  id="ErrorD"  style="color: #F1520E;">Please enter</label>');
            empty_count = 1;
        }
    });


    if (empty_count === 1) {
        $('#required_LEAVESSID').selectmenu();
        $('#required_LEAVESSID').val("0");
        $('#required_LEAVESSID').selectmenu('refresh', true);
        event.preventDefault();
    } else {
        var validity = true;

        if ($('#DATEFROMID').val() == $("#DATETOID").val())
        {

            if (($("#DATEFROMIDFLIP").val() == "PM") && ($("#DATETOIDFLIP").val() == "AM"))
            {
                alert("Please change your selection");
                validity = false;
                $('#required_LEAVESSID').selectmenu();
                $('#required_LEAVESSID').val("0");
                $('#required_LEAVESSID').selectmenu('refresh', true);
            } else {
                GETLeavesInfoCal();
                validity = true;
            }

        } else {
            var date1 = new Date($('#DATEFROMID').val());
            var date2 = new Date($("#DATETOID").val());

            if (date1 > date2) {
                alert("Selected Dates are Invalid");
                validity = false;
                $('#required_LEAVESSID').selectmenu();
                $('#required_LEAVESSID').val("0");
                $('#required_LEAVESSID').selectmenu('refresh', true);
            } else {
                GETLeavesInfoCal();
                validity = true;
            }
        }

        $('#ErrorD').remove();
        var Dt = new Date();
        var dsleavebalance = 0;
        if (validity) {

            if (navigator.onLine) {

                var request = {EmployeeID: $.session.get("User_ID"), leave_type: $("#required_LEAVESSID").val()}
                var jsondata = JSON.stringify(request);
                //MapptomainRCPA
                $.ajax({
                    type: "POST",
                    async: false,
                    url: $.session.get("URL") + "getEmployeePeriodicity",
                    data: jsondata,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processdata: true,
                    crossDomain: true,
                    success: function (result) {

                        var PARAMETER;
                        PARAMETER = GetJsonObject(result);
                        if (result == "") {


                            GetleaveBalance($.session.get("User_ID"), Dt.getFullYear(), $("#required_LEAVESSID").val(), Dt);



                        }
                        for (var doc in PARAMETER)
                        {
                            Period = $.trim(PARAMETER[doc].periodicity).toUpperCase();

                            if (Period == "MONTH") {

                                if ($("#DATEFROMID").val() == "") {
                                    $("#DATEFROMID").after('<label  id="ErrorD"  style="color: #F1520E;">Please enter</label>');
                                    return;
                                }
                            }

                            if (Period == "YEAR")
                            {

                                GetleaveBalance($.session.get("User_ID"), Dt.getFullYear(), $("#required_LEAVESSID").val(), Dt);

                            } else
                            if (Period == "MONTH")
                            {
                                GetleaveBalance($.session.get("User_ID"), Dt.getFullYear(), $("#required_LEAVESSID").val(), $("#DATEFROMID").val());

                            }




                        }



                    },
                    error: function (result) {

                    }
                });
            }


        }

    }








}
// calculating the leave balance....
function GETLeavesInfo(Aval) {


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DAILY_REPORT.TABLE + " ORDER BY  " + TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME + "," + TABLES.DAILY_REPORT.PERIOD + " DESC LIMIT 1 ", [], function (tx, result) {
            dataset = result.rows;


            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    if (item["sync"] == "S") {

                        if (((Date.parse(($('#DATEFROMID').val()))) == (Date.parse((item["activity_date_time"])))) && ((item["period"] == '1') || (item["period"] == '3')))
                        {
                            alert("DCR entered for selected date");
                        } else if (((Date.parse(($('#DATEFROMID').val()))) == (Date.parse((item["activity_date_time"])))) && ((item["period"] == '2')))
                        {
                            if (($("#DATEFROMIDFLIP").val() == "PM") && ($("#DATETOIDFLIP").val() == "PM"))
                            {
                                var Applv = parseFloat(Aval).toFixed(1);
                                var AvalL = parseFloat($("#balanceID").val()).toFixed(1);

                                var ApplvN = (parseFloat(Applv).toFixed(1) * 10)
                                var AvalLN = (parseFloat(AvalL).toFixed(1) * 10)

                                if ($("#required_LEAVESSID :selected").text() == "LOP" || $("#required_LEAVESSID :selected").text() == "lop" || $("#required_LEAVESSID :selected").text() == "Lop") {
                                    CheckExistinigDate(Applv);
                                } else if (AvalLN < ApplvN) {
                                    alert("You don't have enough Leave balance, You applied for " + Aval + " days")

                                } else {

                                    CheckExistinigDate(Applv);
                                    // InsertTOLeaves(Applv)
                                }
                            } else {
                                alert("Please change your period")
                            }

                        } else if (((new Date($('#DATEFROMID').val())) < (new Date(item["activity_date_time"])))) {

                            alert("DCR Completed for selected date");

                        } else {
                            var activity = new Date(item["activity_date_time"]);
                            activity.setDate(activity.getDate() + 1)
                            if (((Date.parse(($('#DATEFROMID').val()))) == (Date.parse((ConvertIT(activity)))))) {
                                var Applv = parseFloat(Aval).toFixed(1);
                                var AvalL = parseFloat($("#balanceID").val()).toFixed(1);

                                var ApplvN = (parseFloat(Applv).toFixed(1) * 10)
                                var AvalLN = (parseFloat(AvalL).toFixed(1) * 10)

                                if ($("#required_LEAVESSID :selected").text() == "LOP" || $("#required_LEAVESSID :selected").text() == "lop" || $("#required_LEAVESSID :selected").text() == "Lop") {

                                    CheckExistinigDate(Applv);
                                } else if (AvalLN < ApplvN) {
                                    alert("You don't have enough Leave balance, You applied for " + Aval + " days")

                                } else {

                                    CheckExistinigDate(Applv);
                                    // InsertTOLeaves(Applv)
                                }
                            } else if (((Date.parse(($('#DATEFROMID').val()))) < (Date.parse((ConvertIT(activity)))))) {
                                alert("Please Complete the DCR or Sync the data");
                            } else {
                                var Applv = parseFloat(Aval).toFixed(1);
                                var AvalL = parseFloat($("#balanceID").val()).toFixed(1);

                                var ApplvN = (parseFloat(Applv).toFixed(1) * 10)
                                var AvalLN = (parseFloat(AvalL).toFixed(1) * 10)

                                if ($("#required_LEAVESSID :selected").text() == "LOP" || $("#required_LEAVESSID :selected").text() == "lop" || $("#required_LEAVESSID :selected").text() == "Lop") {

                                    CheckExistinigDate(Applv);
                                } else if (AvalLN < ApplvN) {
                                    alert("You don't have enough Leave balance, You applied for " + Aval + " days")

                                } else {

                                    CheckExistinigDate(Applv);
                                    // InsertTOLeaves(Applv)
                                }
                            }
                        }


                    } else {
                        alert("Please Sync the DCR record first");
                    }


                }

            } else {

                if ((new Date($('#DATEFROMID').val())) < (new Date($.session.get("Date_of_Join"))))
                {
                    alert("Selected Date is invaild");
                } else {
                    var Applv = parseFloat(Aval).toFixed(1);
                    var AvalL = parseFloat($("#balanceID").val()).toFixed(1);

                    var ApplvN = (parseFloat(Applv).toFixed(1) * 10)
                    var AvalLN = (parseFloat(AvalL).toFixed(1) * 10)
                    if ($("#required_LEAVESSID").val() == "4") {
                        CheckExistinigDate(Applv);
                    } else if (AvalLN < ApplvN) {
                        alert("You don't have enough Leave balance, You applied for " + Aval + " days");

                    } else {

                        CheckExistinigDate(Applv);
                        // InsertTOLeaves(Applv)
                    }
                }



            }
        });
    });
//    
//       var Applv = parseFloat(Aval).toFixed(1);
//       var AvalL = parseFloat($("#balanceID").val()).toFixed(1);
//
//var ApplvN=(parseFloat(Applv).toFixed(1)*10)
//var AvalLN=(parseFloat(AvalL).toFixed(1)*10)
//if($("#required_LEAVESSID").val()=="4"){
//     CheckExistinigDate(Applv);
//}
//  else if( AvalLN < ApplvN){
//      alert("You don't have enough Leave balance, You applied for "+Aval+" days")
//      
//   }
//   else{
//       
//       CheckExistinigDate(Applv);
//    // InsertTOLeaves(Applv)
//   }


}
//syncicing the applied leaves to server.....
function InsertTOLeaves(APL) {
    var request = {Employee_ID: $.session.get("User_ID"), Leave_Type: $("#required_LEAVESSID").val(), Reason: $("#reasonID").val(), LeaveAvailable: $("#balanceID").val(), FromDate: $("#DATEFROMID").val(), ToDate: $("#DATETOID").val(), FromPeriod: $("#DATEFROMIDFLIP").val(), ToPeriod: $("#DATETOIDFLIP").val(), Duration: APL, PASS: $.session.get("PASS")};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "ADDLEAVEDETAILS",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {


                if (result == "true") {
                    alert("Leave submitted for approval");
                    window.location = "EHome.html";
                } else {
                    alert("Unable to handle your request");
                }

            },
            error: function (result) {
                alert("Unable to handle your request");
            }
        });
    }




}
function CheckRL() {
    window.location = "EHome.html";
}

function GetleaveBalance(UserID, Period, Type, Date) {
    if (navigator.onLine) {
        var request = {EmployeeID: UserID, Period: Period, Type: Type, Date: Date}
        var jsondata = JSON.stringify(request);
        //MapptomainRCPA
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetleaveBalance",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
                var dsleavebalance = 0.00;
                var PARAMETER;
                PARAMETER = GetJsonObject(result);
                for (var doc in PARAMETER)
                {
                    dsleavebalance = $.trim(PARAMETER[doc].Leave_Balance);
                }
                $("#balanceID").val(dsleavebalance);
            },
            error: function (result) {
            }
        });
    }
}


function  GETLeavesInfoCal() {
    if (navigator.onLine) {
        var Count = "";
        var request = {EmployeeID: $.session.get("User_ID"), fromdate: $('#DATEFROMID').val(), todate: $("#DATETOID").val(), fromtime: $("#DATEFROMIDFLIP").val(), totime: $("#DATETOIDFLIP").val()}
        var jsondata = JSON.stringify(request);
        //MapptomainRCPA
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "Calculateleave",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
                var PARAMETER;
                PARAMETER = GetJsonObject(result);
                for (var doc in PARAMETER)
                {
                    Count = $.trim(PARAMETER[doc].count);
                }
                $("#ApplyID").val(Count);
                //   GETLeavesInfo($("#ApplyID").val());
            },
            error: function (result) {
            }
        });
    }
}


function  CheckExistinigDate(Applv) {
    if (navigator.onLine) {
        var Count;
        var request = {EmployeeID: $.session.get("User_ID"), fromdate: $('#DATEFROMID').val(), todate: $("#DATETOID").val(), fperiod: $("#DATEFROMIDFLIP").val(), tperiod: $("#DATETOIDFLIP").val()}
        var jsondata = JSON.stringify(request);
        //MapptomainRCPA
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "CheckExistinigDate",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
                var PARAMETER;
                PARAMETER = GetJsonObject(result);
                for (var doc in PARAMETER)
                {
                    Count = $.trim(PARAMETER[doc].Status);
                }
                if (Count == "Exist")
                {
                    alert("Leave already applied for selected date !");
                } else {

                    if (Applv == "0.0")
                    {
                        alert("Leave can't applies for selected date !");
                    } else {
                        InsertTOLeaves(Applv);
                    }
                }
            },
            error: function (result) {
            }
        });
    }
}