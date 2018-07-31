var dbObject = new dbAccess();
document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);
$(function () {
    assignEvents();
    loadCategory();
    loadRating();
    $('#headerWrapper').load('header.html', function () {
        $('.headerText').text("Feedback");
        $('#showBtn').hide();
        $('#menu-toggle').hide();
    });
});

function assignEvents() {
    $(".form-control").keyup(function () {

        var a = $(this).val();
        if (a.length >= 0) // error here?
        {
            $(this).removeClass("empty");
        } else
            $(this).addClass("empty");
    });
    $('#submitButton').click(function (event) {

        if ($.session.get("customerDCRSLNNO") === undefined || $.session.get("customerDCRSLNNO") === "") {
            // $('#swipeRightBtn').click();
            alert("Please select the customer");
            e.stopPropagation();
        } else {

            var empty_count = 0;
            $('#textBoxError').remove();
            $('#textBoxError').remove();
            $('#textBoxError').remove();
            $('#dropDownError').remove();
            $('#dropDownError').remove();
            $('#dropDownError').remove();
            $('#dropDownError').remove();
            $('.requiredTextbox').each(function (event) {
                if ($(this).val().length === 0) {
                    $(this).after('<label  id="textBoxError"  style="color: #F1520E;">Please enter the field</label>');
                    empty_count = 1;
                }
            });
            $('.requireDropdown').next('.tooltip_outer').hide();
            $('.requireDropdown').each(function () {
                $(this).next('.tooltip_outer').hide();
                if ($('option:selected', $(this)).index() === 0) {
                    $(this).after('<label  id="dropDownError"  style="color: #F1520E;">Please select this field</label>');
                    empty_count = 1;
                } else {
                    $(this).next('.tooltip_outer').hide();
                }
            });
            if (empty_count === 1) {
                event.preventDefault();
            } else {
                updateFeedback();
            }

        }
    });
}


function loadCategory() {
    var selectQuery = "SELECT * FROM " + TABLES.CATEGORY.TABLE + " ORDER BY " + TABLES.CATEGORY.CATEGORY_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#drspeciality").selectpicker();
        var dd = $("#drspeciality").empty();
        dd.append('<option value="">Select Category </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.CATEGORY.CATEGORY_ID] + '"> ' + item[TABLES.CATEGORY.CATEGORY_NAME] + '</option>');
            }
        } else {
            alert("Category Table is not available");
        }
        $("#drspeciality").selectpicker('refresh');
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadRating() {
    var selectQuery = "SELECT * FROM " + TABLES.RATING.TABLE + " ORDER BY " + TABLES.RATING.RATING_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#drratecall").selectpicker();
        var dd = $("#drratecall").empty();
        dd.append('<option value="">Select Rate </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.RATING.RATING_ID] + '"> ' + item[TABLES.RATING.RATING_NAME] + '</option>');
            }
        } else {
            alert("Rating Table is not available");
        }
        $("#drratecall").selectpicker('refresh');
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}



function updateFeedback() {
    var objectionValue = $('#drname').val();
    var dropDownCategorySelected = $('#drspeciality option:selected').val();
    var dropDownRateSelected = $('#drratecall option:selected').val();
    var remarkValue = $('#PotentialName').val();

    if (objectionValue == "")
    {
        alert("Please fill Objection / Comments Textbox  . ");
        e.stopPropagation();
    } else if (dropDownCategorySelected == "" || dropDownCategorySelected == undefined)
    {
        alert("Please Select Category  . ");
        e.stopPropagation();
    } else if (dropDownRateSelected == "" || dropDownRateSelected == undefined)
    {
        alert("Please Select Rate . ");
        e.stopPropagation();
    } else if (remarkValue == "")
    {
        alert("Please fill Remarks . ");
        e.stopPropagation();
    } else
        (objectionValue !== "" || dropDownCategorySelected !== "" || dropDownRateSelected !== "" || remarkValue !== "")
    {
        var updateQuery = "UPDATE " + TABLES.DCR_DOCTOR.TABLE + " SET "
                + TABLES.DCR_DOCTOR.OBJECTION + "=?,"
                + TABLES.DCR_DOCTOR.OBJECTION_CATEGORY + "=?,"
                + TABLES.DCR_DOCTOR.RATE + "=?,"
                + TABLES.DCR_DOCTOR.REMARK
                + "=? WHERE " + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + "=? AND " + TABLES.DCR_DOCTOR.DCR_SL_NO + "=?";
        var updateValues = new Array(objectionValue, dropDownCategorySelected, dropDownRateSelected, remarkValue, $.session.get("customerDCRSLNNO"), $.session.get("ActivityId"));
        $.when(dbObject.execute(updateQuery, updateValues)).done(function (data) {
            alert(" Feedback Submited for Customer Name :- " + $.session.get("DoctorName"));
            $('#drname').val("");
            $('#drspeciality').selectpicker();
            $('#drspeciality').val(0);
            $('#drspeciality').selectpicker('refresh');

            $('#drratecall').selectpicker();
            $('#drratecall').val(0);
            $('#drratecall').selectpicker('refresh');

            $('#PotentialName').val("");
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });
    }
}


function errorMessage(_message) {
    alert(_message);
}