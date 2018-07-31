function SubmitRCPAEntryDetails() {

    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " where " + TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID
                + " =? and " + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " =?  order by " + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " limit 1", [$("#CHEMISTNAMETABLEID").val(), $("#RCPAEntryDateID").val()], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    if (item["RCPA_Status_Chemist"] == "C")
                    {
                        alert("RCPA completed for selected Chemist");
                        $("#CHEMISTNAMETABLEID").removeAttr('disabled');

                        $("#txtDoctorRx").val("");
                        $("#txtbrandrx").val("");
                        $("#S_CompetitorRX1").val("");
                        $("#S_CompetitorRX2").val("");
                        $("#S_CompetitorRX3").val("");
                        $("#S_CompetitorRX4").val("");
                        $("#S_CompetitorRX5").val("");
                        $('#BRANDNAMETABLEID').selectmenu();
                        $('#BRANDNAMETABLEID').val("0");
                        $('#BRANDNAMETABLEID').selectmenu('refresh', true);


                    } else {
                        $.session.set("RCPA_IDCB", item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID]);
                        $.session.set("RCPA_CHEMIST_ID", item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID]);
                        CallToAddBrandCompetitorDetails();
                    }
                }
            } else {
                var S_CHEMISTID = $("#CHEMISTNAMETABLEID").val();
                $.session.set("SelectedRCPAChemist", $("#CHEMISTNAMETABLEID").val());
                var S_ActivityDate = $("#RCPAEntryDateID").val();
                var RCPA_SyncStatusChemist = "N";
                var RCPA_StatusChemist = "N";
                var final_statusChemist = "N";
                var RCPA_SyncStatusMI = "N";
                db.transaction(function (tx) {
                    tx.executeSql('insert into RCPA_ADDEntryChemist(CHEMIST_ID,ACTIVITYDATE,RCPA_Sync_Status_Chemist,RCPA_Status_Chemist,final_status_Chemist,RCPA_Sync_Status_MI)values(?,?,?,?,?,?)', [S_CHEMISTID, S_ActivityDate, RCPA_SyncStatusChemist, RCPA_StatusChemist, final_statusChemist, RCPA_SyncStatusMI], Check, onError);
                });
                getrcpaid();
                CallToAddBrandCompetitorDetails();
            }


        });


    });



}
//brand details saved to local table
//select rcpi idleast 1 order by rcpi id--17

function getrcpaid() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " ORDER BY " + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + " DESC LIMIT 1", [], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    //alert(item["RCPA_ID"])
                    $.session.set("RCPA_IDCB", item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID]);
                    $.session.set("RCPA_CHEMIST_ID", item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID]);
                }
            } else {
            }


        });


    });
}
function CallToAddBrandCompetitorDetails()
{




    var S_DOCID = $("#DOCTORNAMETABLEID").val();
    var S_BRANDID = $("#BRANDNAMETABLEID").val();
    var S_DOCRX = $("#txtDoctorRx").val();
    var S_MOLECULE = $("#MoleculeID").val();
    var S_BRANDRX = $("#txtbrandrx").val();
    var S_CompetitorID1 = $("#S_CompetitorID1").text();
    var S_COMPETITORRX1 = $("#S_CompetitorRX1").val();
    var S_CompetitorID2 = $("#S_CompetitorID2").text();
    var S_COMPETITORRX2 = $("#S_CompetitorRX2").val();
    var S_CompetitorID3 = $("#S_CompetitorID3").text();
    var S_COMPETITORRX3 = $("#S_CompetitorRX3").val();
    var S_CompetitorID4 = $("#S_CompetitorID4").text();
    var S_COMPETITORRX4 = $("#S_CompetitorRX4").val();
    var S_CompetitorID5 = $("#S_CompetitorID5").text();
    var S_COMPETITORRX5 = $("#S_CompetitorRX5").val();

    var RCPA_SyncStatusBrand = "N";
    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM RCPA_ADDEntryChemist C INNER JOIN RCPA_ADDEntryBrand B ON B.RCPA_ID = C.RCPA_ID  WHERE CHEMIST_ID= ? and DOCTOR_SL_NO=? and PRODUCTGROUP_ID=? ORDER BY C.ACTIVITYDATE  ASC  limit 1", [$.session.get("RCPA_CHEMIST_ID"), S_DOCID, S_BRANDID], function (tx, result) {

            dataset = result.rows;
            if (dataset.length > 0) {
                alert("Competitors already exist for this brand")

            } else {
                var result = confirm("Do you want to add this RCPA?");
                if (result)
                {

                    db.transaction(function (tx) {
                        tx.executeSql('insert into ' + TABLES.RCPA_ADDENTRYBRAND.TABLE + "(" +
                                TABLES.RCPA_ADDENTRYBRAND.RCPA_ID + "," +
                                TABLES.RCPA_ADDENTRYBRAND.DOCTOR_SL_NO + "," + TABLES.RCPA_ADDENTRYBRAND.PRODUCT_GROUP_ID
                                + "," + TABLES.RCPA_ADDENTRYBRAND.TOTAL_RX + "," + TABLES.RCPA_ADDENTRYBRAND.MOLECULE + "," +
                                TABLES.RCPA_ADDENTRYBRAND.BRAND_RX + "," + TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID1 + "," +
                                +TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX1 + "," + TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID2 + "," +
                                TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX2 + "," + TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID3 + "," +
                                TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX3 + "," + TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID4 + "," +
                                TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX4 + "," + TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID5 + "," +
                                TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX5 + "," + TABLES.RCPA_ADDENTRYBRAND.RCPA_SYNC_STATUS_BRAND + ')values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$.session.get('RCPA_IDCB'), S_DOCID, S_BRANDID, S_DOCRX, S_MOLECULE, S_BRANDRX, S_CompetitorID1, S_COMPETITORRX1, S_CompetitorID2, S_COMPETITORRX2, S_CompetitorID3, S_COMPETITORRX3, S_CompetitorID4, S_COMPETITORRX4, S_CompetitorID5, S_COMPETITORRX5, RCPA_SyncStatusBrand], Check, onError);
                    });

                    $("#txtDoctorRx").val("");
                    $("#txtbrandrx").val("");
                    $("#S_CompetitorRX1").val("");
                    $("#S_CompetitorRX2").val("");
                    $("#S_CompetitorRX3").val("");
                    $("#S_CompetitorRX4").val("");
                    $("#S_CompetitorRX5").val("");

                    $('#BRANDNAMETABLEID').selectmenu();
                    $('#BRANDNAMETABLEID').val("0");
                    $('#BRANDNAMETABLEID').selectmenu('refresh', true);
                    $("#btnRCPAEntrypageNEXT").css({"visibility": "visible"});
                }
            }

        });
    });
}


