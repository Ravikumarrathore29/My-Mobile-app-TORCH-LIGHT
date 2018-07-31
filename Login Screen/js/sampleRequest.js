var dbObject = new dbAccess();

document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);
var dbObject = new dbAccess();
var addedSamplesRequestCount = 0;
$(function () {
    assignEvents();
    loadPromotion();
    sampleRequestDate();
    $('#headerWrapper').load('header.html', function () {
        $('.headerText').text("Sample Request");
        $('#showBtn').hide();
        $('#menu-toggle').hide();
    });
    $('#date').mobiscroll().date({
        theme: "ios",
        mode: "mixed",
        lang: "",
        display: "bubble",
        animate: "flip"
                //maxDate: new Date($.session.get("ActivityDate")),
//        defaultValue: new Date($.session.get("ActivityDate"))
    });
    displayAddedItems();
    initSignCanvas(0);
});

function assignEvents() {
    $("#sampleRequestDiv").hide();
    $(".form-control").keyup(function () {
        var a = $(this).val();
        if (a.length >= 0)
        {
            $(this).removeClass("empty");
        } else
            $(this).addClass("empty");
    });

    $('.autoCompleteInput').focusin(function () {
        $(this).next().css('display', 'block');
    });

    $('#addContent').click(function (e) {
        if ($.session.get("customerDCRSLNNO") === undefined || $.session.get("customerDCRSLNNO") === "") {
            $('#swipeRightBtn').click();
            alert("Please select the customer");
            $("#sampleRequestDiv").hide();
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
             saveSampleRequest();
        }
        }
    });

    $(".container").on('change', '#MciName', function () {
        var value = $("#MciName").val();
        var valueArray = value.split("_");
        var selectQuery = "SELECT * FROM " + TABLES.PRODUCT_TYPE.TABLE +
                " WHERE " + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID + "=?";
        var selectValues = new Array(valueArray[1]);
        $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
            var resultSetLength = data.rows.length;
            $("#sampleType").selectpicker();
            var dd = $("#sampleType").empty();
            dd.append('<option value="">Select Promotion Name </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
            if (resultSetLength > 0) {
                for (var i = 0, item = null; i < resultSetLength; i++) {
                    item = data.rows.item(i);
                    dd.append('<option value="' + item[TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID] + '" selected> ' + item[TABLES.PRODUCT_TYPE.NAME] + '</option>');
                }
            }
            $("#sampleType").selectpicker('refresh');

        }).fail(function (error) {
//        errorMessage(error.message.toString());
            alert("Problem in prdouct type");
        });
    });

    $('#contacts').change(function () {
        if ($('#contacts').is(':checked')) {
            $('.addedItemChecked').prop('checked', true);
        } else {
            $('.addedItemChecked').prop('checked', false);
        }
        $('.addedItemChecked').change();
    });

    $('#addedSamplesRequest').on('change', '.addedItemChecked', function () {
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
                deleteAddedSampleRequest($(this).val(), i, checkedLength);
            }
        });
    });    
}

