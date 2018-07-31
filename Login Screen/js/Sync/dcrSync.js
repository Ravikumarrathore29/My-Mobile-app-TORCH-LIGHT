/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var db = openDatabase(DATABASE.NAME, DATABASE.VERSION, DATABASE.DISPLAY_NAME, DATABASE.MAX_SIZE);
var SinkDcrDoctorcall = false;
var SinkDcrChemistCall = false;
var SinkDcrunlistedDoctorCall = false;
var SinkDcrStockistCall = false;
var SinkLocationData = false;

function getFormattedDate(input) {
    var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    var result = input.replace(pattern, function (match, p1, p2, p3) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (p2 < 10 ? "0" + p2 : p2).slice(-2) + "-" + months[(p1 - 1)] + "-" + p3;
    });
    return result;
}

function SinkService() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DAILY_REPORT.TABLE + " WHERE " + TABLES.DAILY_REPORT.STATUS + "=? ORDER BY " + TABLES.DAILY_REPORT.ID + " ASC ", ['C'], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SinkDailyReportData(item[TABLES.DAILY_REPORT.DCR_SLNO], getFormattedDate(item[TABLES.DAILY_REPORT.ACTIVITY_DATE_TIME]),
                            item[TABLES.DAILY_REPORT.PERIOD], item[TABLES.DAILY_REPORT.ACTIVITY_TYPE], item[TABLES.DAILY_REPORT.DESCRIPTION],
                            item[TABLES.DAILY_REPORT.CREATED_DATE], i, item[TABLES.DAILY_REPORT.SYNC], dataset.length);
                }
            } else {

            }
        });
    });
}

function SinkDailyReportData(_id, _date, _period, _type, _desc, _cdate, _rid, _sync, _dataSetLength) {
    var NPERIOD;
    if (_period == 1)
    {
        NPERIOD = "0";
    } else if (_period == 2) {
        NPERIOD = "1";
    } else if (_period == 3) {
        NPERIOD = "2";
    }
    var request = {Employee_ID: $.session.get("User_ID"), DCRID: _id, DCRDate: _date, Period: NPERIOD,
        ActivityType: _type, Description: _desc, CreatedDate: _cdate,
        team_ID: $.session.get("Team_ID"), company_ID: $.session.get("Comapny_ID")};
    var jsondata = JSON.stringify(request);
    console.log(" meeting seding srequest = " + jsondata);
    if (_sync === "S")
    {
        if (_rid === (_dataSetLength - 1)) {
        } else {
            DeletedailyReport(_id);
        }
    } else if (_sync === "U") {
        SinkDCRTables(_id, _rid, _dataSetLength, _date, NPERIOD, _type);
    } else {
        if (navigator.onLine) {
            var serviceName = "AddDailyReport";
            $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
                if (isUndefinedNullOrEmpty(_data)) {
                } else {
                    if (_data == "true")
                    {
                        alert(" DATA Submited sucessfully for date :- " +  _cdate + " and Activity Type :- "+_type );
                        if (_type == 1)
                        {
                            SinkDCRTables(_id, _rid, _dataSetLength, _date, NPERIOD, _type);
                        } else {
                            if (_rid == (_dataSetLength - 1))
                            {
                                ADDLocalMappTable(_date, NPERIOD, _type);
                                UpdatedailyReport(_id);
                                SELECTRECORDSTOSYNC();
                                // SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                            } else {
                                ADDLocalMappTable(_date, NPERIOD, _type);
                                DeletedailyReport(_id);
                                SELECTRECORDSTOSYNC();
                                //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                            }
                        }
                    }
                }
            }).fail(function (error) {
                ajaxErrorCallBack(error);
            });

        }
    }
}

// deleting the records from daily report table w.r.t to DCR_SLNO
function DeletedailyReport(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DAILY_REPORT.TABLE + " WHERE " + TABLES.DAILY_REPORT.DCR_SLNO + "=?", [ID], Check, onError);
    });
}
// for updating the daily report table
//for updating the status value to "S"
function UpdatedailyReport(ID) {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE " + TABLES.DAILY_REPORT.TABLE + " SET " + TABLES.DAILY_REPORT.SYNC + "=? WHERE " + TABLES.DAILY_REPORT.DCR_SLNO + "=?", ["S", ID], function (tx, result) {
            if ($('#summaryModal').hasClass('in') && $('#summaryModal') !== undefined) {
                $('#summaryModal').modal('toggle');
                getActivityInfonew();
            }
        }, onError);
    });
}

function getActivityInfonew() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DAILY_REPORT.TABLE + " ORDER BY " + TABLES.DAILY_REPORT.ID + " DESC LIMIT 1", [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    $.session.set("LastActivityDate", ConvertIT(item['activity_date_time']));
                    $.session.set("LastActivityType", item["period"]);
                    $.session.remove("ActivityID");
                    $.session.remove("Period");
                    $.session.remove("Status");
                    $.session.remove("ActivityDate");
                    window.location = "EHome.html";
                }
            } else {
                window.location = "EHome.html";
            }
        });
    });
}

// call the all the function to sync the doctor call .unlisted call ,chemist call and stockist call
function SinkDCRTables(_id, _rid, _dataSetLength, _date, _nPeroid, _actType) {
    SinkDCRDoctor(_id, _date, _nPeroid, _actType, _rid, _dataSetLength);
    SinkLocationInfo(_id, _date);
    SinkDCRChemist(_id, _date, _nPeroid, _actType, _rid, _dataSetLength);
    SinkDCRUnlisted(_id, _date, _nPeroid, _actType, _rid, _dataSetLength);
    SinkDCRStockist(_id, _rid, _dataSetLength, _date, _nPeroid, _actType, _rid, _dataSetLength);
}

