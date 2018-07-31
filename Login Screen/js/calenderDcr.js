$(function () {
    $('#headerWrapper').load('header.html', function () {
        $('#showBtn').hide();
        $('.headerText').text("Calender DCR");
        $('#menu-toggle').hide();
        $('#saveMenu').hide();
        $('#swipeRightBtn').hide();
        $('#swipeLeftBtn').hide();
        $('#activitySelection').hide();
        $('#backBtn').show();
    });
    var dbObject = new dbAccess();
    var jsonObj = [];
    $.when(dbObject.execute("Select * from " + TABLES.ENTERED_DATES.TABLE)).done(function (data) {
        var dataRows = data.rows;
        for (var i = 0; i < dataRows.length; i++) {
            var dataItem = dataRows.item(i);
            var item = {};
            if (dataItem[TABLES.ENTERED_DATES.ACTIVITY_PEROID] == "1") {
                item["title"] = "Full Day";
            }
            if (dataItem[TABLES.ENTERED_DATES.ACTIVITY_PEROID] == "2") {
                item["title"] = "First Half";
            }
            if (dataItem[TABLES.ENTERED_DATES.ACTIVITY_PEROID] == "3") {
                item["title"] = "Second Half";
            }
            item["start"] = dataItem[TABLES.ENTERED_DATES.ACTIVITY_DATE];
            item["end"] = dataItem[TABLES.ENTERED_DATES.ACTIVITY_DATE];
            jsonObj.push(item);
        }

        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultDate: new Date(),
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventBackgroundColor: "#ff0000",
            color: 'yellow',
            eventLimit: true, // allow "more" link when too many events
            events: jsonObj
        });

    });
});

$('#calendar').on('click', '.fc-widget-content td.fc-day', function (e) {
    //  $('#activityDate').val(moment($(this).attr('data-date')).format('DD-MMM-YYYY'));
   var dateFormate =ConvertIT($(this).attr('data-date'))
    $('#activityDateFromCalenderDcr').val(dateFormate);
    //  alert($(this).attr('data-date'));
    // $.mobile.navigate("index.html");
    $.session.set("ActivityDatefromCalender", dateFormate);
    window.location = "index.html";

});


$('#calendar').on('click', '.fc-day-top', function (e) {
    //  $('#activityDate').val(moment($(this).attr('data-date')).format('DD-MMM-YYYY'));
    e.preventDefault();
    e.stopPropagation();
    var dateFormate =ConvertIT($(this).attr('data-date'))
    $('#activityDateFromCalenderDcr').val(dateFormate);
    //  alert($(this).attr('data-date'));
    // $.mobile.navigate("index.html");
    $.session.set("ActivityDatefromCalender", dateFormate);
    window.location = "index.html";

});

function ConvertIT(input) {
    var d = new Date(input);
    var a = d.getFullYear();
    var b = ("0" + (d.getMonth() + 1)).slice(-2);
    var c = ("0" + d.getDate()).slice(-2);
    var e = b + '/' + c + '/' + a;
    console.log("ConvertIT =" + e);
    return e;
}


