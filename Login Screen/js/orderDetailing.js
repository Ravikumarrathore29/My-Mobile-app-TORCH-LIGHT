var dbObject = new dbAccess();

document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);
var addedSamplesIssuesCount = 0;
$(function () {
    assignEvents();
//    loadStockist();
    loadBrand();
    $('#headerWrapper').load('header.html', function () {
        $('.headerText').text("Order Taking");
        $('#showBtn').hide();
        $('#menu-toggle').hide();
    });
    displayAddedItems();
});

function assignEvents() {
     $("#orderDetailngDiv").hide();
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

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

//    $('.autoCompleteInput').focusout(function () {
//        $(this).next().css('display', 'none');
//    });

    $('#addContent').click(function (e) {
        if ($.session.get("customerDCRSLNNO") === undefined || $.session.get("customerDCRSLNNO") === "") {
            $('#swipeRightBtn').click();
            alert("Please select the customer");
            $("#orderDetailngDiv").hide();
            e.stopPropagation();


        } else {
            saveOrderDetails();
        }
//        $('#drSpecialityWrapper').before(getAppendContent());

    });


    $('#drqualification').delegate('li a ', 'click', function () {
        $(".drqualificationload").attr("data", "");
        $("#drQualificationInput").val($(this).text());
        $(".drqualificationload").attr("data", $(this).attr("value"));
        $("#drqualification").hide();
        $('.drqualificationload').removeClass("empty");
    });

    $("#drspeciality li a").click(function () {
        $(".drspecialityload").attr("data", "");
        $("#drSpecialityInput").val($(this).text());
        $(".drspecialityload").attr("data", $(this).attr("value"));
        $("#drspeciality").hide();
        $('.drspecialityload').removeClass("empty");
    });

    $("#drsku").delegate('li a', 'click', function () {
        $(".skuload").attr("data", "");
        $("#drSKUInput").val($(this).text());
        $(".skuload").attr("data", $(this).attr("value"));
        $("#drsku").hide();
        $('.skuload').removeClass("empty");
    });

    $('.container').on('input', '#PotentialName', function () {
        if ($('#PotentialName').length > 0) {
            $('#PotentialName').removeClass("empty");
        }
    });

    $('.container').on('change', '#dropdownBrand', function (e) {
        loadSKU();
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

function loadStockist() {
    var selectQuery = "SELECT * FROM " + TABLES.STOCKIST.TABLE + " ORDER BY " + TABLES.STOCKIST.NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#dropdownStockist").selectpicker();
        var dd = $("#dropdownStockist").empty();
        dd.append('<option value="">Select Stockist </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.STOCKIST.STOCKIST_ID] + '"> ' + item[TABLES.STOCKIST.NAME] + '</option>');
            }
        } else {
            alert("Stockist Table is not available");
        }
        $("#dropdownStockist").selectpicker('refresh');
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function loadBrand() {
    var selectQuery = "SELECT * FROM " + TABLES.PRODUCTGROUPS.TABLE + " ORDER BY " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#dropdownBrand").selectpicker();
        var dd = $("#dropdownBrand").empty();
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
        $("#dropdownBrand").selectpicker('refresh');

    }).fail(function (error) {
//        errorMessage(error.message.toString());
        alert("Problem in  Brand ");
    });
}

function loadSKU() {
    var dropDownBrandSelected = $('#dropdownBrand').val();

    var insertQuery = "SELECT " + TABLES.SAMPLES.SAMPLE_NAME + "," + TABLES.SAMPLES.SAMPLE_ID + " FROM " + TABLES.SAMPLES.TABLE + " WHERE " + TABLES.SAMPLES.PRODUCT_GROUP_ID + " = ?";
    var insertValues = new Array(dropDownBrandSelected);
    $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
        var resultLength = data.rows.length;
        $("#dropdownSKU").selectpicker();
        var dd = $("#dropdownSKU").empty();
        dd.append('<option value="">Auto Select SKU </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultLength > 0) {
            for (var i = 0, item = null; i < resultLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.SAMPLES.SAMPLE_ID] + '"> ' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</option>');
            }
        } else {
            alert("SKU Message is not available");
        }
        $("#dropdownSKU").selectpicker('refresh');
    }).fail(function (error) {
//            errorMessage(error.message.toString());
        alert("Problem in SKU Message");
    });

}



