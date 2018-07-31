/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    //date time picker maxDate :new Date() means it will select till current date
    $('#RCPAEntryDateID').mobiscroll().date({
        theme: "jqm",
        mode: "mixed",
        lang: "",
        display: "bubble",
        animate: "flip",
        maxDate: new Date()

    });

    $("#VIEWENTRYTABLE").hide();
    $("#VIEWeachENTRYTABLE").hide();
    //To view RCPA RECORDS(ENTERED DETAILS)
    $("#btnViewRcpaEntryPage").click(function () {

        window.location = "RCPA.html#ViewRcpaEntries";
        viewRCPARECORDSINFO();
    });

    $("#btnViewMI").click(function () {

//window.location="RCPA.html#ViewRcpaMIEntries";
        viewMIRECORDSINFO();
    });






    //  $("#btnRCPAEntrypageNEXT").attr('disabled','disabled');  
    // $("#btnRCPAEntrypageNEXT").show();
    $("#btnRCPAEntrypageNEXT").css({"visibility": "hidden"});
    // $("#btnRCPA_MarketIntelligence").css({"visibility":"hidden"});
    //$("#VIEWeachENTRYTABLE").css({"visibility":"hidden"});
    //for chemist dropdown
    $('.required_chemistdetails').keypress(function () {
        $(this).next('#ErrorRCPAC').remove();
    });
    $('.required_chemistdetails').mousedown(function () {
        $(this).next('#ErrorRCPAC').remove();
    });
    $('.required_chemistdetails').change(function () {
        $(this).next('#ErrorRCPAC').remove();
    });

    //for brand dropdown
    $('.required_BRANDdetails').keypress(function () {
        $(this).next('#ErrorRCPAB').remove();
    });
    $('.required_BRANDdetails').mousedown(function () {
        $(this).next('#ErrorRCPAB').remove();
    });
    $('.required_BRANDdetails').change(function () {
        $(this).next('#ErrorRCPAB').remove();

    });
    //for market intelligence dropdown
    $('.required_MarketI').keypress(function () {
        $(this).next('#ErrorMI').remove();
    });
    $('.required_MarketI').mousedown(function () {
        $(this).next('#ErrorMI').remove();
    });
    $('.required_MarketI').change(function () {
        $(this).next('#ErrorMI').remove();
    });

    //.required_DOCTORdetails
    //for market intelligence dropdown
    $('.required_DOCTORdetails').keypress(function () {
        $(this).next('#ErrorRCPAD').remove();
    });
    $('.required_DOCTORdetails').mousedown(function () {
        $(this).next('#ErrorRCPAD').remove();
    });
    $('.required_DOCTORdetails').change(function () {

        $(this).next('#ErrorRCPAD').remove();

    });
    //on back click from MI page again next button click ...clear data in MI page
    $("#RCPAMIBACK").click(function () {
        $('#required_MarketIID').selectmenu();
        $('#required_MarketIID').val("0");
        $('#required_MarketIID').selectmenu('refresh', true);
        $("#MIremarksID").val("");
    });


    //rx should take only number   no decimal no char
    function isNumberKey(evt) {

        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
    }
    //rx should not take character & decimal(3.5...) & max length should be 4
    function maxLengthCheck(object) {

        if (object.value.length > object.maxLength)
            object.value = object.value.slice(0, object.maxLength)
    }




    //on load current date should show
    if (($("#RCPAEntryDateID").val() == "") || ($("#RCPAEntryDateID").val() == null) || ($("#RCPAEntryDateID").val() == undefined))
    {

        var now = new Date();
        var today = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
        $('#RCPAEntryDateID').val(today);



    }

    //displaying the chemist list  who is mapped 
    DisplayChemistNamelist();

    $('#CHEMISTNAMETABLEID').change(function () {
        $('#DOCTORNAMETABLEID').selectmenu();
        $('#DOCTORNAMETABLEID').val(0);
        $('#DOCTORNAMETABLEID').selectmenu('refresh', true);
        if ($('#CHEMISTNAMETABLEID').val() == 0) {
        } else {
            DisplayDoctorNamelist();
        }
    });

    $('#DOCTORINFOTABLE').hide();
    $('#DOCTORNAMETABLEID').change(function () {

        DisplayDoctorDetails();
        $('#DOCTORINFOTABLE').show();
        $('#BRANDNAMETABLEID').selectmenu();
        $('#BRANDNAMETABLEID').val(0);
        $('#BRANDNAMETABLEID').selectmenu('refresh', true);

    });

    DisplayBrandNamelist();
    $('#BRANDINFOTABLE').hide();
    $('#BRANDNAMETABLEID').change(function () {

        if ($('#BRANDNAMETABLEID').val() == 0) {
            $('#BRANDINFOTABLE').hide();
        } else {
            DisplayBrandDetails();
        }



    });




    $("#btnRCPAEntrypageIDSubmit").click(function () {

        var empty_count = 0;

        $('#ErrorRCPAC').remove();
        $('#ErrorRCPAB').remove();
        $('#ErrorRCPAD').remove();
        $('.required_chemistdetails').each(function (event) {
            //if ($(this).val().length === 0) {
            if ($('option:selected', $(this)).index() === 0) {
                $(this).after('<label  id="ErrorRCPAC"  style="color: #F1520E;">Please select chemist</label>');
                empty_count = 1;
            }
        });
        $('.required_BRANDdetails').each(function () {
            if ($('option:selected', $(this)).index() === 0) {
                $(this).after('<label  id="ErrorRCPAB"  style="color: #F1520E;">Please select brand</label>');
                empty_count = 1;
            }

        });
        $('.required_DOCTORdetails').each(function () {
            if ($('option:selected', $(this)).index() === 0) {
                $(this).after('<label  id="ErrorRCPAD"  style="color: #F1520E;">Please select doctor</label>');
                empty_count = 1;
            }

        });



        //      else {

//         var CRx1 = $("#S_CompetitorRX1").val()==""?0:$("#S_CompetitorRX1").val();
//        // alert("CRx1:::::::"+CRx1)
//         var CRx2 = $("#S_CompetitorRX2").val()==""?0:$("#S_CompetitorRX2").val();
//         var CRx3 = $("#S_CompetitorRX3").val()==""?0:$("#S_CompetitorRX3").val();
//         var CRx4 = $("#S_CompetitorRX4").val()==""?0:$("#S_CompetitorRX4").val();
//         var CRx5 = $("#S_CompetitorRX5").val()==""?0:$("#S_CompetitorRX5").val();
        var MoleculeRx = $("#txtbrandrx").val();
        var MRx = parseInt(MoleculeRx);
        //   var TotalCRx = parseInt(CRx1)+parseInt(CRx2)+parseInt(CRx3)+parseInt(CRx4)+parseInt(CRx5);

        var resultMrt = 0;
        var i = 1;
        for (i = 1; i <= 5; i++) {
            if ($("#S_CompetitorRX" + i).length > 0) {

                if (($("#S_CompetitorRX" + i).val() <= 0) || ($("#S_CompetitorRX" + i).val() == null) || ($("#S_CompetitorRX" + i).val() == ""))
                {
                    resultMrt = parseInt(resultMrt) + 0;
                } else {
                    resultMrt = parseInt(resultMrt) + parseInt($("#S_CompetitorRX" + i).val());
                }
            } else {
                resultMrt = parseInt(resultMrt) + 0;
            }
        }

        var ResultMolecueRxCrx = resultMrt + MRx;



        if ((($("#txtDoctorRx").val() == "") || ($("#txtDoctorRx").val() == null) || ($("#txtDoctorRx").val() == undefined)) && ($("#DOCTORNAMETABLEID").get(0).selectedIndex > 0))
        {

            //  alert("Please enter Doctor Rx !");
            alert("Please enter Molecule Rx !");
            empty_count = 1;
            return;
        }
        // if((($("#txtbrandrx").val()=="")||($("#txtbrandrx").val()==null)||($("#txtbrandrx").val()==undefined)) && ($("#BRANDNAMETABLEID").val()!=0))         
        if ((($("#txtbrandrx").val() == "") || ($("#txtbrandrx").val() == null) || ($("#txtbrandrx").val() == undefined)) && ($("#BRANDNAMETABLEID").get(0).selectedIndex > 0))
        {
            alert("Please enter Brand Rx !");
            return;

        }
        if (($("#txtDoctorRx").val() < parseInt(ResultMolecueRxCrx)))
        {

            alert("Entered Rx should be less than molecule Rx")

            return;

        }
        if ($("#BRANDNAMETABLEID").get(0).selectedIndex > 0) {
            // if(($("#MoleculeID").val().length > 0) && ($("#txtbrandrx").val().lenght>0) &&  ($("#BRANDNAMETABLEID").get(0).selectedIndex>0))

            var valid = false;
            var i = 1;
            for (i = 1; i <= 5; i++) {
                if ($("#S_CompetitorRX" + i).length > 0) {

                    if (($("#S_CompetitorRX" + i).val() < 0) || ($("#S_CompetitorRX" + i).val() == null) || ($("#S_CompetitorRX" + i).val() == ""))
                    {
                        //valid=false;   
                    } else {
                        valid = true;

                    }
                }
            }

            if (!valid) {
                // alert(!valid)
                alert("Please enter at least one Competitor Rx !");


                empty_count = 1;
                return;
            }
        }

        if (empty_count === 1) {
            event.preventDefault();
        } else {

//             var result=confirm("Are you sure to you want add this RCPA !!");
//         
//            if(result)
//            {

            SubmitRCPAEntryDetails();
            $("#CHEMISTNAMETABLEID").attr('disabled', 'disabled');
            // $("#BRANDNAMETABLEID").attr('disabled','disabled'); 
            return;
            // }

        }


    });



    DisplayMarketIntelligence();

    /* $("#btnRCPA_MarketIntelligence").click(function(){
     $('#ErrorMI').remove();
     $('.required_MarketI').each(function (event) { 
     if ($('option:selected', $(this)).index() === 0) {
     //  alert($(this).val());
     $(this).after('<label  id="ErrorMI"  style="color: #F1520E;">Please select Market Intelligence</label>');
     empty_count = 1;
     }
     else if ($('option:selected', $(this)).index() > 0)
     {
     // FinalUpdateRCPAMI()  
     if (navigator.onLine) 
     {
     RCPA_SyncService();
     }
     else
     {
     alert("RCPA saved successfully");
     window.location="EHome.html";
     
     }
     
     
     }
     });
     
     });*/

    viewRCPARECORDSINFOadded();

    $("#btnRCPA_MarketIntelligence").click(function () {
        Update_Chemist_Status($.session.get("RCPA_IDCB"))
        if (navigator.onLine) {
            RCPA_SyncService();
        } else {
            Update_Chemist_Status($.session.get("RCPA_IDCB"))
            //window.location = "EHome.html";
        }
    });

    function Update_Chemist_Status(RCPA_ID) {
        db.transaction(function (tx) {
            tx.executeSql("UPDATE RCPA_ADDEntryChemist SET RCPA_Status_Chemist =? WHERE RCPA_ID=?", ["C", RCPA_ID], CheckRCPAChemistSTATUS, onError);
        });
    }




    function CheckRCPAChemistSTATUS()
    {
        // alert("check")
        alert("RCPA saved successfully");
        window.location = "EHome.html";
    }


    //April 23rd new table for Market intelligence  based on RCPA ID
    /*  $("#btnMIAddMore").click(function(){
     
     $('#ErrorMI').remove();
     $('.required_MarketI').each(function (event) { 
     if ($('option:selected', $(this)).index() === 0) {
     //  alert($(this).val());
     $(this).after('<label  id="ErrorMI"  style="color: #F1520E;">Please select Market Intelligence</label>');
     empty_count = 1;
     }
     else if ($('option:selected', $(this)).index() > 0){
     RCPA_AddMoreMarketIntelligence()   
     
     }
     });
     
     
     });
     
     
     });*/

    $("#btnMIAddMore").click(function () {

        RCPA_AddMoreMarketIntelligence()

    });
});