// April 23rd Add more market intelligence & save it in new table based on RCPA ID
var S_MarketI;
var S_Remarks;
var RCPA_StatusMarketI;

function RCPA_AddMoreMarketIntelligence() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE + " WHERE " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID +
                "=? and " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID + "=?", [$.session.get("RCPA_IDCB"), $("#required_MarketIID").val()], function (tx, result) {

            dataset = result.rows;
            if (dataset.length > 0) {
                alert("Market Intelligence already exist");
                viewMIRECORDSINFO();
            } else {
                S_MarketI = $("#required_MarketIID").val();
                S_Remarks = $("#MIremarksID").val();
                RCPA_StatusMarketI = "C";
                db.transaction(function (tx) {
                    tx.executeSql('insert into ' + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE + "(" +
                            TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID + "," +
                            TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID + "," +
                            TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MIREMARKS + "," + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_STATUS + ')values(?,?,?,?)', [$.session.get('RCPA_IDCB'), S_MarketI, S_Remarks, RCPA_StatusMarketI], CheckDBC, onError);
                });

                $("#MIremarksID").val("");
                //alert("Market Intelligece added")
                //$("#btnRCPA_MarketIntelligence").css({"visibility":"visible"});
            }


        });

    });


}


function CheckDBC() {
    viewMIRECORDSINFO();
}
function RCPA_SyncService() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " C INNER JOIN " +
                TABLES.RCPA_ADDENTRYBRAND.TABLE + " B ON B." + TABLES.RCPA_ADDENTRYBRAND.RCPA_ID +
                "= C." + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + " WHERE " + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_CHEMIST +
                "=? ORDER BY C." + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " ASC ", ["N"], function (tx, result) {


            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);


                    RCPA_SyncRCPAData(item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID], item[TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE],
                            item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID], item[TABLES.RCPA_ADDENTRYBRAND.DOCTOR_SL_NO], item[TABLES.RCPA_ADDENTRYBRAND.PRODUCT_GROUP_ID],
                            item[TABLES.RCPA_ADDENTRYBRAND.TOTAL_RX], item[TABLES.RCPA_ADDENTRYBRAND.MOLECULE], item[TABLES.RCPA_ADDENTRYBRAND.BRAND_RX],
                            item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID1], item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX1],
                            item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID2], item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX2],
                            item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID3], item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX3],
                            item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID4], item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX4],
                            item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_ID5], item[TABLES.RCPA_ADDENTRYBRAND.COMPETITOR_RX5],
                            item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_CHEMIST], item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_STATUS_CHEMIST],
                            item[TABLES.RCPA_ADDENTRYCHEMIST.FINAL_STATUS_CHEMIST], item[TABLES.RCPA_ADDENTRYBRAND.RCPA_SYNC_STATUS_BRAND], i, dataset.length);

                }
            } else {

            }
        });


    });
}