function getAppendContent() {
//    var appendContent = '           <div class="form-group form-material floating col-xs-4" style="margin-bottom: 25px;margin-left: -7px;">' +
//            '                <select style=" border-color:#eee;"  class="form-control drqualificationload selectpicker" name="name" data-role="none" data-live-search="true"  id="dropdownBrand"  >' +
//            '                </select>' +
//            '                <label class="floating-label" for="inputName"  > Brand<span style="color: Red">*</span></label>' +
//            '           </div>' +
//            '           <div class="form-group form-material floating col-xs-4" style="margin-bottom: 25px;margin-left: -7px;">' +
//            '                <select style=" border-color:#eee;"  class="form-control  drspecialityload selectpicker" name="name" data-role="none" data-live-search="true"  id="dropdownSKU"  >' +
//            '                </select>' +
//            '                <label class="floating-label" for="inputName"  > SKU<span style="color: Red">*</span></label>' +
//            '           </div>' +
//            '           <div class="form-group form-material floating col-xs-4" style="margin-bottom: 25px;margin-left: -7px;" id="PotentialNameWrapper">' +
//            '                <input id="PotentialName"  type="text" maxlength="5" name="name" class="form-control empty"  pattern = "[0-9]"/>' +
//            '                <label class="floating-label" for="inputName"  >Quantity<span style="color: Red">*</span></label>' +
//            '           </div>';
//    var appendData = '<table width = "100%" cellpadding = "5" cellspacing = "0" border = "0"> ';
//    appendData += ' <tr> ';
//    appendData += ' <td> <b> Brand: </b><label id="order">' + $('#dropdownBrand :selected').text() + '</label> </td> ';
//    appendData += ' </tr> ';
//    appendData += ' <tr>';
//    appendData += ' <td> <b> SKU: </b><label>' + $('#dropdownSKU :selected').text() + '<label></td> ';
//
//    appendData += ' </tr> ';
//    appendData += ' <tr> ';
//    appendData += ' <td> <b> POB Qauntity: </b>' + $('#PotentialName').val() + '</td> ';
//    appendData += ' </tr> ';
//
//    appendData += ' </table> ';
    addedSamplesIssuesCount++;
    var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
            '<div class="col-xs-2" style="margin-bottom:30px;padding-top: 15px;">' +
            '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
            '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + $('#dropdownBrand').val() + "_" + $('#dropdownSKU').val() + '">' +
            '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
            '</span>' +
            '</div>' +
            '<div class="col-xs-4" style="margin-bottom:30px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#dropdownBrand :selected').text() + '</p>' +
            '</div>' +
            '<div class="col-xs-4" style="margin-bottom:30px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#dropdownSKU :selected').text() + '</p>' +
            '</div>' +
            '<div class="col-xs-2" style="margin-bottom:30px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#PotentialName').val() + '</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    return appendData;
}

function saveOrderDetails() {

//    var dropdownStockistSelected = $('#dropdownStockist option:selected').val();
    var dropdownBrandSeleted = $('#dropdownBrand option:selected').val();
    var dropdownSKUSelected = $('#dropdownSKU option:selected').val();
    var potentialNameValue = $('#PotentialName').val();

    if (dropdownBrandSeleted == "" || dropdownBrandSeleted == undefined)
    {
        alert("Please Select Brand . ");
    } else if (dropdownSKUSelected == "" || dropdownSKUSelected == undefined)
    {
        alert("Please Select SKU . ");
    } else if (potentialNameValue == "")
    {
        alert("Please fill Quantity Textbox  . ");
    } else
    {
        $("#orderDetailngDiv").show();
        var selectQuery = "SELECT * FROM " + TABLES.DCRBRANDORDER.TABLE + " WHERE " +
                TABLES.DCRBRANDORDER.DCR_DOCTOR_SLNO + "=? and " + TABLES.DCRBRANDORDER.BRAND_ID
                + "=? and " + TABLES.DCRBRANDORDER.SKU_ID + "=? and "
                + TABLES.DCRBRANDORDER.STOCKIST_ID + "=?";
        var selectValues = new Array($.session.get("customerDCRSLNNO"), dropdownBrandSeleted, dropdownSKUSelected, $.session.get("customerId"));
        $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
            var resultRows = data.rows;
            var resultRows = data.rows;
            if (resultRows.length > 0) {
                alert("Brand ,SKU already added for the selected customer.");
            } else {

                var insertQuery = "INSERT INTO " + TABLES.DCRBRANDORDER.TABLE + " ( " + TABLES.DCRBRANDORDER.BRAND_ID + "," + TABLES.DCRBRANDORDER.CATEGORY_ID + "," + TABLES.DCRBRANDORDER.DCR_DOCTOR_SLNO + "," + TABLES.DCRBRANDORDER.DCR_SLNO + "," + TABLES.DCRBRANDORDER.POB_QTY + "," + TABLES.DCRBRANDORDER.POB_VAL + "," + TABLES.DCRBRANDORDER.PRICE + "," + TABLES.DCRBRANDORDER.SKU_ID + "," + TABLES.DCRBRANDORDER.STOCKIST_ID + " ) VALUES (?,?,?,?,?,?,?,?,?)";
                var insertValues = new Array(dropdownBrandSeleted, null, $.session.get("customerDCRSLNNO"), $.session.get("ActivityId"), potentialNameValue, null, null, dropdownSKUSelected, $.session.get("customerId"));
                $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
//        var resultSetLength = data.rows.length;

//                    $.when($('.doctorNameWrapper').after(getAppendContent())).then(function () {
//                        disableLinks();
//                        loadBrand();
//                        $("#dropdownSKU").selectpicker();
//                        $("#dropdownSKU").selectpicker('refresh');
////                loadSKU();
//                    });
                    $('#addedSamples').append(getAppendContent());
                    refreshFields();

                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });

    }
}

