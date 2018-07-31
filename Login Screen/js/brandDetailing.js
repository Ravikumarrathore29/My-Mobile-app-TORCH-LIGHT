var dbObject = new dbAccess();
var progValue = 0;
var addedSamplesIssuesCount = 0;
document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);
$(function () {
    assignEvents();
    loadBrand();
    $('#headerWrapper').load('header.html', function () {
        $('.headerText').text("Brand Detailing");
        $('#showBtn').hide();
        $('#menu-toggle').hide();
    });
    displayAddedItems();
});

function assignEvents() {
   $("#brandDetailingDiv").hide();
    $(".form-control").keyup(function () {

        var a = $(this).val();
        if (a.length >= 0) // error here?
        {
            $(this).removeClass("empty");
        } else
            $(this).addClass("empty");
    });

    $('.autoCompleteInput').focusin(function () {
        $(this).next().css('display', 'block');
    });

    $('#DropDownBrand').change(function (e) {
        processKeyMessage();
    });

    $('#addContent').click(function (e) {
        if ($.session.get("customerDCRSLNNO") === undefined || $.session.get("customerDCRSLNNO") === "") {
            $('#swipeRightBtn').click();
            alert("Please select the customer");
              $("#brandDetailingDiv").hide();
            e.stopPropagation();
        } else {
            SaveBrandKey();
        }
    });

    $('#contacts').change(function () {
        if ($('#contacts').is(':checked')) {
            $('.addedItemChecked').prop('checked', true);
        } else {
            $('.addedItemChecked').prop('checked', false);
        }
        $('.addedItemChecked').change();
    });

    $('#addedSamples').on('change', '.addedItemChecked', function () {
        var checked = 0;
        $('.addedItemChecked').each(function () {
            if ($(this).is(':checked')) {
                checked = 1;
            }
        });
        if (checked) {
            $('#deleteItemWrapper').removeClass('hideDelete');
        } else {
            $('#deleteItemWrapper').addClass('hideDelete');
        }
    });

    $('#deleteItem').click(function () {
        var checkedLength = $('.addedItemChecked:checked').length;
        var i = 0;
        $('.addedItemChecked').each(function () {
            if ($(this).is(':checked')) {
                i++;
                deleteAddedSKU($(this).val(), i, checkedLength);
            }
        });
    });
        
}

function deleteAddedSKU(_sampleId, _currentItem, _length) {
    var _sampleArray = _sampleId.split("_");
    var deleteQuery = "DELETE FROM " + TABLES.DCRDDETAILING.TABLE + " WHERE " + TABLES.DCRDDETAILING.BRAND_ID + "=? AND " + TABLES.DCRDDETAILING.KEY_MESSAGE + "=? AND " + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + "=?";
    var deleteValue = new Array(_sampleArray[0], _sampleArray[1], $.session.get("customerDCRSLNNO"));
    $.when(dbObject.execute(deleteQuery, deleteValue)).done(function (data) {
        if (_currentItem === _length) {
            displayAddedItems();
        }
    });
}

function  SaveBrandKey() {
    var DropDownBrandSelected = $('#DropDownBrand option:selected').val();
    var DropDownKeyValue = $('#DropDownKey').val();
    if (DropDownBrandSelected === "" || DropDownBrandSelected === undefined)
    {
        alert("Please select Brand Textbox  . ");
    } else if (DropDownKeyValue === "")
    {
        alert("Please select Key Message Textbox  . ");
    } else if (DropDownBrandSelected !== "" && DropDownKeyValue !== "")
    {
          $("#brandDetailingDiv").show();
        var selectQuery = "SELECT * FROM " + TABLES.DCRDDETAILING.TABLE + " WHERE " +
                TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + "=? and " + TABLES.DCRDDETAILING.BRAND_ID + "=?";
        var selectValues = new Array($.session.get("customerDCRSLNNO"), DropDownBrandSelected);
        $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
            var resultRows = data.rows;
            if (resultRows.length > 0) {
                alert("Brand already added for the customer.");
            } else {
                var insertQuery = "INSERT INTO " + TABLES.DCRDDETAILING.TABLE + " ( " + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + "," + TABLES.DCRDDETAILING.BRAND_ID + "," + TABLES.DCRDDETAILING.KEY_MESSAGE + " ) VALUES (?,?,?)";
                var insertValues = new Array($.session.get("customerDCRSLNNO"), DropDownBrandSelected, DropDownKeyValue);
                $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
//        var resultSetLength = data.rows.length;

                    $.when($('#addedSamples').append(getAppendContent())).then(function () {
//                initSignCanvas(addedSamplesIssuesCount);
                        $('#DropDownBrand').selectpicker();
                        $('#DropDownBrand').val("0");
                        $('#DropDownBrand').selectpicker('refresh');

                        $('#DropDownKey').selectpicker();
                        $('#DropDownKey').val("0");
                        $('#DropDownKey').selectpicker('refresh');
                    });

                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        });

    }
}