//for snycing the data from local to server--22
// select the all the records from local db  RCPA_ADDEntry table --26//mi_ID & remarks removed
function RCPA_SyncRCPAData(RCPA_ID, ACTIVITYDATE, CHEMIST_ID, DOCTOR_SL_NO, PRODUCTGROUP_ID, TOTAL_RX, Molecule, BRAND_RX, COMPETITOR_ID1, Competitor_RX1, COMPETITOR_ID2, Competitor_RX2, COMPETITOR_ID3, Competitor_RX3, COMPETITOR_ID4, Competitor_RX4, COMPETITOR_ID5, Competitor_RX5, RCPA_Sync_Status_Chemist, RCPA_Status_Chemist, final_status_Chemist, RCPA_Sync_Status_Brand, RecordID, datasetlength) {

    var request = {EmployeeID: $.session.get("User_ID"), RCPA_ID: RCPA_ID, ChemistID: CHEMIST_ID, Activity_Date: ACTIVITYDATE, Remarks: "null", DoctorID: DOCTOR_SL_NO, TotalRX: TOTAL_RX, CBrandID: PRODUCTGROUP_ID, Molecule: Molecule, MRX: BRAND_RX, CompetID1: COMPETITOR_ID1, CompetEX1: Competitor_RX1, CompetID2: COMPETITOR_ID2, CompetEX2: Competitor_RX2, CompetID3: COMPETITOR_ID3, CompetEX3: Competitor_RX3, CompetID4: COMPETITOR_ID4, CompetEX4: Competitor_RX4, CompetID5: COMPETITOR_ID5, CompetEX5: Competitor_RX5};

    var jsondata = JSON.stringify(request);



    if (RCPA_Sync_Status_Chemist === "S")
    {
        if (RecordID == (datasetlength - 1)) {

        } else {
            DeleteRCPAEntry(DOCTOR_SL_NO, RCPA_ID, PRODUCTGROUP_ID);
        }
    } else {
        //alert("else")
        if (navigator.onLine) {

            $.ajax({
                type: "POST",
                async: false,
                url: $.session.get("URL") + "RCPAEntrytoLocal",
                data: jsondata,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processdata: true,
                crossDomain: true,
                success: function (result) {
                    //alert("Test");
                    if (isUndefinedNullOrEmpty(result)) {

                    } else {

                        if (result == "true")
                        {
                            if (RecordID == (datasetlength - 1)) {
                                Get_Entered_MI_From_LocalTable(RCPA_ID)

                            } else {
                                DeleteRCPAEntry(DOCTOR_SL_NO, RCPA_ID, PRODUCTGROUP_ID);
                            }

                        } else {

                        }

                    }
                },
                error: function (result) {

                }
            });
        }
    }
}


// deleting the records from RCPA_ADDEntryBrand table w.r.t to DoctorID,RCPA_ID,CBrandID
function DeleteRCPAEntry(DoctorID, RCPA_ID, CBrandID) {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.RCPA_ADDENTRYBRAND.TABLE + ' WHERE ' +
                TABLES.RCPA_ADDENTRYBRAND.DOCTOR_SL_NO + ' = ? AND ' + TABLES.RCPA_ADDENTRYBRAND.RCPA_ID + ' =? AND ' +
                TABLES.RCPA_ADDENTRYBRAND.PRODUCT_GROUP_ID + ' = ?', [DoctorID, RCPA_ID, CBrandID], Check, onError);
    });
}




//string EmployeeID, string MRTKINTELIGENCEID,string Remarks,string RCPAID
function CallInsertToMIService(MarketIntelligenceID, MI_Remarks, RCPA_ID, RecordID, datasetlength)
{
    //alert(MarketIntelligenceID+":::"+MI_Remarks+":::"+RCPA_ID+":::"+RecordID+":::"+datasetlength)
    var request = {EmployeeID: $.session.get("User_ID"), MRTKINTELIGENCEID: MarketIntelligenceID, Remarks: MI_Remarks, RCPAID: RCPA_ID};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            async: false,
            url: $.session.get("URL") + "InserttoMarketInteligence",
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
                        if (RecordID == (datasetlength - 1)) {
                            UpdateRCPASyncStatusMI(RCPA_ID)
                            Deletefrommarketint(RCPA_ID, MarketIntelligenceID);

                            SELECTRECORDSTOSYNCRCPA();
                        } else {
                            Deletefrommarketint(RCPA_ID, MarketIntelligenceID);
                        }
                    } else {
                    }
                }
            },
            error: function (result) {
            }
        });
    }
}