// select the all the records from Dcr_doctor table w.r.t to DCR_SLNO that is ID and joining with  DCRDDETAILING and DCRDSAMPLEDETAILS
function SinkDCRDoctor(_id, _date, _nPeroid, _actType, _rid, _dataSetLength) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT DD." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + ",DD." + TABLES.DCR_DOCTOR.DCR_SL_NO + ",DD." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO +
                ",DD." + TABLES.DCR_DOCTOR.TIME_SPENT + ",DD." + TABLES.DCR_DOCTOR.WORKED_WITH + ",DB." + TABLES.DCRDDETAILING.BRAND_ID +
                ",DB." + TABLES.DCRDDETAILING.KEY_MESSAGE + ",DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID + ",DS." + TABLES.DCRDSAMPLEDETAILS.QUANTITY +
                ",DS." + TABLES.DCRDSAMPLEDETAILS.SIGNATURE + ",DD." + TABLES.DCR_DOCTOR.REQUEST + ",DD." + TABLES.DCR_DOCTOR.REQUEST_DATE + ",DD." + TABLES.DCR_DOCTOR.OBJECTION +
                ",DD." + TABLES.DCR_DOCTOR.OBJECTION_CATEGORY + ",DD." + TABLES.DCR_DOCTOR.REMARK + ",DD." + TABLES.DCR_DOCTOR.RATE +
                ",DD." + TABLES.DCR_DOCTOR.C_DATE + ",DD." + TABLES.DCR_DOCTOR.CAMPAIGN + " FROM " + TABLES.DCR_DOCTOR.TABLE +
                " DD left join " + TABLES.DCRDDETAILING.TABLE + " DB on DB." + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO +
                "= DD." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + " left join " + TABLES.DCRDSAMPLEDETAILS.TABLE +
                " DS on DS." + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + "=DD." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + " WHERE " +
                TABLES.DCR_DOCTOR.DCR_SL_NO + "=? and DD." + TABLES.DCR_DOCTOR.STATUS + "=?", [_id, 'N'], function (tx, result) {
            dataset = result.rows;
            DADDED = dataset.length;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    var bkList = "";
                    if (item[TABLES.DCRDDETAILING.BRAND_ID] !== null) {
                        bkList = item[TABLES.DCRDDETAILING.BRAND_ID] + "|" + item[TABLES.DCRDDETAILING.KEY_MESSAGE];
                    }
                    var pqList = "";
                    if (item[TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID] !== null) {
                        pqList = item[TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID] + "|" + item[TABLES.DCRDSAMPLEDETAILS.QUANTITY] + "|" + item[TABLES.DCRDSAMPLEDETAILS.SIGNATURE];
                    }
                    SinkDCRDoctorTable(item[TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO], item[TABLES.DCR_DOCTOR.DCR_SL_NO],
                            item[TABLES.DCR_DOCTOR.DOCTOR_SL_NO], item[TABLES.DCR_DOCTOR.TIME_SPENT], item[TABLES.DCR_DOCTOR.WORKED_WITH],
                            bkList, pqList, item[TABLES.DCR_DOCTOR.REQUEST], item[TABLES.DCR_DOCTOR.REQUEST_DATE],
                            item[TABLES.DCR_DOCTOR.OBJECTION], item[TABLES.DCR_DOCTOR.OBJECTION_CATEGORY],
                            item[TABLES.DCR_DOCTOR.REMARK], item[TABLES.DCR_DOCTOR.RATE], _date, _nPeroid,
                            _actType, item[TABLES.DCR_DOCTOR.C_DATE], item[TABLES.DCR_DOCTOR.CAMPAIGN], i, (dataset.length - 1), _rid, _dataSetLength);
                }
            } else {
                SinkDcrDoctorcall = true;
                if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                {
                    if (_rid == (_dataSetLength - 1))
                    {
                        updateDCRSync(_id, _date, _nPeroid, _actType);
                        ADDLocalMappTable(_date, _nPeroid, _actType);
                        UpdatedailyReport(_id);
                        SELECTRECORDSTOSYNC();
                    } else {
                        updateDCRSync(_id, _date, _nPeroid, _actType);
                        ADDLocalMappTable(_date, _nPeroid, _actType);
                        DeletedailyReport(_id);
                        SELECTRECORDSTOSYNC();
                    }
                    //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                } else {
                    UpdatedailyReportRX(_id);
                }
            }
        });
    });
}


// calling the wcf service for syncing the doctor call ..
// if service return true then calling the delete function (delete the records from local db).
function SinkDCRDoctorTable(_dcrDID, _dLID, _docID, _time, _worked, _brands, _sku, _request, _requestByDate, _objection,
        _objectionCat, _remark, _rate, _date, NPERIOD, _actType, _cDate, _campaign, _id, _length, RID, DATASETLENGTH) {

    db.transaction(function (tx) {
        tx.executeSql("Select * from " + TABLES.DCRBRANDORDER.TABLE + " WHERE " + TABLES.DCRBRANDORDER.DCR_SLNO + "=? and " +
                TABLES.DCRBRANDORDER.DCR_DOCTOR_SLNO + "=?", [_dLID, _dcrDID], function (tx, result) {
            var brandOrderdRows = result.rows;
            var orderedBrands = "";
            for (var i = 0; i < brandOrderdRows.length; i++) {
                var brandOrder = brandOrderdRows.item(i);
                if (i === (brandOrderdRows.length - 1)) {
                    orderedBrands += brandOrder[TABLES.DCRBRANDORDER.BRAND_ID] + "$" + brandOrder[TABLES.DCRBRANDORDER.SKU_ID] + "$" +
                            brandOrder[TABLES.DCRBRANDORDER.STOCKIST_ID] + "$" + brandOrder[TABLES.DCRBRANDORDER.POB_QTY] + "$" +
                            0 + "$" + 0;
                } else {
                    orderedBrands += brandOrder[TABLES.DCRBRANDORDER.BRAND_ID] + "$" + brandOrder[TABLES.DCRBRANDORDER.SKU_ID] + "$" +
                            brandOrder[TABLES.DCRBRANDORDER.STOCKIST_ID] + "$" + brandOrder[TABLES.DCRBRANDORDER.POB_QTY] + "$" +
                            0 + "$" + 0 + "_";
                }
            }
            var request = {Employee_ID: $.session.get("User_ID"), Dcr_ID: _dLID, DcrDoctor_ID: _dcrDID, Doctor_Sl_No: _docID,
                Time: _time, Worked: _worked, Brand: _brands, Sample: _sku, Request: _request, RequestByDate: _requestByDate, Objection: _objection, ObjectionCategory: _objectionCat,
                RateThisCall: _rate, Remarks: _remark, DCRDate: _date,
                Period: NPERIOD, ActivityType: _actType, brandOrdered: orderedBrands,
                team_ID: $.session.get("Team_ID"), company_ID: $.session.get("Comapny_ID"),
                CreationDateTime: _cDate, CAMPAIGN: _campaign};
            var jsondata = JSON.stringify(request);
            if (navigator.onLine) {
                var serviceName = 'AddDoctorCall';
                $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
//                    SinkDcrDoctorcall = true;
                    if (isUndefinedNullOrEmpty(_data)) {
                    } else {
                        if (_id === _length) {
                            SinkDcrDoctorcall = true;
                            if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                            {
                                if (RID == (DATASETLENGTH - 1))
                                {
                                    updateDCRSync(_dLID, _date, NPERIOD, _actType);
                                    ADDLocalMappTable(_date, NPERIOD, _actType);
                                    UpdatedailyReport(_dLID);
                                    SELECTRECORDSTOSYNC();
                                } else {
                                    updateDCRSync(_dLID, _date, NPERIOD, _actType);
                                    ADDLocalMappTable(_date, NPERIOD, _actType);
                                    DeletedailyReport(_dLID);
                                    SELECTRECORDSTOSYNC();
                                }
                                //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                            } else {
                                UpdatedailyReportRX(_dLID);
                            }
                        }
                        if (_data == "true")
                        {
                            SYNCDCRDOCTOREDETAIL(_dcrDID, _dLID, _docID, _date);
                            DeleteDoctorCallADD(_dcrDID);
                            DeleteDCRDDETAILING(_dcrDID);
                            DeleteDCRDSAMPLEDETAILS(_dcrDID);
                        } else {
                            SinkDcrDoctorcall = false;
                        }
                    }
                }).fail(function (error) {
                    SinkDcrDoctorcall = false;
                    ajaxErrorCallBack(error);
                });
            }
        }, function (tx, error) {
            SinkDcrDoctorcall = false;
            alert(error.message);
        });
    });
}