function saveSampleRequest() {
    var dropDownPromotionSelected = $('#MciName option:selected').val();
    var dropDownType = $('#sampleType option:selected').val();
    var DCRDoctorSlno = "";
    var sampleRequestedArray = dropDownPromotionSelected.split("_");
    if ($.session.get("DCRD") === "" || $.session.get("DCRD") === undefined) {
        DCRDoctorSlno = generateSLNO();
        $.session.set("DCRD", DCRDoctorSlno);
    }
    if (dropDownPromotionSelected == "" || dropDownPromotionSelected == undefined)
    {
        alert("Please select Promotion Name . ");
    } else if (dropDownType == "" || dropDownType == undefined)
    {
        alert("Please select  Type . ");
    } else {
        
         $("#sampleRequestDiv").show();
        var selectQuery = "SELECT * FROM " + TABLES.SAMPLE_REQUEST.TABLE
                + " WHERE " + TABLES.SAMPLE_REQUEST.CUSTOMER_ID + "=? and " +
                TABLES.SAMPLE_REQUEST.SAMPLE_ID + "=?";
        var selectValues = new Array($.session.get("customerDCRSLNNO"), sampleRequestedArray[0]);
        $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
            var dataSetLength = data.rows.length;
            if (dataSetLength > 0) {
                alert("Sample already requested for the selected brand.");
            } else {
                var canvas = document.getElementsByTagName('canvas');
                var imageData = canvas[0].toDataURL();
                var insertQuery = "INSERT INTO " + TABLES.SAMPLE_REQUEST.TABLE + "(" + TABLES.SAMPLE_REQUEST.CUSTOMER_ID
                        + "," + TABLES.SAMPLE_REQUEST.SAMPLE_ID + "," + TABLES.SAMPLE_REQUEST.SAMPLE_TYPE_ID + ","
                        + TABLES.SAMPLE_REQUEST.REMARKS + "," + TABLES.SAMPLE_REQUEST.QUANTITY + ","
                        + TABLES.SAMPLE_REQUEST.DATE + "," + TABLES.SAMPLE_REQUEST.DCR_SL_NO + ","
                        + TABLES.SAMPLE_REQUEST.SIGNATURE + ") VALUES (?,?,?,?,?,?,?,?)";
                var insertValues = new Array($.session.get("customerDCRSLNNO"), sampleRequestedArray[0], sampleRequestedArray[1],
                        $('#remarks').val(), $('#quantity').val(), $('#date').val(), $.session.get("ActivityId"), imageData);
                $.when(dbObject.execute(insertQuery, insertValues)).done(function (data) {
                    $.when($('#addedSamplesRequest').append(getAppendContent())).then(function () {
                        $('#MciName').selectpicker();
                        $('#MciName').val("0");
                        $('#MciName').selectpicker('refresh');

                        $('#sampleType').selectpicker();
                        $('#sampleType').val("0");
                        $('#sampleType').selectpicker('refresh');

                        $('#quantity').val("");
                        $('#remarks').val("");
                        $('#date').val("");
                          initSignCanvas(0);
                    });
                }).fail(function (_errorMsg) {
                    alert(_errorMsg.message);
                });


            }
        }).fail(function (error) {
            errorMessage(error.message.toString());
        });
    }
}
function getAppendContent() {
    addedSamplesRequestCount++;
    var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
            '<div class="col-xs-2" style="margin-bottom:10px;padding-top: 20px;">' +
            '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
            '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesRequestCount + '" value="' + ($('#MciName').val().split("_"))[0] + '">' +
            '<label for="contacts_' + addedSamplesRequestCount + '"></label>' +
            '</span>' +
            '</div>' +
            '<div class="col-xs-4" style="margin-bottom:10px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#MciName option:selected').text() + '</p>' +
            '<p style="font-size:16px;">' + $('#sampleType option:selected').text() + '</p>' +
            '</div>' +
            '<div class="col-xs-2" style="margin-bottom:10px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#quantity').val() + '</p>' +
            '</div>' +
            '<div class="col-xs-4" style="margin-bottom:10px">' +
            '<p style="margin-top:20px;font-size:16px;">' + $('#date').val() + '</p>' +
            '<p style="font-size:16px;">' + $('#remarks').val() + '</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    return appendData;

}

function initSignCanvas(_count) {
    isSign = false;
    leftMButtonDown = false;

    //Set Canvas width
    var sizedWindowWidth = 370;//$('#div_signcontract').width();
    if (sizedWindowWidth > 700)
        sizedWindowWidth = $(window).width() / 2;
    else if (sizedWindowWidth > 370)
        sizedWindowWidth = sizedWindowWidth - 50;
    else
        sizedWindowWidth = sizedWindowWidth - 20;

    $("#canvas" + addedSamplesRequestCount).width(190);
    $("#canvas" + addedSamplesRequestCount).height(58);
    $("#canvas" + addedSamplesRequestCount).css("border", "2px solid  #000000");

    var canvas = $("canvas").get(0);

    canvasContext = canvas.getContext('2d');

    if (canvasContext)
    {
        canvasContext.canvas.width = sizedWindowWidth;
        canvasContext.canvas.height = 95;

        canvasContext.fillStyle = "#fff";
        canvasContext.fillRect(0, 0, 400, 202);
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


function loadPromotion() {
    var selectQuery = "SELECT * FROM " + TABLES.SAMPLES.TABLE + " ORDER BY " + TABLES.SAMPLES.SAMPLE_NAME + " ASC";
    var selectValues = new Array();
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $("#MciName").selectpicker();
        var dd = $("#MciName").empty();
        dd.append('<option value="">Select Promotion Name </option>');
//                dd.append('<li><a value="0" selected>Select Qualification</a></li>');
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                dd.append('<option value="' + item[TABLES.SAMPLES.SAMPLE_ID] + '_' + item[TABLES.SAMPLES.PRODUCT_TYPE_ID] + '"> ' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</option>');
            }
        } else {
            alert("Sample Table is not available");
        }
        $("#MciName").selectpicker('refresh');

    }).fail(function (error) {
//        errorMessage(error.message.toString());
        alert("Problem in  Promotion");
    });
}