//April 8th 2015
// displaying the chemist list  who is mapped 
function DisplayChemistNamelist() {

//    db.transaction(function (tx) {
//        tx.executeSql("SELECT distinct S.NAME,S.CHEMIST_ID FROM CHEMISTS S inner join RCPA_CHEMISTDOCTORMAP CM on  S.CHEMIST_ID=CM.CHEMIST_ID ORDER BY S.NAME ASC", [], function (tx, result) {
//            dataset = result.rows;
//            var dd = $("#CHEMISTNAMETABLEID");
//
//            if (dataset.length > 0) {
//                // alert(dataset.length)
//                for (var i = 0, item = null; i < dataset.length; i++) {
//                    item = dataset.item(i);
//                    dd.append('<option value=' + item["CHEMIST_ID"] + '>' + item["NAME"] + '</option>');
//                }
//            } else {
//            }
//        });
//    });

    db.transaction(function (tx) {
        tx.executeSql("SELECT DISTINCT S." + TABLES.CHEMISTS.NAME + ",S." + TABLES.CHEMISTS.CHEMIST_ID + " FROM " + TABLES.CHEMISTS.TABLE
                + " S INNER JOIN " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE + " CM ON S." + TABLES.CHEMISTS.CHEMIST_ID + " = CM." +
                TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + " ORDER BY S." + TABLES.CHEMISTS.NAME + " ASC", [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#CHEMISTNAMETABLEID");

            if (dataset.length > 0) {
                // alert(dataset.length)
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value=' + item[TABLES.CHEMISTS.CHEMIST_ID] + '>' + item[TABLES.CHEMISTS.NAME] + '</option>');
                }
            } else {
            }
        }, function (tx, error) {
            alert(error.message);
        });
    });

}
function DisplayDoctorNamelist() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DOCTOR_INFO.TABLE + " WHERE " + TABLES.DOCTOR_INFO.DOCTOR_SL_NO +
                " IN(SELECT " + TABLES.RCPA_CHEMISTDOCTORMAP.DOCTOR_SL_NO + " FROM " + TABLES.RCPA_CHEMISTDOCTORMAP.TABLE +
                " WHERE " + TABLES.RCPA_CHEMISTDOCTORMAP.CHEMIST_ID + "=?) ORDER BY " + TABLES.DOCTOR_INFO.NAME + " ASC ", [$("#CHEMISTNAMETABLEID").val()], function (tx, result) {
            dataset = result.rows;

            var dd = $("#DOCTORNAMETABLEID").empty();
            dd.append('<option value="0" selected>Select Doctor</option>');
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value=' + item[TABLES.DOCTOR_INFO.DOCTOR_SL_NO] + '>' + item[TABLES.DOCTOR_INFO.NAME] + '</option>');
                }
            } else {
                alert("Doctor map does not exist please check");
            }
            // $('#DOCTORNAMETABLEID').trigger('create');  
        });


    });

    //$('#DOCTORNAMETABLEID').trigger('create');

}
// displaying the doctor info w.r.t doctors name selected in dropdown .....
function DisplayDoctorDetails() {

    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM " + TABLES.DOCTOR_INFO.TABLE + " WHERE " +
                TABLES.DOCTOR_INFO.DOCTOR_SL_NO + "=? ORDER BY " + TABLES.DOCTOR_INFO.NAME + " ASC", [$("#DOCTORNAMETABLEID").val()], function (tx, result) {
            dataset = result.rows;
            var dd = $("#DOCTORINFOTABLEID").empty();
            if (dataset.length > 0) {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    // dd.append('<tr id="DOCINFOID"><td style="width: 30%">'+item["SPECIALITY_ID"]+'</td><td style="width: 40%">'+item["CLASSIFICATION"]+'</td><td style="width: 30%"><input type="number" min="0" maxlength = "5" pattern="\d+" id="txtDoctorRx" onkeypress="return isNumberKey(event)" oninput="maxLengthCheck(this)"/></td></tr>');   
                    dd.append('<tr id="DOCINFOID"><td style="width: 30%">' + item[TABLES.DOCTOR_INFO.SPECIALITY_ID] + '</td><td style="width: 40%">' + item[TABLES.DOCTOR_INFO.CLASSIFICATION] + '</td></tr>');
                    //ASHA <td style="width: 30%"><input type="number" min="0" maxlength = "5" pattern="\d+" id="txtDoctorRx" onkeypress="return isNumberKey(event)" oninput="maxLengthCheck(this)"/></td>
                }
            } else {
            }

            $('#DOCTORINFOTABLEID').trigger('create');
        });


    });

    $('#DOCTORINFOTABLEID').trigger('create');


}