// deleting the doctor call from DCR_Doctor table in local db with respect the DCRDOCTOR_SLNO
function DeleteDoctorCallADD(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCR_DOCTOR.TABLE + " WHERE " + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + "=?", [ID], Check, onError);
    });
}

// deleting the DCRDDETAILING(brands) records from DCRDDETAILING table in local db with respect the DCRDOCTOR_SLNO
function DeleteDCRDDETAILING(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCRDDETAILING.TABLE + " WHERE " + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO + "=?", [ID], Check, onError);
    });
}

// deleting the DCRDDETAILING(brands) records from DCRDDETAILING table in local db with respect the DCRDOCTOR_SLNO
function DeleteDCRDSAMPLEDETAILS(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCRDSAMPLEDETAILS.TABLE + " WHERE " + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO + "=?", [ID], Check, onError);
    });
}
function SYNCDCRDOCTOREDETAIL(DCRDID, DLID, DOCID, DATE) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM" + TABLES.EBRANDS.TABLE + " WHERE " + TABLES.EBRANDS.DCRDOCTOR_SLNO + "=? AND" +
                TABLES.EBRANDS.DCR_SL_NO + "=? AND " + TABLES.EBRANDS.CONTENT_ID + " NOT IN (0) ", [DCRDID, DLID], function (tx, result) {
            dataset = result.rows;
            // INTEGER ,DCR_SLNO INTEGER,BRANDID INTEGER,KEYID INTEGER, INTEGER, INTEGER, INTEGER)");
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SYNCDCRDOCTOREDETAILTABLE(DOCID, item["DCRDOCTOR_SLNO"], item["DCR_SLNO"], item["BRANDID"], item["TIME"], item["CONTENTID"], item["FEEDBCKID"], i, dataset.length, DATE)
                }
            } else {
                //SinkLocationData=true; }
            }
        });
    });
}

function SYNCDCRDOCTOREDETAILTABLE(DOCID, DCRDOCTOR_SLNO, DCR_ID, BRANDID, TIME, CONTENTID, FEEDBCKID, i, len, DATE) {
//Location_INFO_Add(String Employee_ID, String DCR_SLNO, String LCALL_ID, String Document_ID, String LAT, String LONG);
    var request = {Employee_ID: $.session.get("User_ID"), DCR_SLNO: DCR_ID, DOCTOR_SL_NO: DOCID, DCRDOCTOR_SLNO: DCRDOCTOR_SLNO, BRANDID: BRANDID, TIME: TIME, Activity_Date: DATE, CONTENTID: CONTENTID, FEEDBCKID: FEEDBCKID};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//        $.ajax({
//            type: "POST",
//            async: false,
//            url: $.session.get("URL") + "INSERTEDETAILEDDATA",
//            data: jsondata,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            processdata: true,
//            crossDomain: true,
//            success: function (result) {
//                if (isUndefinedNullOrEmpty(result)) {
//                } else {
//                    if (result == "true")
//                    {
//                        if (i == len - 1) {
//                            syncPageTracking(DCRDOCTOR_SLNO, DCR_ID);
//                        }
//                    } else {         //                        SinkDcrDoctorcall = false;
//                    }
//                }
//            },
//            error: function () {
//                SinkDcrDoctorcall = false;
//            } //        });
//        
        var serviceName = 'INSERTEDETAILEDDATA';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_data == "true")
                {
                    if (i == len - 1) {
                        syncPageTracking(DCRDOCTOR_SLNO, DCR_ID);
                    }
                } else {
                    SinkDcrDoctorcall = false;
                }
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}
function syncPageTracking(DCRDOCTOR_SLNO, DCR_ID) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT " + TABLES.EBRANDS.TABLE + ".*, " + TABLES.DCREDETAILPAGETRACKING.PAGE_ID + " , " +
                TABLES.DCREDETAILPAGETRACKING.VIEW_TIME + " , " + TABLES.DCREDETAILPAGETRACKING.PAGE_TITLE + " , " + TABLES.DCREDETAILPAGELIKE.PAGE_TRACKING_ID + " FROM " + TABLES.EBRANDS.TABLE + " INNER JOIN " + TABLES.DCREDETAILPAGETRACKING.TABLE + " ON (" + TABLES.EBRANDS.DCRDOCTOR_SLNO + " = " +
                TABLES.DCREDETAILPAGETRACKING.DCRDOCTOR_SLNO + " AND " + TABLES.EBRANDS.BRAND_ID + " = " + TABLES.DCREDETAILPAGETRACKING.BRAND_ID + " AND  " + TABLES.EBRANDS.CONTENT_ID + " = " +
                TABLES.DCREDETAILPAGETRACKING.CONTENT_ID + " ) LEFT JOIN " + TABLES.DCREDETAILPAGELIKE.TABLE +
                " ON " + TABLES.DCREDETAILPAGETRACKING.ID + " = " + TABLES.DCREDETAILPAGELIKE.PAGE_TRACKING_ID + " WHERE " +
                TABLES.EBRANDS.DCRDOCTOR_SLNO + "=?", [DCRDOCTOR_SLNO], function (tx, result) {
            var edetailDataset = result.rows;
            if (edetailDataset.length > 0) {
                for (var i = 0, item = null; i < edetailDataset.length; i++) {
                    item = edetailDataset.item(i);
                    if (item["PageTrackingId"] === null) {
                        syncPageData(item["DCRDOCTOR_SLNO"], item["BRANDID"], item["CONTENTID"], item["PageId"], item["ViewTime"], 0, item["PageTitle"]);
                    } else {
                        syncPageData(item["DCRDOCTOR_SLNO"], item["BRANDID"], item["CONTENTID"], item["PageId"], item["ViewTime"], 1, item["PageTitle"]);
                    }
                    if (i === edetailDataset.length - 1) {
                        DeleteEDETAILEDDATA(DCRDOCTOR_SLNO, DCR_ID);
                    }
                }
            }
        });
    });
}

function syncPageData(_DCRDoctorSLNO, _brandId, _contentId, _pageId, _viewTime, _like, _pageTitle) {
    var request = {Employee_ID: $.session.get("User_ID"), DCRDOCTOR_SLNO: _DCRDoctorSLNO, BRANDID: _brandId, CONTENTID: _contentId, PageId: _pageId, ViewTime: _viewTime, like: _like, PageTitle: _pageTitle};
    var jsondata = JSON.stringify(request);
    console.log(jsondata.toString());
//    $.ajax({
//        type: "POST",
    //        url: $.session.get("URL") + "INSERTEDETAILEDPAGEDATA",
    //        data: jsondata,
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
//        processdata: true,
    //        crossDomain: true,
    //        success: function (result) {
    //            deleteEdetailData(_DCRDoctorSLNO);
    //            if (result == "true") {
//            }
//        },
//        error: function (result) {
//            alert("error");
//            console.log(result.toString());
//        }
//    });

    var serviceName = 'INSERTEDETAILEDPAGEDATA';
    $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
        deleteEdetailData(_DCRDoctorSLNO);
        if (_data == "true") {
        }
    }).fail(function (error) {
        ajaxErrorCallBack(error);
    });
}