function UpdateRCPASyncStatusMI(RCPA_ID) {
    //alert(RCPA_ID)


    db.transaction(function (tx) {
        tx.executeSql("UPDATE " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " SET " + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_MI +
                +" =?," + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_CHEMIST + "=?  WHERE " +
                TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + "=?", ["S", "S", RCPA_ID], Check, onError);
    });
}
// selecting the all records from MAPPTABLE for mapping the data in sql server...  



function SELECTRECORDSTOSYNCRCPA() {
    //alert("SELECTRECORDSTOSYNCRCPA")
    db.transaction(function (tx) {
        //tx.executeSql("SELECT * FROM RCPA_ADDEntryChemist WHERE RCPA_Sync_Status_Chemist = S and RCPA_Status_Chemist = C and final_status_Chemist = N ORDER BY ACTIVITYDATE ASC ", [], function (tx, result) {
        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " WHERE " +
                TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_CHEMIST + "=? and " +
                TABLES.RCPA_ADDENTRYCHEMIST.RCPA_STATUS_CHEMIST + " =? and " +
                TABLES.RCPA_ADDENTRYCHEMIST.RCPA_SYNC_STATUS_MI + " =? and " +
                TABLES.RCPA_ADDENTRYCHEMIST.FINAL_STATUS_CHEMIST + "=? ORDER BY " +
                TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " ASC ",
                ["S", "C", "S", "N"], function (tx, result) {
            dataset = result.rows;
            //alert("ddd");
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    SyncRCPATOMAINTABLES(item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID], item[TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE], item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID]);
                }
            } else {

            }
        });
    });
}


//Calling this service for mapping the data from sql server temp table to main table of webserver

function SyncRCPATOMAINTABLES(CHEMIST_ID, ACTIVITYDATE, RCPA_ID) {
    // alert("Synced successfully")
    //alert(CHEMIST_ID+"::::"+ACTIVITYDATE+"::::"+RCPA_ID)
    var request = {EmployeeID: $.session.get("User_ID"), ChemistID: CHEMIST_ID, Activity_Date: ACTIVITYDATE, RCPAID: RCPA_ID};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            async: false,
            url: $.session.get("URL") + "MapptomainRCPA",
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
                        // alert("T"+result)
                        UpdateRCPA_FINAL_SyncStatus(RCPA_ID, CHEMIST_ID, ACTIVITYDATE)
                        DeleteBRANDRCPAEntryLocalTable(RCPA_ID)

                    } else {
                        DeleteBRANDRCPAEntryLocalTable(RCPA_ID)
                    }
                }
            },
            error: function (result) {
                alert("err:::" + result)
            }
        });
    }

}
// deleting the records from daily report table w.r.t to DCR_SLNO
function DeleteBRANDRCPAEntryLocalTable(RCPA_ID) {
    //  alert("D")
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.RCPA_ADDENTRYBRAND.TABLE + ' WHERE ' + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + '= ?', [RCPA_ID], Check, onError);
        // window.location="EHome.html";
    });
    //window.location="EHome.html";
}


function Deletefrommarketint(RCPAID, MKTID) {
    // alert("D")
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE + ' WHERE ' + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID + '= ? and ' +
                TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID + '=?', [RCPAID, MKTID], Check, onError);
    });
}

function UpdateRCPA_FINAL_SyncStatus(RCPA_ID)
{

    db.transaction(function (tx) {
        tx.executeSql('UPDATE ' + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + ' SET ' +
                TABLES.RCPA_ADDENTRYCHEMIST.FINAL_STATUS_CHEMIST + '=? WHERE ' + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + '=?', ["S", RCPA_ID], Check, onError);
    });
    // alert("Synced successfully");
    //alert("RCPA submitted Successfully");

    DeleteBRANDRCPAEntryLocalTable(RCPA_ID);

}
function onError(tx, error) {

    alert(error.message);

}
function check() {

}



function Get_Entered_MI_From_LocalTable(RCPA_ID) {

    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE +
                " WHERE " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID + "=?", [RCPA_ID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    CallInsertToMIService(item[TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID], item[TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_REMARKS], RCPA_ID, i, dataset.length);



                }

            } else {
                UpdateRCPASyncStatusMI(RCPA_ID);
                SELECTRECORDSTOSYNCRCPA();

            }
        });


    });



}