//displaying the brand list  from productgroups table...
function DisplayBrandNamelist() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "," + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME +
                " FROM  " + TABLES.PRODUCTGROUPS.TABLE + " ORDER BY " + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " ASC", [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#BRANDNAMETABLEID");
            if (dataset.length > 0)
            {
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value=' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID] + '>' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</option>');
                }
            } else {
            }

            //  $('#BRANDNAMETABLEID').trigger('create');
        });


    });

    // $('#BRANDNAMETABLEID').trigger('create');


}
var labelID;
function DisplayBrandDetails() {
    db.transaction(function (tx) {
        var idr = 1;
        tx.executeSql("SELECT " + TABLES.RCPA_BRANDCOMPETITORMAP.MOLECULE + "," + TABLES.RCPA_BRANDCOMPETITORMAP.COMPETITOR_NAME + "," + TABLES.RCPA_BRANDCOMPETITORMAP.COMPETITOR_ID
                + " from " + TABLES.RCPA_BRANDCOMPETITORMAP.TABLE + " WHERE " + TABLES.RCPA_BRANDCOMPETITORMAP.PRODUCT_GROUP_ID + "=? and " + TABLES.RCPA_BRANDCOMPETITORMAP.COMPETITOR_ID + " > 0", [$("#BRANDNAMETABLEID").val()], function (tx, result) {
            dataset = result.rows;
            $("#MoleculeID").val("");
            var dd = $("#lblCompetitorbrand").empty();
            if (dataset.length > 0) {
                //alert(dataset.length)
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    var moleculedata = item[TABLES.RCPA_BRANDCOMPETITORMAP.MOLECULE];
                    if (moleculedata != "" || moleculedata != undefined || moleculedata != null)
                    {
                        $('#BRANDINFOTABLE').show();
                        $("#MoleculeID").val(item[TABLES.RCPA_BRANDCOMPETITORMAP.MOLECULE]);
                        labelID = "S_CompetitorID" + idr;
                        var textboxId = "S_CompetitorRX" + idr;
                        if (labelID != "")
                        {
                            //alert(labelID)
                            $('#CompetitorsHeading1').show();
                            $('#CompetitorsHeading2').show();

                            dd.append('<tr><td id="CompetitorsID" style="width:50%"><label id=' + labelID + ' style="display:none">' + item[TABLES.RCPA_BRANDCOMPETITORMAP.COMPETITOR_ID] + '</label><label style="font-weight:500" class="tdboxlabel" >' + item[TABLES.RCPA_BRANDCOMPETITORMAP.COMPETITOR_NAME] + '</label></td><td id="CompetitorsRXID" style="width:50%"><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-d"><input type="number" min="0" maxlength = "4" id=' + textboxId + ' class="ui-input-text ui-body-d" onkeypress="return isNumberKey(event)" oninput="maxLengthCheck(this)"/></div></td></tr>');
                            idr++;
                        } else {
                            $('#CompetitorsHeading1').hide();
                            $('#CompetitorsHeading2').hide();
                        }
//                            else if(labelID=="0"){
//                                alert("0")
//                            }


                    } else
                    {
                        alert("There is no molecule data available");

                    }





                }//for
            }//if length
            else {
                $('#BRANDINFOTABLE').hide();
                // alert("There is no molecule brand competitors available")
                alert("There is no competitor brands mapped");
                $('CompetitorsHeading1').hide();
                $('CompetitorsHeading2').hide();
            }


        }, function (tx, error) {
            alert(error.message);
        });

        $('#DOCTORINFOTABLEID').trigger('create');
    });

    $('#DOCTORINFOTABLEID').trigger('create');
}
function DisplayMarketIntelligence() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT distinct " + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + "," + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME
                + " from " + TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " ORDER BY " + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME + " ASC", [], function (tx, result) {
            dataset = result.rows;
            var dd = $("#required_MarketIID");

            if (dataset.length > 0) {

                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value=' + item[TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID] + '>' + item[TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME] + '</option>');
                }
            } else {
                alert("No market intelligence")
            }
        });
    });
}