function deleteEdetailData(_DCRDoctorSLNO) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCREDETAILPAGETRACKING.TABLE + " WHERE " + TABLES.DCREDETAILPAGETRACKING.DCRDOCTOR_SLNO + "=?", [_DCRDoctorSLNO], Check, onError);
    });
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCREDETAILPAGELIKE.TABLE, null, Check, onError);
    });
}

function DeleteEDETAILEDDATA(ID, CID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.EBRANDS.TABLE + " WHERE " + TABLES.EBRANDS.DCRDOCTOR_SLNO + "=? AND" + TABLES.EBRANDS.DCR_SL_NO + "=?", [ID, CID], Check, onError);
    });
}

function SinkLocationInfo(ID, DATE) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.LOCTION_INFO.TABLE + " WHERE " + TABLES.LOCTION_INFO.DCR_ID + "=?", [ID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SinkLOcationTable(item["DCR_ID"], item["LCALL_ID"], item["DOCUMENT_ID"], item["LAT"], item["LONG"], DATE, item["Document_To"])
                }
            } else {
                SinkLocationData = true;
            }
        });
    });
}

function SinkLOcationTable(DCR_ID, LCALL_ID, DOCUMENT_ID, LAT, LONG, DATE, Document_To) {
//Location_INFO_Add(String Employee_ID, String DCR_SLNO, String LCALL_ID, String Document_ID, String LAT, String LONG);
    var request = {Employee_ID: $.session.get("User_ID"), DCR_SLNO: DCR_ID, LCALL_ID: LCALL_ID, Document_ID: DOCUMENT_ID, LAT: LAT, LONG: LONG, Activity_Date: DATE, Document_To: Document_To};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {

        var serviceName = 'Location_INFO_Add';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_data == "true")
                {
                    SinkLocationData = true;
                    DeleteLocationIDCallADD(DCR_ID, LCALL_ID);
                } else {
                    SinkLocationData = false;
                }
            }
        }).fail(function (error) {
            // ajaxErrorCallBack(error);
        });
    }
}


function  DeleteLocationIDCallADD(DCR_ID, LCALL_ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.LOCTION_INFO.TABLE + " WHERE " + TABLES.LOCTION_INFO.DCR_ID + "=? AND " + TABLES.LOCTION_INFO.L_CALL_ID + "=?", [DCR_ID, LCALL_ID], Check, onError);
    });
}

//same as above 
function SinkDCRUnlisted(ID, DATE, NPERIOD, ACTTYPE, _rid, _dataSetLength) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT DD." + TABLES.DCRUNLISTEDDOCTORS.DCR_UNLIST_ED_DOCTOR_SL_NO + " ,DD." + TABLES.DCRUNLISTEDDOCTORS.DCR_SL_NO +
                " ,DD." + TABLES.DCRUNLISTEDDOCTORS.DOCTOR_NAME + " ,DD." + TABLES.DCRUNLISTEDDOCTORS.SPECIALITY_ID + " ,DD." + TABLES.DCRUNLISTEDDOCTORS.CLASSIFICATION + " ,DD." + TABLES.DCRUNLISTEDDOCTORS.TIME_SPENT +
                " ,DD." + TABLES.DCRUNLISTEDDOCTORS.WORKED_WITH + " ,DB." + TABLES.DCRDDETAILING.BRAND_ID +
                " ,DB." + TABLES.DCRDDETAILING.KEY_MESSAGE + " ,DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID +
                " ,DS." + TABLES.DCRDSAMPLEDETAILS.QUANTITY + " ,DD." + TABLES.DCRUNLISTEDDOCTORS.C_DATE + " FROM " + TABLES.DCRUNLISTEDDOCTORS.TABLE + " DD LEFT JOIN " + TABLES.DCRDDETAILING.TABLE +
                " DB on DB." + TABLES.DCRDDETAILING.DCR_DOCTOR_SL_NO +
                "= DD." + TABLES.DCRUNLISTEDDOCTORS.DCR_UNLIST_ED_DOCTOR_SL_NO +
                " LEFT JOIN " + TABLES.DCRDSAMPLEDETAILS.TABLE +
                " DS ON DS." + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO +
                "= DD." + TABLES.DCRUNLISTEDDOCTORS.DCR_UNLIST_ED_DOCTOR_SL_NO +
                " WHERE " + TABLES.DCRUNLISTEDDOCTORS.DCR_SL_NO + "=?", [ID], function (tx, result) {
            dataset = result.rows;
            UDADDED = dataset.length;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SinkDCRUnlistedTable(item["DCRUNLISTEDDOCTOR_SLNO"], item["DCR_SLNO"], item["DOCTORNAME"], item["SPECIALITY_ID"], item["CLASSIFICATION"], item["TimeSpent"], item["WorkedWith"], item["bklist"], item["pqlist"], DATE, NPERIOD, ACTTYPE, item["CDate"], i, (dataset.length - 1), _rid, _dataSetLength);
                }
            } else {
                SinkDcrunlistedDoctorCall = true;
                if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                {
                    if (_rid == (_dataSetLength - 1))
                    {
                        updateDCRSync(ID, DATE, NPERIOD, ACTTYPE);
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        UpdatedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    } else {
                        updateDCRSync(ID, DATE, NPERIOD, ACTTYPE);
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        DeletedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    }
                    //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                } else {
                    UpdatedailyReportRX(ID);
                }
            }
        }, function (tx, error) {
            alert(error.message);
        });
    });
}
function SinkDCRUnlistedTable(DCRDID, DLID, DOCNAME, SPEC, CLASS, TIME, WORKED, BRANDS, SKU, DATE, NPERIOD, ACTTYPE, CDATE, _id, _length, RID, DATASETLENGTH) {
    if (navigator.onLine) {
        var request = {Employee_ID: $.session.get("User_ID"), DcrUnlistedDoctor_ID: DCRDID, Dcr_ID: DLID, Doctor_Name: DOCNAME, Speciality_ID: SPEC, Time: TIME, Worked: WORKED, Brand: BRANDS, Sample: SKU, DCRDate: DATE, Period: NPERIOD, ActivityType: ACTTYPE, team_ID: $.session.get("Team_ID"), company_ID: $.session.get("Comapny_ID"), CreationDateTime: CDATE};
        ;
        var jsondata = JSON.stringify(request);
//        $.ajax({
//            type: "POST",
//            async: false,
//            url: $.session.get("URL") + "AddUnlistedDoctorCall",
//            data: jsondata,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            processdata: true,
//            crossDomain: true,
//            success: function (result) {
//                SinkDcrunlistedDoctorCall = result;
//                if (isUndefinedNullOrEmpty(result)) {
//                } else {
//                    if (result == "true")
//                    {
        //                        SYNCUNLISTEDDCRDOCTOREDETAIL(DCRDID, DLID, DATE);
        //                        DeleteUDoctorCallADD(DCRDID);
//                        DeleteDCRDDETAILING(DCRDID);
        //                        DeleteDCRDSAMPLEDETAILS(DCRDID);
//
//                    } else {
        //                        SinkDcrunlistedDoctorCall = false;
        //                    }
//                }
//            },
        //            error: function () {
//                SinkDcrunlistedDoctorCall = false;
//            }
//        });

        var serviceName = 'AddUnlistedDoctorCall';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_id === _length) {
                    SinkDcrunlistedDoctorCall = true;
                    if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                    {
                        if (RID == (DATASETLENGTH - 1))
                        {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            UpdatedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        } else {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            DeletedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        }
                        //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                    } else {
                        UpdatedailyReportRX(DLID);
                    }
                }
                if (_data == "true") {
//                    SinkDcrunlistedDoctorCall = true;
                    SYNCUNLISTEDDCRDOCTOREDETAIL(DCRDID, DLID, DATE);
                    DeleteUDoctorCallADD(DCRDID);
                    DeleteDCRDDETAILING(DCRDID);
                    DeleteDCRDSAMPLEDETAILS(DCRDID);
                } else {
                    SinkDcrunlistedDoctorCall = false;
                }
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}
// deleting  the unlisted doctor call from DCRUNLISTEDDOCTORS...
function DeleteUDoctorCallADD(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCRUNLISTEDDOCTORS.TABLE + " WHERE " + TABLES.DCRUNLISTEDDOCTORS.DCR_UNLIST_ED_DOCTOR_SL_NO + "=?", [ID], Check, onError);
    });
}

