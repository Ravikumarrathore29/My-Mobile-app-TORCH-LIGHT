$(function () {
    $('#headerWrapper').load('header.html', function () {
        $('#showBtn').hide();
        $('.headerText').text("Entered Dates");
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