function refreshFields() {
    $('#dropdownBrand').selectpicker();
    $('#dropdownBrand').val(0);
    $("#dropdownBrand").selectpicker('refresh');

    $('#dropdownSKU').selectpicker();
    $('#dropdownSKU').val(0);
    $("#dropdownSKU").selectpicker('refresh');

    $('#PotentialName').val("");
}
function errorMessage(_message) {
    alert(_message);
}

function disableLinks() {
    if ($($('[id="dropdownBrand"]')).size() > 1) {
        for (var i = 1; i < $($('[id="dropdownBrand"]')).size(); i++) {
            $($('[id="dropdownBrand"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="dropdownSKU"]')).size(); i++) {
            $($('[id="dropdownSKU"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="PotentialName"]')).size(); i++) {
            $($('[id="PotentialName"]')[i]).prop('disabled', true);
        }
    }
}

function toggleIcon(e) {
    $(e.target).parent().parent().find(".more-less").toggleClass('glyphicon-plus glyphicon-minus');
}

function deleteAddedSKU(_sampleId, _currentItem, _length) {
    var _sampleArray = _sampleId.split("_");
    var deleteQuery = "DELETE FROM " + TABLES.DCRBRANDORDER.TABLE + " WHERE " + TABLES.DCRBRANDORDER.SKU_ID + "=? AND " + TABLES.DCRBRANDORDER.BRAND_ID + "=? AND " + TABLES.DCRBRANDORDER.DCR_DOCTOR_SLNO + "=?";
    var deleteValue = new Array(_sampleArray[1], _sampleArray[0], $.session.get("customerDCRSLNNO"));
    $.when(dbObject.execute(deleteQuery, deleteValue)).done(function (data) {
        if (_currentItem === _length) {
            displayAddedItems();
        }
    });
}

function displayAddedItems() {
    var selectQuery = "SELECT * FROM " + TABLES.DCRBRANDORDER.TABLE + " DS INNER JOIN " +
            TABLES.SAMPLES.TABLE + " S ON DS." + TABLES.DCRBRANDORDER.SKU_ID + " = S." + TABLES.SAMPLES.SAMPLE_ID +
            " INNER JOIN " + TABLES.PRODUCTGROUPS.TABLE + " P ON DS." + TABLES.DCRBRANDORDER.BRAND_ID + "= P." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID +
            " WHERE DS." + TABLES.DCRBRANDORDER.DCR_DOCTOR_SLNO + " = ?";
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
                        '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + item[TABLES.DCRBRANDORDER.BRAND_ID] + "_" + item[TABLES.DCRBRANDORDER.SKU_ID] + '">' +
                        '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
                        '</span>' +
                        '</div>' +
                        '<div class="col-xs-4" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-4" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-2" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.DCRBRANDORDER.POB_QTY] + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#addedSamples').append(appendData);
            }
        }
        $('#deleteItemWrapper').addClass('hideDelete');
    });

}