function SYNCUNLISTEDDCRDOCTOREDETAIL(DCRDID, DLID, DATE) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " +
                TABLES.EUNLISTEDBRANDS.TABLES + " WHERE " +
                TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO +
                "=? AND " + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "=? AND " +
                TABLES.EUNLISTEDBRANDS.CONTENT_ID + " NOT IN (0)", [DCRDID, DLID], function (tx, result) {
            dataset = result.rows;
            // INTEGER ,DCR_SLNO INTEGER,BRANDID INTEGER,KEYID INTEGER, INTEGER, INTEGER, INTEGER)");
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SYNCUNLISTEDDCRDOCTOREDETAILTABLE(item["DCRULDOCTOR_SLNO"], item["DCR_SLNO"], item["BRANDID"], item["TIME"], item["CONTENTID"], item["FEEDBCKID"], i, dataset.length, DATE);
                }
            } else {
//SinkLocationData=true;
            }
        });
    });
}
function SYNCUNLISTEDDCRDOCTOREDETAILTABLE(DCRDOCTOR_SLNO, DCR_ID, BRANDID, TIME, CONTENTID, FEEDBCKID, i, len, DATE) {
//Location_INFO_Add(String Employee_ID, String DCR_SLNO, String LCALL_ID, String Document_ID, String LAT, String LONG);
    var request = {Employee_ID: $.session.get("User_ID"), DCR_SLNO: DCR_ID, DCRunlistedDOCTOR_SLNO: DCRDOCTOR_SLNO, BRANDID: BRANDID, TIME: TIME, Activity_Date: DATE, CONTENTID: CONTENTID, FEEDBCKID: FEEDBCKID};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//        $.ajax({
//            type: "POST",
//            async: false,
//            url: $.session.get("URL") + "INSERTEDETAILEDUnlistedDoctorDATA",
//            data: jsondata,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            processdata: true,
//            crossDomain: true,
//            success: function (result) {
//                if (isUndefinedNullOrEmpty(result)) {
//                }
//                else {
//                    if (result == "true")
//                    {
//                        syncUnlistedDoctorPageTracking(DCRDOCTOR_SLNO);
//                        if (i == len - 1) {
//                            DeleteUNLISTEDEDETAILEDDATA(DCRDOCTOR_SLNO, DCR_ID);
//                        }
//
//                    } //                    else {
//                        SinkDcrDoctorcall = false;
//                    }
//                }
//            },
//            error: function (result) {
//                console.log(result.toString());
//                SinkDcrDoctorcall = false; //            }
//        });
        var serviceName = 'INSERTEDETAILEDUnlistedDoctorDATA';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_data == "true")
                {
                    syncUnlistedDoctorPageTracking(DCRDOCTOR_SLNO);
                    if (i == len - 1) {
                        DeleteUNLISTEDEDETAILEDDATA(DCRDOCTOR_SLNO, DCR_ID);
                    }
                } else {
                    SinkDcrDoctorcall = false;
                }
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}

function syncUnlistedDoctorPageTracking(DCRDOCTOR_SLNO) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT" + TABLES.EUNLISTEDBRANDS.TABLE + ".*," +
                TABLES.DCREDETAILPAGETRACKING.PAGE_ID +
                " , " + TABLES.DCREDETAILPAGETRACKING.VIEW_TIME +
                " , " + TABLES.DCREDETAILPAGETRACKING.PAGE_TITLE +
                " ," + TABLES.DCREDETAILPAGELIKE.PAGE_TRACKING_ID +
                " FROM " + TABLES.EUNLISTEDBRANDS.TABLE + " INNER JOIN " +
                TABLES.DCREDETAILPAGETRACKING.TABLE + "ON" + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO +
                "=" + TABLES.DCREDETAILPAGETRACKING.DCR_DOCTOR_SL_NO +
                "LEFT JOIN" + TABLES.DCREDetailPageLIKE.TABLE + "on" + TABLES.DCREDETAILPAGETRACKING.ID + "=" + TABLES.DCREDETAILPAGELIKE.PAGE_TRACKING_ID + " WHERE " + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "=?", [DCRDOCTOR_SLNO], function (tx, result) {
            var edetailDataset = result.rows;
            if (edetailDataset.length > 0) {
                for (var i = 0, item = null; i < edetailDataset.length; i++) {
                    item = edetailDataset.item(i);
                    if (item["PageTrackingId"] === null) {
                        syncUnlistedPageData(item["DCRULDOCTOR_SLNO"], item["BRANDID"], item["CONTENTID"], item["PageId"], item["ViewTime"], 0, "pdf");
                    } else {
                        syncUnlistedPageData(item["DCRULDOCTOR_SLNO"], item["BRANDID"], item["CONTENTID"], item["PageId"], item["ViewTime"], 1, "pdf");
                    }
                }
            }
        });
    });
}

function syncUnlistedPageData(_DCRDoctorSLNO, _brandId, _contentId, _pageId, _viewTime, _like, _pageTitle) {
    var request = {Employee_ID: $.session.get("User_ID"), DCRunlistedDOCTOR_SLNO: _DCRDoctorSLNO, BRANDID: _brandId, CONTENTID: _contentId, PageId: _pageId, ViewTime: _viewTime, like: _like, PageTitle: _pageTitle};
    var jsondata = JSON.stringify(request);
    console.log(jsondata.toString());
//    $.ajax({
    //        type: "POST",
    //        url: $.session.get("URL") + "INSERTEDETAILEDUnlistedPAGEDATA",
    //        data: jsondata,
//        contentType: "application/json; charset=utf-8",
//       dataType: "json",
//        processdata: true,
//        crossDomain: true,
//        success: function (result) {
//            deleteUnlistedEdetailData(_DCRDoctorSLNO);
//            if (result == "true") {
//            }
//        },
//        error: function (result) {
//            alert("error"); //            console.log(result.toString());
//        }
//    });
    var serviceName = 'INSERTEDETAILEDUnlistedPAGEDATA';
    $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
        deleteUnlistedEdetailData(_DCRDoctorSLNO);
        if (_data == "true") {
        }
    }).fail(function (error) {
        ajaxErrorCallBack(error);
    });
}