function sampleRequestDate() {
    $('#date').mobiscroll().date({
        theme: "ios",
        mode: "mixed",
        lang: "",
        display: "bubble",
        animate: "flip"

    });
}

function disableLinks() {
    if ($($('[id="MciName"]')).size() > 1) {
        for (var i = 1; i < $($('[id="MciName"]')).size(); i++) {
            $($('[id="MciName"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="sampleType"]')).size(); i++) {
            $($('[id="sampleType"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="remarks"]')).size(); i++) {
            $($('[id="remarks"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="quantity"]')).size(); i++) {
            $($('[id="quantity"]')[i]).prop('disabled', true);
        }
        for (var i = 1; i < $($('[id="date"]')).size(); i++) {
            $($('[id="date"]')[i]).prop('disabled', true);
        }
    }
}

function displayAddedItems() {
    var selectQuery = "SELECT * FROM " + TABLES.SAMPLE_REQUEST.TABLE + " DS INNER JOIN " +
            TABLES.SAMPLES.TABLE + " S ON DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + " = S." + TABLES.SAMPLES.SAMPLE_ID +
            " INNER JOIN " + TABLES.PRODUCT_TYPE.TABLE + " P ON DS." + TABLES.SAMPLE_REQUEST.SAMPLE_TYPE_ID + "= P." + TABLES.PRODUCT_TYPE.PRODUCT_TYPE_ID +
            " WHERE DS." + TABLES.SAMPLE_REQUEST.CUSTOMER_ID + " = ?";
    var selectValues = new Array($.session.get('customerDCRSLNNO'));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        $('#addedSamplesRequest').empty();
        if (resultSetLength > 0) {
            for (var i = 0, item = null; i < resultSetLength; i++) {
                item = data.rows.item(i);
                addedSamplesRequestCount++;
                var appendData = '<div class="row" style="border-bottom: 1px solid #e0e0e0">' +
                        '<div class="col-xs-2" style="margin-bottom:10px;padding-top: 20px;">' +
                        '<span class="checkbox-custom checkbox-primary checkbox-lg">' +
                        '<input type="checkbox" class="contacts-checkbox addedItemChecked selectable-item" id="contacts_' + addedSamplesRequestCount + '" value="' + item[TABLES.SAMPLE_REQUEST.SAMPLE_ID] + '">' +
                        '<label for="contacts_' + addedSamplesRequestCount + '"></label>' +
                        '</span>' +
                        '</div>' +
                        '<div class="col-xs-4" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.SAMPLES.SAMPLE_NAME] + '</p>' +
                        '<p style="font-size:16px;">' + item[TABLES.PRODUCT_TYPE.NAME] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-2" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.SAMPLE_REQUEST.QUANTITY] + '</p>' +
                        '</div>' +
                        '<div class="col-xs-4" style="margin-bottom:10px">' +
                        '<p style="margin-top:20px;font-size:16px;">' + item[TABLES.SAMPLE_REQUEST.DATE] + '</p>' +
                        '<p style="font-size:16px;">' + item[TABLES.SAMPLE_REQUEST.REMARKS] + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#addedSamplesRequest').append(appendData);
            }
        } 
        $('#deleteItemWrapper').addClass('hideDelete');
    });

}

function deleteAddedSampleRequest(_sampleId, _currentItem, _length) {    
    var deleteQuery = "DELETE FROM " + TABLES.SAMPLE_REQUEST.TABLE + " WHERE " + TABLES.SAMPLE_REQUEST.SAMPLE_ID + "=? AND " + TABLES.SAMPLE_REQUEST.CUSTOMER_ID + "=?";
    var deleteValue = new Array(_sampleId, $.session.get("customerDCRSLNNO"));
    $.when(dbObject.execute(deleteQuery, deleteValue)).done(function (data) {
        if (_currentItem === _length) {
            displayAddedItems();
        }
    });
}