function getAppendContent() {

//    var appendData = '<div class="row" style="margin-top: 10px">' +
//            ' <div class="form-group form-material floating col-xs-6" style="margin-left: -7px;">' +
//            ' <select  style=" border-color:#eee;"  class="form-control drspecialityload  selectpicker" name="name" data-role="none" data-live-search="true"  id="DropDownBrand"  > </select>' +
//            ' <label class="floating-label" for="inputName"> Brand<span style="color: Red">*</span></label>' +
//            ' </div>' +
//            '<div class="form-group form-material floating col-xs-6" style="    margin-left: -7px;">' +
//            '  <select style=" border-color:#eee;"  class="form-control drqualificationload selectpicker" name="name" data-role="none" data-live-search="true"  id="DropDownKey"  > </select>' +
//            '<label class="floating-label" for="inputName">Key Message<span style="color: Red">*</span></label>' +
//            '</div>' +
//            '</div>';
//    loadBrand();
//    processKeyMessage();
//  var appendData = ' < div class = "row" style = "margin-top: 10px" > '+
//        ' < div class = "form-group form-material floating col-xs-6" style = "margin-left: -7px;" >'+
//        ' < select  style = " border-color:#eee;"  class = "form-control drspecialityload selectpicker" name = "name" data - role = "none" data - live - search = "true"  id = "DropDownBrand" > '+
//        ' < /select> '+
//        ' < label class = "floating-label" for = "inputName" > Brand < span style = "color: Red" > * < /span></label > '+
//        ' < /div> '+
//
//        ' < div class = "form-group form-material floating col-xs-6" style = "    margin-left: -7px;" > '+
//        ' < select style = " border-color:#eee;"  class = "form-control drqualificationload selectpicker" name = "name" data - role = "none" data - live - search = "true"  id = "DropDownKey" > '+
//        ' < /select> '+
//       ' < label class = "floating-label" for = "inputName" > Key Message < span style = "color: Red" > * < /span></label > '+
//        ' < /div> '+
//
//        '< /div> ';

//            '<div id="div_signcontract" class="col-xs-6">' +
//            '     <canvas id="canvas"  style="width: 90%;height: 102px; border: 2px solid rgb(1px, 1px,1px );float: left">Canvas is not supported</canvas>' +
//            '   </div>' +
//            '</div>';

    addedSamplesIssuesCount++;
    var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
            '<div class="col-xs-2" style="margin-bottom:20px;padding-top: 10px;">' +
            '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
            '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + $('#DropDownBrand').val() + "_" + $('#DropDownKey').val() + '">' +
            '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
            '</span>' +
            '</div>' +
            '<div class="col-xs-5" style="margin-bottom:20px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#DropDownBrand :selected').text() + '</p>' +
            '</div>' +
            '<div class="col-xs-5" style="margin-bottom:20px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#DropDownKey :selected').text() + '</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    return appendData;
}



function loadBrand() {
    var selectQuery = "SELECT * FROM " + TABLES.PRODUCTGROUPS.TABLE + " ORDER BY " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#DropDownBrand").selectpicker();
        var dd = $("#DropDownBrand").empty();
        dd.append('<option value="">Select Brand </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID] + '"> ' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</option>');
            }
        } else {
            alert("Brand Table is not available");
        }
        $("#DropDownBrand").selectpicker('refresh');

    }).fail(function (error) {
//        errorMessage(error.message.toString());
        alert("Problem in  Brand");
    });
}

function processKeyMessage() {
    var dropDownBrandSelected = $('#DropDownBrand').val();

    var insertQuery = "SELECT " + TABLES.KEY_MSG.KEY_CODE + "," + TABLES.KEY_MSG.KEY_ID + " FROM " + TABLES.KEY_MSG.TABLE + " WHERE " + TABLES.KEY_MSG.BRAND_ID + " = ?";
    var insertValues = new Array(dropDownBrandSelected);
    $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
        var resultLength = data.rows.length;
        $("#DropDownKey").selectpicker();
        var dd = $("#DropDownKey").empty();
        dd.append('<option value="">Auto Select Key </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultLength > 0) {
            for (var i = 0, item = null; i < resultLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.KEY_MSG.KEY_ID] + '"> ' + item[TABLES.KEY_MSG.KEY_CODE] + '</option>');
            }
        } else {
            alert("Key Message is not available");
        }
        $("#DropDownKey").selectpicker('refresh');
    }).fail(function (error) {
//            errorMessage(error.message.toString());
        alert("Problem in Key Message");
    });

}

function errorMessage(_message) {
    alert(_message);
}

function disableLinks() {
    if ($($('[id="DropDownBrand"]')).size() > 1) {
        for (var i = 1; i < $($('[id="DropDownBrand"]')).size(); i++) {
            $($('[id="DropDownBrand"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="DropDownKey"]')).size(); i++) {
            $($('[id="DropDownKey"]')[i]).prop('disabled', true);
        }
    }
}

function displayAddedItems() {
    var selectQuery = "SELECT * FROM " + TABLES.DCRDDETAILING.TABLE + " DS INNER JOIN " +
            TABLES.KEY_MSG.TABLE + " S ON DS." + TABLES.DCRDDETAILING.KEY_MESSAGE + " = S." + TABLES.KEY_MSG.KEY_ID +
            " INNER JOIN " + TABLES.PRODUCTGROUPS.TABLE + " P ON DS." + TABLES.DCRBRANDORDER.BRAND_ID + "= P." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID +
            " WHERE DS." + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + " = ?";
    var selectValues = new Array($.session.get('customerDCRSLNNO'));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $('#addedSamples').empty();
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                addedSamplesIssuesCount++;
                var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
                        '<div class="col-xs-2" style="margin-bottom:10px;padding-top: 10px;">' +
                        '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
                        '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + item[TABLES.DCRDDETAILING.BRAND_ID] + "_" + item[TABLES.DCRDDETAILING.KEY_MESSAGE] + '">' +
                        '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
                        '</span>' +
                        '</div>' +
                        '<div class="col-xs-5" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-5" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.KEY_MSG.KEY_CODE] + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#addedSamples').append(appendData);
            }
        }
        $('#deleteItemWrapper').addClass('hideDelete');
    });

}