function DeleteUNLISTEDEDETAILEDDATA(ID, CID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.EUNLISTEDBRANDS.TABLES + " WHERE " + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "=? AND" + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "=? ", [ID, CID], Check, onError);
    });
}

function deleteUnlistedEdetailData(_DCRDoctorSLNO) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCREDETAILPAGETRACKING.TABLE + " WHERE " + TABLES.DCREDETAILPAGETRACKING.DCRDOCTOR_SLNO + "=?", [_DCRDoctorSLNO], Check, onError);
    });
}

function SinkDCRChemist(ID, DATE, NPERIOD, ACTTYPE, _rid, _dataSetLength) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT DD." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + ",DD." + TABLES.DCR_CHEMIST.DCR_SL_NO +
                ",DD." + TABLES.DCR_CHEMIST.CHEMIST_ID + ",DD." + TABLES.DCR_CHEMIST.TIME_SPENT +
                ",DD." + TABLES.DCR_CHEMIST.WORKED_WITH + ",DS." + TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID +
                ",DD." + TABLES.DCR_CHEMIST.C_DATE + ",DD." + TABLES.DCR_CHEMIST.CAMPAIGN + " FROM " + TABLES.DCR_CHEMIST.TABLE +
                " DD left join " + TABLES.DCRDSAMPLEDETAILS.TABLE + " DS on DS." + TABLES.DCRDSAMPLEDETAILS.DCR_DOCTOR_SL_NO +
                "= DD." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + " WHERE DD." + TABLES.DCR_CHEMIST.DCR_SL_NO + "=?", [ID], function (tx, result) {
            dataset = result.rows;
            CHADDED = dataset.length;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    var pqList = "";
                    if (item[TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID] !== null) {
                        pqList = item[TABLES.DCRDSAMPLEDETAILS.SAMPLE_ID] + "|" + item[TABLES.DCRDSAMPLEDETAILS.QUANTITY] + "|" + item[TABLES.DCRDSAMPLEDETAILS.SIGNATURE];
                    }
                    SinkDCRChemistTable(item[TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO], item[TABLES.DCR_CHEMIST.DCR_SL_NO], item[TABLES.DCR_CHEMIST.CHEMIST_ID],
                            item[TABLES.DCR_CHEMIST.TIME_SPENT], item[TABLES.DCR_CHEMIST.WORKED_WITH], pqList, DATE, NPERIOD, ACTTYPE, item[TABLES.DCR_CHEMIST.C_DATE], item[TABLES.DCR_CHEMIST.CAMPAIGN]
                            , i, (dataset.length - 1), _rid, _dataSetLength);
                }
            } else {
                SinkDcrChemistCall = true;
                if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                {
                    if (_rid == (_dataSetLength - 1))
                    {
                        updateDCRSync(ID, DATE, NPERIOD, ACTTYPE);
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        UpdatedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    } else {
                        updateDCRSync(ID, DATE, NPERIOD, ACTTYPE);
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        DeletedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    }
                    //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                } else {
                    UpdatedailyReportRX(ID);
                }
            }
        }, function (tx, error) {
            alert(error.message);
        });
    });
}

function SinkDCRChemistTable(DCRDID, DLID, CID, TIME, WORKED, SKU, DATE, NPERIOD, ACTTYPE, CDATE, CAMPAIGN, _id, _length, RID, DATASETLENGTH) {
    var request = {Employee_ID: $.session.get("User_ID"), DcrChemist_ID: DCRDID, Dcr_ID: DLID, Chemist_Sl_No: CID, Time: TIME, Worked: WORKED, Sample: SKU, DCRDate: DATE, Period: NPERIOD, ActivityType: ACTTYPE, team_ID: $.session.get("Team_ID"), company_ID: $.session.get("Comapny_ID"), CreationDateTime: CDATE, CAMPAIGN: CAMPAIGN};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        var serviceName = 'AddChemistCall';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_id === _length) {
                    SinkDcrChemistCall = true;
                    if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                    {
                        if (RID == (DATASETLENGTH - 1))
                        {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            UpdatedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        } else {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            DeletedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        }
                        //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                    } else {
                        UpdatedailyReportRX(DLID);
                    }
                }
                if (_data == "true")
                {
//                    SinkDcrChemistCall = true;
                    DeleteChemistCallADD(DCRDID);
                    DeleteDCRDSAMPLEDETAILS(DCRDID);
                } else {
                    SinkDcrChemistCall = false;
                }
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}

// deleting the chenist call from DCRCHEMIST table w.r.t id...
function DeleteChemistCallADD(ID) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.DCR_CHEMIST.TABLE + " WHERE " + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + "=?", [ID], Check, onError);
    });
}
//checking the condition  if(SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall) if it ia true then //checking for the record is last records if it is true inserting 1 record to maptable,& updating the value of sink column in dailyreport table as 
//and syncing the records from maptable
//if the condition false it will  delete the record from dailyreport and following are same as above
//if 1st condition is false ,update the status column as U in daily reports
function SinkDCRStockist(ID, RID, DATASETLENGTH, DATE, NPERIOD, ACTTYPE, _rid, _dataSetLength) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DCR_STOCKIST.TABLE + " WHERE " + TABLES.DCR_STOCKIST.DCR_SL_NO + "=?", [ID], function (tx, result) {
            dataset = result.rows;
            STADDED = dataset.length;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SinkDCRStockistTable(item[TABLES.DCR_STOCKIST.DCR_STOCK_ID], item[TABLES.DCR_STOCKIST.DCR_SL_NO], item[TABLES.DCR_STOCKIST.STOCKIST_ID],
                            item[TABLES.DCR_STOCKIST.TIME_SPENT], item[TABLES.DCR_STOCKIST.WORKED_WITH], item[TABLES.DCR_STOCKIST.DOB], DATE, NPERIOD, ACTTYPE, item[TABLES.DCR_STOCKIST.C_DATE], i, (dataset.length - 1), _rid, _dataSetLength);
                }
//                if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
//                {
//                    if (RID == (DATASETLENGTH - 1))
//                    {
//                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
//                        UpdatedailyReport(ID);
//                        SELECTRECORDSTOSYNC();
//                    } else {
//                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
//                        DeletedailyReport(ID);
//                        SELECTRECORDSTOSYNC();
//                    }
//                    //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
//                } else {
//                    UpdatedailyReportRX(ID);
//                }
            } else {
                SinkDcrStockistCall = true;
                if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrDoctorcall && SinkLocationData)
                {
                    if (RID == (DATASETLENGTH - 1))
                    {
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        UpdatedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    } else {
                        ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                        DeletedailyReport(ID);
                        SELECTRECORDSTOSYNC();
                    }
                    // SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                } else {
                    UpdatedailyReportRX(ID);
                }
            }
        });
    });
}

