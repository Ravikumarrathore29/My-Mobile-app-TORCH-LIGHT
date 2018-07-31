var isSign = false;
var leftMButtonDown = false;
var addedSamplesIssuesCount = 0;
var canvasContext;
var dbObject = new dbAccess();
var progValue = 0;


document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);
$(function () {

    assignEvents();
    loadSKU();
    $('#headerWrapper').load('header.html', function () {
        $('.headerText').text("Sample Issue");
        $('#showBtn').hide();
        $('#menu-toggle').hide();
        displayAddedItems();
    });
    initSignCanvas(0);
//    $('#deleteItemWrapper').hide();
});

function assignEvents() {
    $("#samplesIssueDiv").hide();
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


    $("#PotentialName").keyup(function () {
        $("#PotentialName").val(this.value.match(/[0-9]*/));
    });

    $('#addContent').click(function (e) {
        if ($.session.get("customerDCRSLNNO") === undefined || $.session.get("customerDCRSLNNO") === "") {
            $('#swipeRightBtn').click();
            alert("Please select the customer");
            e.stopPropagation();
        } else {

            var empty_count = 0;
            $('#textBoxError').remove();
            $('#textBoxError').remove();
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
                e.preventDefault();
            } else {
                saveSKUQty();
            }
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
    var deleteQuery = "DELETE FROM " + TABLES.DCRDSAMPLEDETAILS.TABLE + " WHERE " + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + "=? AND " + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + "=?";
    var deleteValue = new Array(_sampleId, $.session.get("customerDCRSLNNO"));
    $.when(dbObject.execute(deleteQuery, deleteValue)).done(function (data) {
        if (_currentItem === _length) {
            displayAddedItems();
        }
    });
}

function saveSKUQty() {
    var dropDownSKUSelected = $('#DropDown_SKU').val();
    var potentialNameValue = $('#PotentialName').val();
    if (dropDownSKUSelected == 0) {
        alert("Please select SKU name . ");
    } else if (potentialNameValue == "" || potentialNameValue.length === 0)
    {
        alert("Please enter  Quantity . ");
    } else {
        $("#samplesIssueDiv").show();
        var selectQuery = "SELECT * FROM " + TABLES.DCRDSAMPLEDETAILS.TABLE + " WHERE " +
                TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + "=? and " + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + "=?";
        var selectValues = new Array($.session.get("customerDCRSLNNO"), dropDownSKUSelected);
        $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
            var resultRows = data.rows;
            if (resultRows.length > 0) {
                alert("SKU already added for the customer.");
            } else {
                var canvas = $("canvas").get(0);
                var insertQuery = "INSERT INTO " + TABLES.DCRDSAMPLEDETAILS.TABLE + " ( " + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO
                        + "," + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + "," + TABLES.DCRDSAMPLEDETAILS.QUANTITY + "," + TABLES.DCRDSAMPLEDETAILS.SIGNATURE + " ) VALUES (?,?,?,?)";
                var insertValues = new Array($.session.get("customerDCRSLNNO"), dropDownSKUSelected, potentialNameValue, convertCanvasToImage(canvas));
                $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
                    var resultSetLength = data.rows.length;
                    $.when($('#addedSamples').append(getAppendContent())).then(function () {
//                        loadSKU();
//                        initSignCanvas(addedSamplesIssuesCount);
//                        disableLinks();
                        $('#DropDown_SKU').selectpicker();
                        $('#DropDown_SKU').val("0");
                        $('#DropDown_SKU').selectpicker('refresh');
                        $('#PotentialName').val("");
                        initSignCanvas(0);
//                        $('.addedItemChecked').click(function () {
//                            $('.addedItemChecked').each(function () {
//                                if ($(this).is(':checked')) {
//                                    $('#deleteItemWrapper').removeClass('hideDelete');
//                                } else {
//                                    $('#deleteItemWrapper').addClass('hideDelete');
//                                }
//                            });
//
//                        });
                    });
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });
    }
}




function getAppendContent() {
    addedSamplesIssuesCount++;
    var canvas = $("canvas").get(0);
    var imgData = convertCanvasToImage(canvas);
    var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
            '<div class="col-xs-2" style="margin-bottom:30px;padding-top: 35px;">' +
            '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
            '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + $('#DropDown_SKU').val() + '">' +
            '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
            '</span>' +
            '</div>' +
            '<div class="col-xs-3" style="margin-bottom:30px">' +
            '<p style="margin-top:51px;font-size:16px;">' + $('#DropDown_SKU :selected').text() + '</p>' +
            '</div>' +
            '<div class="col-xs-2" style="margin-bottom:30px">' +
            '<p style="margin-top:51px;font-size:16px;">' + $('#PotentialName').val() + '</p>' +
            '</div>' +
            '<div class="col-xs-5" style="margin-bottom:30px">' +
            '<img style="margin-top:10px" src="' + imgData + '">' +
            '</div>' +
            '</div>' +
            '</div>';
    return appendData;
}

function funSubmit() {
    if (isSign) {
        var canvas = $("#canvas").get(0);
        var imgData = canvas.toDataURL();
    } else {
        alert('Please sign');
    }
}

function closePopUpissue() {
    jQuery('#divPopUpSignContract').popup('close');
    jQuery('#divPopUpSignContract').popup('close');
}

function initSignCanvas(_count) {
    isSign = false;
    leftMButtonDown = false;

    //Set Canvas width
    var sizedWindowWidth = 200;//$('#div_signcontract').width();
    if (sizedWindowWidth > 700)
        sizedWindowWidth = $(window).width() / 2;
    else if (sizedWindowWidth > 400)
        sizedWindowWidth = sizedWindowWidth - 50;
    else
        sizedWindowWidth = sizedWindowWidth - 20;

    $("#canvas" + addedSamplesIssuesCount).width(200);
    $("#canvas" + addedSamplesIssuesCount).height(102);
    $("#canvas" + addedSamplesIssuesCount).css("border", "2px solid  #000000");

    var canvas = $("canvas").get(0);

    canvasContext = canvas.getContext('2d');
    if (canvasContext)
    {
        canvasContext.canvas.width = sizedWindowWidth;
        canvasContext.canvas.height = 102;

        canvasContext.fillStyle = "#fff";
        canvasContext.fillRect(0, 0, 200, 102);
    }
    $(canvas).on('touchstart', function (e) {
        leftMButtonDown = true;
        canvasContext.fillStyle = "#000";
        var x = e.originalEvent.touches[0].pageX - $(e.target).offset().left;
        var y = e.originalEvent.touches[0].pageY - $(e.target).offset().top;
        canvasContext.moveTo(x, y);
        e.preventDefault();
        return false;
    });

    $(canvas).on('touchend', function (e) {
        leftMButtonDown = false;
        isSign = true;
        e.preventDefault();
        return false;
    });


    $(canvas).bind('touchmove', function (e) {
        canvasContext.fillStyle = "#000";
        var x = e.originalEvent.touches[0].pageX - $(e.target).offset().left;
        var y = e.originalEvent.touches[0].pageY - $(e.target).offset().top;
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        e.preventDefault();
        return false;
    });
    $(canvas).on('vmousedown', function (e) {
        if (e.which === 1) {
            leftMButtonDown = true;
            canvasContext.fillStyle = "#000";
            var x = e.pageX - $(e.target).offset().left;
            var y = e.pageY - $(e.target).offset().top;
            canvasContext.moveTo(x, y);
        }
        e.preventDefault();
        return false;
    });

    $(canvas).on('vmouseup', function (e) {
        if (leftMButtonDown && e.which === 1) {
            leftMButtonDown = false;
            isSign = true;
        }
        e.preventDefault();
        return false;
    });

    // draw a line from the last point to this one
    $(canvas).bind('vmousemove', function (e) {
        if (leftMButtonDown == true) {
            canvasContext.fillStyle = "#000";
            var x = e.pageX - $(e.target).offset().left;
            var y = e.pageY - $(e.target).offset().top;
            canvasContext.lineTo(x, y);
            canvasContext.stroke();
        }
        e.preventDefault();
        return false;
    });
}




function loadSKU() {
    var selectQuery = "SELECT * FROM " + TABLES.SAMPLES.TABLE + " ORDER BY " + TABLES.SAMPLES.SAMPLE_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#DropDown_SKU").selectpicker();
        var dd = $("#DropDown_SKU").empty();
        dd.append('<option value="0">Select Sample </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.SAMPLES.SAMPLE_ID] + '"> ' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</option>');
            }
        } else {
            alert("Samples Table is not avialble");
        }
        $("#DropDown_SKU").selectpicker('refresh');
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}




