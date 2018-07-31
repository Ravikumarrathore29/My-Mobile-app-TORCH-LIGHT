var dbObject = new dbAccess(), selectedCustomer;
$(function () {
    initData();
});

function initData() {
    $('#headerWrapper').load('header.html', function () {
        switch ($.session.get('customerType')) {
            case 'D':
                $('.headerText').text("Added Doctors");
                break;
            case 'UD':
                $('.headerText').text("Added Unlisted Doctors");
                break;
            case 'C':
                $('.headerText').text("Added Chemists");
                break;
            case 'S':
                $('.headerText').text("Added Stockiests");
                break;
            default :
        }
        $('#showBtn').hide();
        $('#menu-toggle').hide();
    });

    switch ($.session.get('customerType')) {
        case 'D':
            if ($.session.get("customerSelected") !== undefined && $.session.get("customerSelected") !== "") {
                selectedCustomer = $.session.get("customerSelected");
                $.session.remove("customerSelected");
                displayAddedDoctorsWithId();
            } else {
                displayAddedDoctors();
            }
            break;
        case 'UD':

            $('.headerText').text("Added Unlisted Doctors");
            break;
        case 'C':
            if ($.session.get("customerSelected") !== undefined && $.session.get("customerSelected") !== "") {
                selectedCustomer = $.session.get("customerSelected");
                $.session.remove("customerSelected");
                displayAddedChemistsWithId();
            } else {
                displayAddedChemists();
            }
            break;
        case 'S':
            if ($.session.get("customerSelected") !== undefined && $.session.get("customerSelected") !== "") {
                selectedCustomer = $.session.get("customerSelected");
                $.session.remove("customerSelected");
                displayAddedStockistWithId();
            } else {
                displayAddedStockist();
            }
            break;
        default :
    }
}