function SinkDCRStockistTable(DCRDID, DLID, CID, TIME, WORKED, DOB, DATE, NPERIOD, ACTTYPE, CDATE, _id, _length, RID, DATASETLENGTH) {
    var request = {Employee_ID: $.session.get("User_ID"), DcrStockist_ID: DCRDID, Dcr_ID: DLID, Stockiest_Sl_No: CID, Time: TIME, Worked: WORKED, Dob: DOB, DCRDate: DATE, Period: NPERIOD, ActivityType: ACTTYPE, team_ID: $.session.get("Team_ID"), company_ID: $.session.get("Comapny_ID"), CreationDateTime: CDATE};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//$.ajax({
//type: "POST",
//        async: false, //        url: $.session.get("URL") + "AddStockiestCall",
//        data: jsondata,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        processdata: true,
//        crossDomain: true,
//        success: function (result) {
//        SinkDcrStockistCall = result;
//                if (isUndefinedNullOrEmpty(result)) {
//        } else {
//        if (result == "true")
//        {
//        DeleteStockistCallADD(DCRDID);
//        } else {
//        SinkDcrStockistCall = false;
//        }
//        }
//        },
//        error: function (result) {
//        SinkDcrStockistCall = false;
//        }
//});


        var serviceName = 'AddStockiestCall';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_id === _length) {
                    SinkDcrStockistCall = true;
                    if (SinkDcrChemistCall && SinkDcrunlistedDoctorCall && SinkDcrStockistCall && SinkDcrDoctorcall && SinkLocationData)
                    {
                        if (RID == (DATASETLENGTH - 1))
                        {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            UpdatedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        } else {
                            updateDCRSync(DLID, DATE, NPERIOD, ACTTYPE);
                            ADDLocalMappTable(DATE, NPERIOD, ACTTYPE);
                            DeletedailyReport(DLID);
                            SELECTRECORDSTOSYNC();
                        }
                        //SinkDCRTOMAINTABLES(ID,RID,DATASETLENGTH,DATE,NPERIOD);
                    } else {
                        UpdatedailyReportRX(DLID);
                    }
                }
                if (_data == "true")
                {
//                    SinkDcrStockistCall = true;
                    DeleteStockistCallADD(DCRDID);
                } else {
                    SinkDcrStockistCall = false;
                }
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });
    }
}


//Calling this service for mapping the data from sql server temp table to main table of webserver
function SinkDCRTOMAINTABLES(DATE, NPERIOD, TYPE, ival, dlength) {
    var request = {Employee_id: $.session.get("User_ID"), ActivityDate: DATE, ActivityPeriod: NPERIOD, Type: TYPE};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//$.ajax({
//type: "POST",
//        async: false,
//        url: $.session.get("URL") + "GetMainTable",
//        data: jsondata,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        processdata: true,
//        crossDomain: true, //        success: function (result) {
//        if (isUndefinedNullOrEmpty(result)) {
//        } else {
//        if (result == "true")
//        {
//        DELETELocalMappTableRECORDS(DATE, NPERIOD);
//        }
//        if (ival == dlength) {
//        UpdateLocationInfo($.session.get("User_ID"))
//        } //        }
//        },
//        error: function (result) {
//
//        }
//});

        var serviceName = 'GetMainTable';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_data == "true")
                {
                    DELETELocalMappTableRECORDS(DATE, NPERIOD);
                }
                if (ival == dlength) {
                    UpdateLocationInfo($.session.get("User_ID"));
                } //        }
            }
        }
        ).fail(function (error) {
//            ajaxErrorCallBack(error);
        });
    }
}


function ADDLocalMappTable(DateN, Period, TYPE) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.MAPPTABLE.TABLE + " WHERE " + TABLES.MAPPTABLE.DATE + "=? AND " + TABLES.MAPPTABLE.PERIOD + "=?", [DateN, Period], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
            } else {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO " + TABLES.MAPPTABLE.TABLE + " ( " + TABLES.MAPPTABLE.DATE + " , " + TABLES.MAPPTABLE.PERIOD + " , " + TABLES.MAPPTABLE.TYPE + " ) VALUES (?,?,?)", [DateN, Period, TYPE], function (tx, result) {
                        if (TYPE != 1) {
                            window.location = 'EHome.html';
                        }
                        SELECTRECORDSTOSYNC();
                    }, onError);
                });
            }
        });
    });
}
function UpdatedailyReportRX(ID) {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE " + TABLES.DAILY_REPORT.TABLE + " SET " + TABLES.DAILY_REPORT.SYNC + "=? WHERE " + TABLES.DAILY_REPORT.DCR_SLNO + "=?", ["U", ID], Check, onError);
    });
}
// selecting the all records from MAPPTABLE for mapping the data in sql server...
function SELECTRECORDSTOSYNC() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.MAPPTABLE.TABLE, [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    SinkDCRTOMAINTABLES(item[TABLES.MAPPTABLE.DATE], item[TABLES.MAPPTABLE.PERIOD],
                            item[TABLES.MAPPTABLE.TYPE], i, dataset.length - 1);
                }
            } else {
            }
        });
    });
}




function SinkDCRTOMAINTABLES(DATE, NPERIOD, TYPE, ival, dlength) {
    var request = {Employee_id: $.session.get("User_ID"), ActivityDate: DATE, ActivityPeriod: NPERIOD, Type: TYPE};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//$.ajax({
//type: "POST",
//        async: false,
//        url: $.session.get("URL") + "GetMainTable",
//        data: jsondata,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        processdata: true,
//        crossDomain: true,
//        success: function (result) {
//        if (isUndefinedNullOrEmpty(result)) {
//        } else {
//        if (result == "true")
//        {
//        DELETELocalMappTableRECORDS(DATE, NPERIOD);
//        }
//        if (ival == dlength) {
//        UpdateLocationInfo($.session.get("User_ID"))         }
//        }
//        },
//        error: function (result) {
//        }
//});
        var serviceName = 'GetMainTable';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else {
                if (_data == "true")
                {
                    alert(" Now Data is sync to main Table For Date :- "+ DATE +"   and  ACtivity Type :- "+TYPE );
                    DELETELocalMappTableRECORDS(DATE, NPERIOD);
                }
                if (ival == dlength) {
                    UpdateLocationInfo($.session.get("User_ID"));
                }
            }

        }).fail(function (error) {
            ajaxErrorCallBack(error);
        });


    }
}
function UpdateLocationInfo(Employee_ID) {
    var request = {Employee_ID: Employee_ID};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
//$.ajax({
//type: "POST",
//        url: $.session.get("URL") + "Updatelocation",
//        data: jsondata,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        processdata: true,
//        crossDomain: true,
//        success: function (result) {
//        },
//        error: function (result) {
//        }
//});
        var serviceName = 'Updatelocation';
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {

        });
    }
}


// deleting the records from maptable ...
function DELETELocalMappTableRECORDS(DATE, PERIOD) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM " + TABLES.MAPPTABLE.TABLE + " WHERE " + TABLES.MAPPTABLE.DATE + "=? AND " + TABLES.MAPPTABLE.PERIOD + "=?", [DATE, PERIOD], Check, onError);
    });
}

function DeleteStockistCallADD(ID) {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.DCR_STOCKIST.TABLE + ' WHERE ' + TABLES.DCR_STOCKIST.DCR_STOCK_ID + ' = ?', [ID], Check, onError);
    });
}

function Check() {

}

function onError(tx, error) {
    alert(error.message);
}

function ajaxErrorCallBack(_message) {
//    alert("Error while syncing please try after some time.");
}