function viewRCPARECORDSINFO()
{

    db.transaction(function (tx) {


        // tx.executeSql("SELECT A.RCPA_ID,A.ACTIVITYDATE,D.NAME As ChemistName,C.NAME As DrName,C.SPECIALITY_ID,B.TOTAL_RX FROM RCPA_ADDEntryChemist A, RCPA_ADDEntryBrand B,doctor_info C,CHEMISTS D WHERE A.RCPA_ID = B.RCPA_ID AND B.DOCTOR_SL_NO=C.DOCTOR_SL_NO and A.CHEMIST_ID=D.CHEMIST_ID ORDER BY A.ACTIVITYDATE ASC ", [], function (tx, result) {
        tx.executeSql("SELECT A." + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + ",A." + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE +
                ",D." + TABLES.CHEMISTS.NAME + " As ChemistName,C." + TABLES.DOCTOR_INFO.NAME + " As DrName,C." + TABLES.DOCTOR_INFO.SPECIALITY_ID
                + ",B." + TABLES.RCPA_ADDENTRYBRAND.TOTAL_RX + ",B." + TABLES.RCPA_ADDENTRYBRAND.BRAND_RX + ",E." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " FROM " +
                TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " A," + TABLES.RCPA_ADDENTRYBRAND.TABLE + "B," + TABLES.DOCTOR_INFO.TABLE +
                "C," + TABLES.CHEMISTS.TABLE + "D," + TABLES.PRODUCTGROUPS.TABLE + " E WHERE A." + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + " = B. " +
                TABLES.RCPA_ADDENTRYBRAND.RCPA_ID + " AND B." + TABLES.RCPA_ADDENTRYBRAND.DOCTOR_SL_NO + "=C." +
                TABLES.DOCTOR_INFO.DOCTOR_SL_NO + "and A." + TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID + "=D." + TABLES.CHEMISTS.CHEMIST_ID
                + " AND E." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + " = B." + TABLES.RCPA_ADDENTRYBRAND.PRODUCT_GROUP_ID + " ORDER BY A." +
                TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " ASC ", [], function (tx, result) {

            dataset = result.rows;
            dd = $("#VIEWENTRYTABLEID").empty();
            if (dataset.length > 0) {
                $("#VIEWENTRYTABLE").show();

                // document.getElementById("VIEWENTRYTABLE").style.display = "block";
                for (var i = 0, item = null; i < dataset.length; i++)
                {
                    item = dataset.item(i);


                    // dd.append('<tr><td style="display:none">'+item["RCPA_ID"]+'</td><td>'+item["ACTIVITYDATE"]+'</td><td>'+item["ChemistName"]+'</td><td>'+item["DrName"]+'</td><td>'+item["SPECIALITY_ID"]+'</td><td>'+item["TOTAL_RX"]+'</td><td><a href="" data-role="button" data-theme="a" id ="btnGORCPAID" rel="external" onclick="getMIData('+item["RCPA_ID"]+')"><img src="Images/RCPA_Icon.png" alt="" width="20"/></a></td></tr> ')
                    dd.append('<tr><td>' + item["DrName"] + '</td><td>' + item[TABLES.DOCTOR_INFO.SPECIALITY_ID] + '</td><td>' + item[TABLES.RCPA_ADDENTRYBRAND.TOTAL_RX] + '</td><td>' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</td><td>' + item[TABLES.RCPA_ADDENTRYBRAND.BRAND_RX] + '</td></tr> ');

                }

                $("#VIEWENTRYTABLE").table();
                $("#VIEWENTRYTABLE").table("refresh");
            } else {
                $("#VIEWENTRYTABLE").hide();

                //document.getElementById("VIEWENTRYTABLE").style.display = "none";
            }


        });


    });
}

function viewMIRECORDSINFO()
{
    db.transaction(function (tx) {

        //tx.executeSql("SELECT A.RCPA_ID,A.ACTIVITYDATE,B.Market_IntelligenceName,C.MIREMARKS,D.NAME As ChemistName FROM RCPA_ADDEntryChemist A, RCPA_MarketIntelligence B,RCPA_ADDEntryMarketIntelligence C,CHEMISTS D WHERE A.RCPA_ID = C.RCPA_ID and A.CHEMIST_ID=D.CHEMIST_ID  ORDER BY ACTIVITYDATE ASC ", [], function (tx, result) { 
        tx.executeSql("SELECT AA." + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_REMARKS + ",B." +
                TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + ", A." + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME + ", C." +
                +TABLES.CHEMISTS.NAME + " AS CHEMISTNAME FROM  " + TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " A inner join " +
                TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE + " AA  on " +
                "A." + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + " = AA." +
                TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID + " inner join " +
                TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " B ON B." + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID + " = AA." +
                TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID + " inner join " + TABLES.CHEMISTS.TABLE + " C ON C." + TABLES.CHEMISTS.CHEMIST_ID
                + "= B." + TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID +
                " ORDER BY " + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " ASC ", [], function (tx, result) {

            dataset = result.rows;

            if (dataset.length > 0) {
                var dd = $("#VIEWMIENTRYTABLEID").empty();

                document.getElementById("VIEWMIENTRYTABLE").style.display = "block";
                $("#VIEWMIENTRYTABLE").show();
                for (var i = 0, item = null; i < dataset.length; i++)
                {


                    item = dataset.item(i);


                    dd.append('<tr ><td>' + item[TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME] + '</td><td>' + item[TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_REMARKS] + '</td><td></td></tr>')


                }

                $("#VIEWMIENTRYTABLE").table();
                $("#VIEWMIENTRYTABLE").table("refresh");
            } else {
                document.getElementById("VIEWMIENTRYTABLE").style.display = "none";
                $("#VIEWMIENTRYTABLE").hide();
            }


        });


    });
}


//function getMIData(ADate,ChemistName)
function getMIData(RCPA_ID)
{
    //alert(RCPA_ID)

    db.transaction(function (tx) {
        tx.executeSql("SELECT A." + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME + ",B." + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_REMARKS + " from " +
                TABLES.RCPA_MARKETINTELLIGENCE.TABLE + " A , " + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.TABLE + " B where A." + TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_ID + " = B." +
                TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MARKET_INTELLIGENCE_ID + " AND B." + TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.RCPA_ID + " = ?", [RCPA_ID], function (tx, result) {
            dataset = result.rows;
            dd = $("#VIEWeachENTRYTABLEID").empty();
            if (dataset.length > 0) {
                // document.getElementById("VIEWeachENTRYTABLE").style.display = "block";
                $("#VIEWeachENTRYTABLE").show();
                for (var i = 0, item = null; i < dataset.length; i++)
                {
                    item = dataset.item(i);

                    dd.append('<tr><td>' + item[TABLES.RCPA_MARKETINTELLIGENCE.MARKET_INTELLIGENCE_NAME] + '</td><td>' + item[TABLES.RCPA_ADDENTRYMARKETINTELLIGENCESSSS.MI_REMARKS] + '</td></tr> ')
                }

                $("#VIEWeachENTRYTABLE").table();
                $("#VIEWeachENTRYTABLE").table("refresh");
            } else {
                // document.getElementById("VIEWeachENTRYTABLE").style.display = "none";
                $("#VIEWeachENTRYTABLE").hide();
            }


        });


    });

}


function viewRCPARECORDSINFOadded()
{

    db.transaction(function (tx) {


        tx.executeSql("SELECT " + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + "," + TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID
                + "," + TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID + " from " + TABLES.RCPA_ADDENTRYCHEMIST.TABLE + " WHERE " +
                TABLES.RCPA_ADDENTRYCHEMIST.RCPA_STATUS_CHEMIST + "=?  ORDER BY " + TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE + " DESC LIMIT 1 ", ["N"], function (tx, result) {
            dataset = result.rows;

            if (dataset.length > 0) {


                // document.getElementById("VIEWENTRYTABLE").style.display = "block";
                for (var i = 0, item = null; i < dataset.length; i++)
                {
                    item = dataset.item(i);

                    $("#RCPAEntryDateID").val(item[TABLES.RCPA_ADDENTRYCHEMIST.ACTIVITY_DATE]);
                    $('#CHEMISTNAMETABLEID').selectmenu();
                    $('#CHEMISTNAMETABLEID').val(item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID]);
                    $('#CHEMISTNAMETABLEID').selectmenu('refresh', true);
                    $("#CHEMISTNAMETABLEID").attr('disabled', 'disabled');
                    $("#RCPAEntryDateID").attr('disabled', 'disabled');
                    $("#btnRCPAEntrypageNEXT").css({"visibility": "visible"});
                    $.session.set("RCPA_CHEMIST_ID", item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID]);
                    $.session.set("RCPA_IDCB", item[TABLES.RCPA_ADDENTRYCHEMIST.RCPA_ID]);
                    $.session.set("SelectedRCPAChemist", item[TABLES.RCPA_ADDENTRYCHEMIST.CHEMIST_ID]);
                    DisplayDoctorNamelist();
                }


            } else {

                //document.getElementById("VIEWENTRYTABLE").style.display = "none";
            }


        });


    });
}