function displayAddedDoctors() {
    var selectQuery = "Select DR." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + ",DR." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + ",DR." + TABLES.DCR_DOCTOR.WORKED_WITH + ",DI." + TABLES.DOCTOR_INFO.NAME
            + " FROM " + TABLES.DCR_DOCTOR.TABLE + " DR INNER JOIN " +
            TABLES.DOCTOR_INFO.TABLE + " DI ON DR." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "=DI." + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
            " WHERE DR." + TABLES.DCR_DOCTOR.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.DOCTOR_INFO.NAME];
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
                displayCustomerRelatedData(k, item[TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO].toString(), item[TABLES.DCR_DOCTOR.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}

function displayAddedChemists() {
    var selectQuery = "Select DR." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + ",DR." + TABLES.DCR_CHEMIST.CHEMIST_ID
            + ",DI." + TABLES.CHEMISTS.NAME + ",DR." + TABLES.DCR_CHEMIST.WORKED_WITH
            + " FROM " + TABLES.DCR_CHEMIST.TABLE + " DR INNER JOIN " +
            TABLES.CHEMISTS.TABLE + " DI ON DR." + TABLES.DCR_CHEMIST.CHEMIST_ID + "=DI." + TABLES.CHEMISTS.CHEMIST_ID +
            " WHERE DR." + TABLES.DCR_CHEMIST.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.CHEMISTS.NAME] + "(" + (item[TABLES.DCR_CHEMIST.WORKED_WITH] !== null ? item[TABLES.DCR_CHEMIST.WORKED_WITH] : "") + ")";
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                displayCustomerRelatedData(k, item[TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO].toString(), item[TABLES.DCR_CHEMIST.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}

function displayAddedStockist() {
    var selectQuery = "Select DR." + TABLES.DCR_STOCKIST.DCR_STOCK_ID + ",DR." + TABLES.DCR_STOCKIST.STOCKIST_ID
            + ",DI." + TABLES.STOCKIST.NAME + ",DR." + TABLES.DCR_STOCKIST.WORKED_WITH
            + " FROM " + TABLES.DCR_STOCKIST.TABLE + " DR INNER JOIN " +
            TABLES.STOCKIST.TABLE + " DI ON DR." + TABLES.DCR_STOCKIST.STOCKIST_ID + "=DI." + TABLES.STOCKIST.STOCKIST_ID +
            " WHERE DR." + TABLES.DCR_STOCKIST.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.STOCKIST.NAME] + "(" + (item[TABLES.DCR_STOCKIST.WORKED_WITH] !== null ? item[TABLES.DCR_STOCKIST.WORKED_WITH] : "") + ")";
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                displayCustomerRelatedData(k, item[TABLES.DCR_STOCKIST.DCR_STOCK_ID].toString(), item[TABLES.DCR_STOCKIST.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}

function displayCustomerRelatedData(k, _dcrDoctorSlNo, _workedWith) {
    var appendData = "";
    var selectSampleQuery = "SELECT DS." + TABLES.DCRDSAMPLEDETAILS.QUANTITY + ",DS." + TABLES.DCRDSAMPLEDETAILS.SIGNATURE +
            ",S." + TABLES.SAMPLES.SAMPLE_NAME + " FROM " + TABLES.DCRDSAMPLEDETAILS.TABLE + " DS INNER JOIN " +
            TABLES.SAMPLES.TABLE + " S ON DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + "= S." + TABLES.SAMPLES.SAMPLE_ID +
            " WHERE DS." + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + "=?";
    var selectSampleValues = new Array(_dcrDoctorSlNo);
    $.when(dbObject.execute(selectSampleQuery, selectSampleValues)).done(function (samplesData) {
        var samplesDataLength = samplesData.rows.length;
        appendData += '<div class="panel panel-default">';
        appendData += '<div class="panel-heading" role="tab" id="headingOne">';
        appendData += '<h4 class="panel-title">';
        appendData += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne' + k + '" aria-expanded="true" aria-controls="collapseOne' + k + '">';
        appendData += '<i class="more-less glyphicon glyphicon-plus"></i>';
        appendData += 'Samples';
        appendData += '</a>';
        appendData += '</h4>';
        appendData += '<div class="panel-body">';
        if (samplesDataLength > 0) {

            appendData += '<div id="collapseOne' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
            appendData += '<div class="col-xs-12">';
            appendData += '<div class="row" style="border:1px solid black">';
            appendData += '<div style="padding-left:20px;font-size:16px;font-weight:bold;border-right:1px solid black" class="col-xs-6">Sample Name</div>';
            appendData += '<div style="padding-left:20px;font-size:16px;font-weight:bold" class="col-xs-5">Quantity</div>';
            appendData += '</div>';
            for (var i = 0, sampleItem = null; i < samplesDataLength; i++) {
                sampleItem = samplesData.rows.item(i);

                appendData += '<div class="row" style="border:1px solid black">';
                appendData += '<div style="padding-left:20px;border-right:1px solid black" class="col-xs-6">' + sampleItem[TABLES.SAMPLES.SAMPLE_NAME] + '</div>';
                appendData += '<div style="padding-left:20px" class="col-xs-5">' + sampleItem[TABLES.DCRDSAMPLEDETAILS.QUANTITY] + '</div>';
                appendData += '</div>';

            }
            appendData += '</div>';
            appendData += '</div>';
        }
        appendData += '</div>';
        appendData += '</div>';
        appendData += '</div>';
        var selectSampleRequestQuery = "SELECT * FROM " + TABLES.SAMPLE_REQUEST.TABLE + " SR INNER JOIN "
                + TABLES.SAMPLES.TABLE + " S ON SR." + TABLES.SAMPLE_REQUEST.SAMPLE_ID + "=S." + TABLES.SAMPLES.SAMPLE_ID
                + " WHERE " + TABLES.SAMPLE_REQUEST.CUSTOMER_ID + "=?";
        var selectSampleRequestValues = new Array(_dcrDoctorSlNo);
        appendData += '<div class="panel panel-default">';
        appendData += '<div class="panel-heading" role="tab" id="headingOne">';
        appendData += '<h4 class="panel-title">';
        appendData += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo' + k + '" aria-expanded="true" aria-controls="collapseTwo' + k + '">';
        appendData += '<i class="more-less glyphicon glyphicon-plus"></i>';
        appendData += 'Sample Request';
        appendData += '</a>';
        appendData += '</h4>';
        appendData += '<div class="panel-body">';
        $.when(dbObject.execute(selectSampleRequestQuery, selectSampleRequestValues)).done(function (samplesRequestData) {
            var sampleRequestDataLength = samplesRequestData.rows.length;
            if (sampleRequestDataLength > 0) {

                appendData += '<div id="collapseTwo' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                for (var i = 0, samplesRequestDataItem = null; i < samplesDataLength; i++) {
                    samplesRequestDataItem = samplesRequestDataItem.rows.item(i);
                    appendData += '<div style="padding-left:20px">' + (i + 1) + ". " + samplesRequestDataItem[TABLES.SAMPLES.SAMPLE_NAME] + '</div>';

                }
                appendData += '</div>';
            }

            appendData += '</div>';
            appendData += '</div>';
            appendData += '</div>';

            var selectPGQuery = "SELECT * FROM " + TABLES.DCRDDETAILING.TABLE + " DD INNER JOIN " +
                    TABLES.PRODUCTGROUPS.TABLE + " PG ON DD." + TABLES.DCRDDETAILING.BRAND_ID + "=PG." +
                    TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + " INNER JOIN " + TABLES.KEY_MSG.TABLE + " KM ON DD." +
                    TABLES.DCRDDETAILING.KEY_MESSAGE + "= KM." + TABLES.KEY_MSG.KEY_ID +
                    " WHERE " + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + "=?";
            var selectPGValues = new Array(_dcrDoctorSlNo);

            appendData += '<div class="panel panel-default">';
            appendData += '<div class="panel-heading" role="tab" id="headingOne">';
            appendData += '<h4 class="panel-title">';
            appendData += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree' + k + '" aria-expanded="true" aria-controls="collapseThree' + k + '">';
            appendData += '<i class="more-less glyphicon glyphicon-plus"></i>';
            appendData += 'Detailed Brands';
            appendData += '</a>';
            appendData += '</h4>';
            appendData += '<div class="panel-body">';

            $.when(dbObject.execute(selectPGQuery, selectPGValues)).done(function (selectPGData) {
                appendData += '<div id="collapseThree' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                for (var i = 0, selectPGDataItem = null; i < selectPGData.rows.length; i++) {
                    selectPGDataItem = selectPGData.rows.item(i);
//                    appendData += '<div class="container">';
                    appendData += '<div class="col-xs-12">';
                    appendData += '<div class="row" style="border:1px solid black">';
                    appendData += '<div style="padding-left:20px;font-size:16px;font-weight:bold;border-right:1px solid black" class="col-xs-6">Brand Name</div>';
                    appendData += '<div style="padding-left:20px;font-size:16px;font-weight:bold" class="col-xs-6">Key Message</div>';
                    appendData += '</div>';
                    appendData += '<div class="row" style="border:1px solid black">';
                    appendData += '<div style="padding-left:20px;border-right:1px solid black" class="col-xs-6">' + selectPGDataItem[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</div>';
                    appendData += '<div style="padding-left:20px" class="col-xs-6">' + selectPGDataItem[TABLES.KEY_MSG.KEY_CODE] + '</div>';
                    appendData += '</div>';
                    appendData += '</div>';
//                    appendData += '</div>';
                }
                appendData += '</div>';

                appendData += '</div>';
                appendData += '</div>';
                appendData += '</div>';

                appendData += '<div class="panel panel-default">';
                appendData += '<div class="panel-heading" role="tab" id="headingOne">';
                appendData += '<h4 class="panel-title">';
                appendData += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour' + k + '" aria-expanded="true" aria-controls="collapseFour' + k + '">';
                appendData += '<i class="more-less glyphicon glyphicon-plus"></i>';
                appendData += 'E-Detailed Brands';
                appendData += '</a>';
                appendData += '</h4>';
                appendData += '<div class="panel-body">';

                var selectEDQuery = "SELECT * FROM " + TABLES.EBRANDS.TABLE + " E inner join " + TABLES.PRODUCTGROUPS.TABLE +
                        " P on P." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=E." + TABLES.EBRANDS.BRAND_ID +
                        " inner join " + TABLES.CONTENT.TABLE + " C on C." + TABLES.CONTENT.ID + "=E." + TABLES.EBRANDS.CONTENT_ID + " WHERE " +
                        TABLES.EBRANDS.DCRDOCTOR_SLNO + "=?";
                var selectEDValues = new Array(_dcrDoctorSlNo);
                $.when(dbObject.execute(selectEDQuery, selectEDValues)).done(function (selectEDData) {
                    appendData += '<div id="collapseFour' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                    for (var i = 0, selectEDDataItem = null; i < selectEDData.rows.length; i++) {
                        selectEDDataItem = selectEDData.rows.item(i);
                        appendData += '<div class="container">';
                        appendData += '<div class="row">';
                        appendData += '<div class="col-xs-4">' + selectEDDataItem[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</div>';
                        appendData += '<div class="col-xs-4">' + selectEDDataItem[TABLES.CONTENT.NAME] + '</div>';
                        appendData += '<div class="col-xs-4">' + selectEDDataItem[TABLES.EBRANDS.TIME] + '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                    }
                    appendData += '</div>';
                    appendData += '</div>';
                    appendData += '</div>';
                    appendData += '</div>';
                    appendData += '<div class="panel panel-default">';
                    appendData += '<div class="panel-heading" role="tab" id="headingOne">';
                    appendData += '<h4 class="panel-title">';
                    appendData += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive' + k + '" aria-expanded="true" aria-controls="collapseFive' + k + '">';
                    appendData += '<i class="more-less glyphicon glyphicon-plus"></i>';
                    appendData += 'WorkedWith';
                    appendData += '</a>';
                    appendData += '</h4>';
                    appendData += '<div class="panel-body">';
                    var selectWWQuery = "SELECT * FROM " + TABLES.WORKED_WITH.TABLE + " WHERE " +
                            TABLES.WORKED_WITH.WORKEDWITH_ID + " IN (" + _workedWith + ")";
                    var selectWWValues = new Array();
                    $.when(dbObject.execute(selectWWQuery, selectWWValues)).done(function (selectWWData) {
                        appendData += '<div id="collapseFive' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                        var workedWithData = ""
                        for (var i = 0, selectWWDataItem = null; i < selectWWData.rows.length; i++) {
                            selectWWDataItem = selectWWData.rows.item(i);
                            workedWithData += selectWWDataItem[TABLES.WORKED_WITH.WORKEDWITH_NAME] + ",";
                        }
                        workedWithData = workedWithData.slice(0, -1);
                        appendData += '<div class="container">';
                        appendData += '<div class="row">';
                        appendData += '<div class="col-xs-12"> Worked With Names: ' + workedWithData + '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                        appendData += '</div>';
                        $('#accordion' + k).append(appendData);
                    });
                });
            });
        });
    }).fail(function (error) {
        alert(error);
    });
}

function toggleIcon(e) {
    $(e.target).parent().parent().find(".more-less").toggleClass('glyphicon-plus glyphicon-minus');
}

function displayAddedDoctorsWithId() {
    var selectQuery = "Select DR." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + ",DR." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO
            + ",DI." + TABLES.DOCTOR_INFO.NAME + ",DR." + TABLES.DCR_DOCTOR.WORKED_WITH
            + " FROM " + TABLES.DCR_DOCTOR.TABLE + " DR INNER JOIN " +
            TABLES.DOCTOR_INFO.TABLE + " DI ON DR." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "=DI." + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
            " WHERE DR." + TABLES.DCR_DOCTOR.DCR_SL_NO + "=? AND " + " DR." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"), selectedCustomer);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.DOCTOR_INFO.NAME];
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                $('.panel-group').on('hidden.bs.collapse', toggleIcon);
                $('.panel-group').on('shown.bs.collapse', toggleIcon);
                displayCustomerRelatedData(k, item[TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO].toString(), item[TABLES.DCR_DOCTOR.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}

function displayAddedChemistsWithId() {
    var selectQuery = "Select DR." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + ",DR." + TABLES.DCR_CHEMIST.CHEMIST_ID
            + ",DI." + TABLES.CHEMISTS.NAME + ",DR." + TABLES.DCR_CHEMIST.WORKED_WITH
            + " FROM " + TABLES.DCR_CHEMIST.TABLE + " DR INNER JOIN " +
            TABLES.CHEMISTS.TABLE + " DI ON DR." + TABLES.DCR_CHEMIST.CHEMIST_ID + "=DI." + TABLES.CHEMISTS.CHEMIST_ID +
            " WHERE DR." + TABLES.DCR_CHEMIST.DCR_SL_NO + "=? AND " + " DR." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + "=?";
    ;
    var selectValues = new Array($.session.get("ActivityId"), selectedCustomer);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.CHEMISTS.NAME] + "(" + (item[TABLES.DCR_CHEMIST.WORKED_WITH] !== null ? item[TABLES.DCR_CHEMIST.WORKED_WITH] : "") + ")";
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                displayCustomerRelatedData(k, item[TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO].toString(), item[TABLES.DCR_CHEMIST.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}

function displayAddedStockistWithId() {
    var selectQuery = "Select DR." + TABLES.DCR_STOCKIST.DCR_STOCK_ID + ",DR." + TABLES.DCR_STOCKIST.STOCKIST_ID
            + ",DI." + TABLES.STOCKIST.NAME + ",DR." + TABLES.DCR_STOCKIST.WORKED_WITH
            + " FROM " + TABLES.DCR_STOCKIST.TABLE + " DR INNER JOIN " +
            TABLES.STOCKIST.TABLE + " DI ON DR." + TABLES.DCR_STOCKIST.STOCKIST_ID + "=DI." + TABLES.STOCKIST.STOCKIST_ID +
            " WHERE DR." + TABLES.DCR_STOCKIST.DCR_SL_NO + "=? AND " + " DR." + TABLES.DCR_STOCKIST.DCR_STOCK_ID + "=?";
    var selectValues = new Array($.session.get("ActivityId"), selectedCustomer);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength > 0) {
            for (var k = 0, item = null; k < resultSetLength; k++) {
                item = data.rows.item(k);
                var appendData = '<div class="card" style="width: 100%;margin-top:20px">';
                appendData += '<div class="card-header deep-orange lighten-1 white-text">';
                appendData += item[TABLES.STOCKIST.NAME] + "(" + (item[TABLES.DCR_STOCKIST.WORKED_WITH] !== null ? item[TABLES.DCR_STOCKIST.WORKED_WITH] : "") + ")";
                appendData += '</div>';
                appendData += '<div class="card-body">';
                appendData += '<div class="panel-group" id="accordion' + k + '"  role="tablist">';
                appendData += '</div>';
                appendData += '</div>';
                $('#addedCustomers').append(appendData);
                displayCustomerRelatedData(k, item[TABLES.DCR_STOCKIST.DCR_STOCK_ID].toString(), item[TABLES.DCR_STOCKIST.WORKED_WITH]);
            }
        }
    }).fail(function (error) {
        alert(error);
    });
}