function deleteLatestCustomerAdded() {
    var deleteQuery = "DELETE FROM " + TABLES.LATEST_CUSTOMER_ADDED.TABLE;
    $.when(dbObject.execute(deleteQuery, new Array())).done(function (_data) {
        $.session.set('customerDCRSLNNO', '');
        $.session.set('chemistName', '');
        $.session.set('DoctorName', '');
        $.session.set('ActivityId', '');
        $.session.set('customerId', '');
        $.session.set('stockiestName', '');
    });
}

function updateDCRSync(_dlid, _date, _nPeriod, _actType) {
    var request = {Employee_ID: $.session.get("User_ID"), Dcr_ID: _dlid, DCRDate: _date, Period: _nPeriod, ActivityType: _actType
        , doctorCount: DADDED, chemistCount: CHADDED, unlistedCount: UDADDED, stockistCount: STADDED};
    var jsondata = JSON.stringify(request);
    $.ajax({
        type: "POST",
        async: false,
        url: $.session.get("URL") + "UpdateDCRTable",
        data: jsondata,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processdata: true,
        crossDomain: true,
        success: function (result) {
            if (isUndefinedNullOrEmpty(result)) {
            } else {
                if (result == "true")
                {

                } else {
                    if ($('#summaryModal').hasClass('in')) {
                        syncError();
                        $('#summaryModal').modal('toggle');
                        getActivityInfonew();
                    }
                }
            }
        },
        error: function (result, status, error) {
            if ($('#summaryModal').hasClass('in')) {
                syncError();
                $('#summaryModal').modal('toggle');
                getActivityInfonew();
            }
        }
    });
}

function showAddedCustomers() {
    var selectQuery = "SELECT DI." + TABLES.DOCTOR_INFO.NAME + ",DD." + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + " FROM " + TABLES.DCR_DOCTOR.TABLE + " DD INNER JOIN " + TABLES.DOCTOR_INFO.TABLE +
            " DI ON DD." + TABLES.DCR_DOCTOR.DOCTOR_SL_NO + "=DI." + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
            " WHERE DD." + TABLES.DCR_DOCTOR.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var appendContent = "<div class='row' style='border: 1px solid black'>";
        appendContent += "<div class='col-xs-12'>";
        if (data.rows.length > 0) {
            appendContent += "<div class='row'>";
            appendContent += "<p style='font-size:18px;font-weight:bold;padding-top:5px;padding-left:5px;background-color:#ff7043;color:white;width:100%'> Added Doctors </p>";
            appendContent += "</div>";
        }
        for (var i = 0; i < data.rows.length; i++) {
            var item = data.rows.item(i);
            appendContent += "<div class='row'>";
            appendContent += "<div class='col-xs-12 addedCustomers' data='" + item[TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO] + "' data-item='D'>";
            appendContent += "<p style='padding:5px;background-color:gainsboro'> " + (i + 1) + ". " + item[TABLES.DOCTOR_INFO.NAME] + "</p>";
            appendContent += "</div>";
            appendContent += "</div>";
        }
        appendContent += "</div>";
        appendContent += "</div>";

        var selectChemistQuery = "SELECT DI." + TABLES.CHEMISTS.NAME + ",DD." + TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO + " FROM " + TABLES.DCR_CHEMIST.TABLE + " DD INNER JOIN " + TABLES.CHEMISTS.TABLE +
                " DI ON DD." + TABLES.DCR_CHEMIST.CHEMIST_ID + "=DI." + TABLES.CHEMISTS.CHEMIST_ID +
                " WHERE DD." + TABLES.DCR_CHEMIST.DCR_SL_NO + "=?";
        var selectChemistValues = new Array($.session.get("ActivityId"));

        $.when(dbObject.execute(selectChemistQuery, selectChemistValues)).done(function (data) {
            appendContent += "<div class='row' style='margin-top:5px;border: 1px solid black''>";
            appendContent += "<div class='col-xs-12'>";
            if (data.rows.length > 0) {
                appendContent += "<div class='row'>";
                appendContent += "<p style='font-size:18px;font-weight:bold;padding-top:5px;padding-left:5px;background-color:#ff7043;color:white;width:100%'> Added Chemists </p>";
                appendContent += "</div>";
            }
            for (var i = 0; i < data.rows.length; i++) {
                var item = data.rows.item(i);
                appendContent += "<div class='row'>";
                appendContent += "<div class='col-xs-12 addedCustomers' data='" + item[TABLES.DCR_CHEMIST.DCR_CHEMIST_SLNO] + "' data-item='C'>";
                appendContent += "<p style='padding:5px;background-color:gainsboro'> " + (i + 1) + ". " + item[TABLES.CHEMISTS.NAME] + "</p>";
                appendContent += "</div>";
                appendContent += "</div>";
            }
            appendContent += "</div>";
            appendContent += "</div>";
        });

        var selectStockistQuery = "SELECT DI." + TABLES.STOCKIST.NAME + ",DD." + TABLES.DCR_STOCKIST.DCR_STOCK_ID + " FROM " + TABLES.DCR_STOCKIST.TABLE + " DD INNER JOIN " + TABLES.STOCKIST.TABLE +
                " DI ON DD." + TABLES.DCR_STOCKIST.STOCKIST_ID + "=DI." + TABLES.STOCKIST.STOCKIST_ID +
                " WHERE DD." + TABLES.DCR_STOCKIST.DCR_SL_NO + "=?";
        var selectStockistValues = new Array($.session.get("ActivityId"));

        $.when(dbObject.execute(selectStockistQuery, selectStockistValues)).done(function (data) {
            appendContent += "<div class='row' style='margin-top:5px;border: 1px solid black''>";
            appendContent += "<div class='col-xs-12'>";
            if (data.rows.length > 0) {
                appendContent += "<div class='row'>";
                appendContent += "<p style='font-size:18px;font-weight:bold;padding-top:5px;padding-left:5px;background-color:#ff7043;color:white;width:100%'> Added Stockist </p>";
                appendContent += "</div>";
            }
            for (var i = 0; i < data.rows.length; i++) {
                var item = data.rows.item(i);
                appendContent += "<div class='row'>";
                appendContent += "<div class='col-xs-12 addedCustomers' data='" + item[TABLES.DCR_STOCKIST.DCR_STOCK_ID] + "' data-item='S'>";
                appendContent += "<p style='padding:5px;background-color:gainsboro'> " + (i + 1) + ". " + item[TABLES.STOCKIST.NAME] + "</p>";
                appendContent += "</div>";
                appendContent += "</div>";

            }
            appendContent += "</div>";
            appendContent += "</div>";
            $('#addedCustomersModalBody').empty();
            $('#addedCustomersModalBody').append(appendContent);
            $('.addedCustomers').click(function () {
                $('#cutomerModal').modal('toggle');
                $.session.set("customerType", $(this).attr('data-item'));
                $.session.set("customerSelected", $(this).attr('data'));
                document.location = "AddedCustomers.html";
            });
            $('#cutomerModal').modal('toggle');
        });

    }).fail(function (error) {
        alert(error);
    });
}

function syncError() {
    alert("Connection Error while syncing the data, Please try again later...");
}