function processSKU() {
    var selectQuery = "SELECT * FROM " + TABLES.SAMPLES.TABLE + " ORDER BY " + TABLES.SAMPLES.SAMPLE_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#DropDown_SKU").selectpicker();
        var dd = $("#DropDown_SKU").empty();
        dd.append('<option value="">Select Sample </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.SAMPLES.SAMPLE_ID] + '"> ' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</option>');
            }
        } else {
            alert("Samples Table is not avialble");
        }
        $("#DropDown_SKU").selectpicker('refresh');
    }).fail(function (error) {
        errorMessage(error.message.toString());
    });
}

function disableLinks() {
    if ($($('[id="DropDown_SKU"]')).size() > 1) {
        for (var i = 1; i < $($('[id="DropDown_SKU"]')).size(); i++) {
            $($('[id="DropDown_SKU"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="PotentialName"]')).size(); i++) {
            $($('[id="PotentialName"]')[i]).prop('disabled', true);
        }
    }
}

function displayAddedItems() {
    var selectQuery = "SELECT * FROM " + TABLES.DCRDSAMPLEDETAILS.TABLE + " DS INNER JOIN " +
            TABLES.SAMPLES.TABLE + " S ON DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + " = S." + TABLES.SAMPLES.SAMPLE_ID +
            " WHERE DS." + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + " = ?" +
            " ORDER BY S." + TABLES.SAMPLES.SAMPLE_NAME + " ASC";
    var selectValues = new Array($.session.get('customerDCRSLNNO'));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $('#addedSamples').empty();
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                addedSamplesIssuesCount++;
                var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
                        '<div class="col-xs-2" style="margin-bottom:30px;padding-top: 35px;">' +
                        '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
                        '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesIssuesCount + '" value="' + item[TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID] + '">' +
                        '<label for="contacts_' + addedSamplesIssuesCount + '"></label>' +
                        '</span>' +
                        '</div>' +
                        '<div class="col-xs-3" style="margin-bottom:30px">' +
                        '<p style="margin-top:51px;font-size:16px;">' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-2" style="margin-bottom:30px">' +
                        '<p style="margin-top:51px;font-size:16px;">' + item[TABLES.DCRDSAMPLEDETAILS.QUANTITY] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-5" style="margin-bottom:30px">' +
                        '<img style="margin-top:10px" src="' + item[TABLES.DCRDSAMPLEDETAILS.SIGNATURE] + '">' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#addedSamples').append(appendData);
            }
        }
        $('#deleteItemWrapper').addClass('hideDelete');
    });

}