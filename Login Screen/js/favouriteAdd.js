var dbObject = new dbAccess();
var toogleClicked = 0, lastDisplayedBrand = "", timer, playingtime;

function ConvertYYMMDD(input) {
    var d = new Date(input);
    var a = d.getFullYear();
    var b = ("0" + (d.getMonth() + 1)).slice(-2);
    var c = ("0" + d.getDate()).slice(-2);
    var e = a + '-' + b + '-' + c;
    return e;
}

document.addEventListener("deviceready", function () {
    screen.lockOrientation('landscape');
    $('.sidenav .row').css('margin-top', '70px');
//    $('.CustomerImage').css('height','50px');
//    $('.CustomerImage').css('width','50px');
//    $('.fa').css('fontSize', '50px');
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}, false);

$(function () {
    $('#headerWrapper').load("header.html", function () {
        $('.headerText').text("Content Gallery");
        $('#rightSideActivitySelection').on('loaddone', function () {
            $('.fa').addClass("falandscape");
            $('.fa-user-md').addClass("falandscapeuser");
            $('.fa-stethoscope').addClass("falandscapeuser");
            $('.sidenav .row').css('height', '10%');
        });
        $("#menu-toggle").click(function (e) {
            if ($('.customerSideBarOverlayWrapper').hasClass('sideBarOverlayWrapperDisplay')) {
                $('#customerSelection').click();
            } else {
                rearrangeContents();
            }
            if ($('.activitySideBarOverlayWrapper').hasClass('sideBarOverlayWrapperDisplay')) {
                $("#activitySelection").click();
            }
            $("#wrapper").toggleClass("toggled");
        });

    });

    var Qry = "0=0";
    var query2 = "";
    if ($.session.get("FAV") == "YES") {
        query2 = "SELECT DISTINCT " + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.NAME + " AS GroupName " + ",C." + TABLES.CONTENT.NAME + ",C."
                + TABLES.CONTENT.ID
                + ",B." + TABLES.EBRANDMAP.BRAND_ID + ",C." + TABLES.CONTENT.FILE_TYPE_ID + ",C."
                + TABLES.CONTENT.FILE_TYPE_ID + ",C." + TABLES.CONTENT.LOCAL_FILE_PATH
                + ",PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " from " + TABLES.CONTENT.TABLE +
                " C inner join " + TABLES.EGROUP.TABLE + " on "
                + "C." + TABLES.CONTENT.GROUP_ID + "=" + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.ID +
                " inner join " + TABLES.EBRANDMAP.TABLE + " B on C." + TABLES.CONTENT.ID + "=" +
                "B." + TABLES.EBRANDMAP.CONTENT_ID +
                " left outer join " + TABLES.FAVOURITEDETAIL.TABLE + " F on " + "C." + TABLES.CONTENT.ID + "= F."
                + TABLES.FAVOURITEDETAIL.CONTENT +
                " and B." + TABLES.EBRANDMAP.BRAND_ID + "=F." + TABLES.FAVOURITEDETAIL.BRAND +
                " inner join " + TABLES.PRODUCTGROUPS.TABLE + " PG  on PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=B." + TABLES.EBRANDMAP.BRAND_ID +
                " inner join " + TABLES.DETAILINGTO.TABLE + " DT on DT." + TABLES.DETAILINGTO.ID + "=C." + TABLES.CONTENT.DETALING_TO + " where upper(DT." +
                TABLES.DETAILINGTO.NAME + ")='DOCTOR' and " + TABLES.CONTENT.SYNCED + "=1 and  (( C." + TABLES.CONTENT.TO_DATE + " >='" + ConvertYYMMDD(new Date()) +
                "' ) OR (C." + TABLES.CONTENT.FROM_DATE + " is '' or C." + TABLES.CONTENT.TO_DATE + " is '' )) and " + Qry +
                " order by PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME;
    } else {
        query2 = "SELECT DISTINCT " + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.NAME + " AS GroupName " + ",C." + TABLES.CONTENT.NAME + ",C."
                + TABLES.CONTENT.ID
                + ",B." + TABLES.EBRANDMAP.BRAND_ID + ",C." + TABLES.CONTENT.FILE_TYPE_ID + ",C."
                + TABLES.CONTENT.FILE_TYPE_ID + ",C." + TABLES.CONTENT.LOCAL_FILE_PATH
                + ",PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME + " from " + TABLES.CONTENT.TABLE +
                " C inner join " + TABLES.EGROUP.TABLE + " on "
                + "C." + TABLES.CONTENT.GROUP_ID + "=" + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.ID +
                " inner join " + TABLES.EBRANDMAP.TABLE + " B on C." + TABLES.CONTENT.ID + "=" +
                "B." + TABLES.EBRANDMAP.CONTENT_ID +
                " left outer join " + TABLES.FAVOURITEDETAIL.TABLE + " F on " + "C." + TABLES.CONTENT.ID + "= F."
                + TABLES.FAVOURITEDETAIL.CONTENT +
                " and B." + TABLES.EBRANDMAP.BRAND_ID + "=F." + TABLES.FAVOURITEDETAIL.BRAND +
                " inner join " + TABLES.PRODUCTGROUPS.TABLE + " PG  on PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "=B." + TABLES.EBRANDMAP.BRAND_ID +
                " inner join " + TABLES.DETAILINGTO.TABLE + " DT on DT." + TABLES.DETAILINGTO.ID + "=C." + TABLES.CONTENT.DETALING_TO + " where upper(DT." +
                TABLES.DETAILINGTO.NAME + ")='DOCTOR' and " + TABLES.CONTENT.SYNCED + "=1 and  (( '" + ConvertYYMMDD(new Date()) +
                "' between C." + TABLES.CONTENT.FROM_DATE + " and " + "C." + TABLES.CONTENT.TO_DATE + " ) OR (C." + TABLES.CONTENT.FROM_DATE + " is '' or C." + TABLES.CONTENT.TO_DATE + " is '' )) and " + Qry +
                " order by PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME;
    }
    $.when(dbObject.execute(query2, [])).done(function (data) {
        var dataset = data.rows;
        var dd = $('#contentsWrapper').empty();
        if (dataset.length > 0) {
            dd.append('<div class="col-xs-12">');
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var Images = "Images/E-book.png";
                var values = item[TABLES.CONTENT.ID] + '&' + item[TABLES.EBRANDMAP.BRAND_ID];
                var qv = "'" + Qry + '#' + values + "'";
                //dd.append('<div class="ui-grid-a">');
                if (lastDisplayedBrand !== item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME]) {
                    dd.append('<div class="row" style="margin-top:5px">');
                    dd.append('<div class="col-xs-12" style="font-weight:bold;font-size:16px;background-color:#f9f9f9; color: orange;"><u>' + item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME] + '</u></div>');
                    dd.append('</div>');
                }
                if ($.session.get("FAV") == "YES") {
                    if ((lastDisplayedBrand === item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME])) {
                        if (toogleClicked) {
//                                if (item["FILETYPEID"] == 6) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item[TABLES.CONTENT.LOCAL_FILE_PATH] + '","' + values + '","' + item[TABLES.CONTENT.FILE_TYPE_ID] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
                            //           dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                        } else {
//                                if (item["FILETYPEID"] == 6) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item[TABLES.CONTENT.LOCAL_FILE_PATH] + '","' + values + '","' + item[TABLES.CONTENT.FILE_TYPE_ID] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                        }
                    } else {
                        dd.append('<div class="row">');
                        if (toogleClicked) {
//                                if (item["FILETYPEID"] == 6) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item[TABLES.CONTENT.LOCAL_FILE_PATH] + '","' + values + '","' + item[TABLES.CONTENT.FILE_TYPE_ID] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                        } else {
//                                if (item["FILETYPEID"] == 6) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item[TABLES.CONTENT.LOCAL_FILE_PATH] + '","' + values + '","' + item[TABLES.CONTENT.FILE_TYPE_ID] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                        }
                        dd.append('</div>');
                    }
                } else {
                    if ((lastDisplayedBrand === item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME])) {
                        if (toogleClicked) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><a style="font-size:12px" onclick="gotoPlaySection(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p> </a></div>');
                        } else {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><a style="font-size:12px"  onclick="gotoPlaySection(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p> </a></div>');
                        }
                    } else {
                        dd.append('<div class="row">');
                        if (toogleClicked) {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><a onclick="gotoPlaySection(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p> </a></div>');
                        } else {
                            dd.append('<div style="font-size:12px" class="col-xs-4 edetailContentsWrapper"><a onclick="gotoPlaySection(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:100%;height:100%"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item[TABLES.CONTENT.NAME] + '<br/><b>Group Name&nbsp:</b> ' + item[TABLES.EGROUP.NAME] + '</p> </a></div>');
                        }
                        dd.append('</div>');
                    }
                }
                lastDisplayedBrand = item[TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME];
            }
            dd.append('</div>');
        }
    }).fail(function (_message) {
        alert(_message);
    });

});

function viewHTml(_localPath, _values, _fileType) {
    $.session.set("FDP", _values);
    if (_fileType == 6) {
        window.location.href = _localPath + "/index.html";
    } else if (_fileType == 2) {
        $.session.set("pdfFilePath", _localPath);
        document.location = "Tracking.html";
    } else {
        window.plugins.fileOpener.open(_localPath);
    }
}


function gotoPlaySection(value) {

    var qr = value.split('#');

    var qr2 = qr[1].split('&');
    var selectQuery = "Select distinct " + TABLES.CONTENT.ID + "," + TABLES.CONTENT.CONTENT + "," +
            TABLES.CONTENT.LOCAL_FILE_PATH + "," + TABLES.CONTENT.FILE_TYPE_ID + "," +
            TABLES.CONTENT.NAME + " from " +
            TABLES.CONTENT.TABLE + " where " + TABLES.CONTENT.ID + "=?";
    var selectValues = new Array(qr2[0]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {


            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                //  alert(item["LOCALFILEPATH"]);
                // window.plugins.fileOpener.open();
                $.session.set("fileTypeLastPlayed", item[TABLES.CONTENT.FILE_TYPE_ID]);
                fileTypeLastPlayed = item[TABLES.CONTENT.FILE_TYPE_ID];
                if (item[TABLES.CONTENT.FILE_TYPE_ID] == 6) {
                    //window.location="DailyReport.html#EDetailhtmldes"
                    screen.lockOrientation('landscape');
                    if ($.session.get("VDP") == null || $.session.get("VDP") == undefined || $.session.get("VDP") == "") {
                        clearInterval(timer);
                        playingtime = 0;
                        timer = setInterval(increment, 1000);

                        if ($.session.get('fromUnlisted') === "true") {
                            $.session.set("customerDCRSLNNO", $.session.get("customerDCRSLNNO"));
                        }
                        var tempQR = value.split('#')
                        $.session.set("VDP", tempQR[1]);
                        localStorage.setItem('fromedtail', true);
                        console.log(item[TABLES.CONTENT.LOCAL_FILE_PATH]);
                        window.location.href = item[TABLES.CONTENT.LOCAL_FILE_PATH] + "/index.html";
                    } else {

                        var qr3 = $.session.get("VDP").split('&');


                        //insertintoebrand(qr3[1], qr3[0], playingtime)
                        if ($.session.get('fromUnlisted') === "true") {
                            var tempqr = value.split('#');

                            var tempqr2 = tempqr[1].split('&');
                            var selectQuery = "SELECT * FROM " + TABLES.EUNLISTEDBRANDS.TABLE + " WHERE " + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "=? and " + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "=? and " +
                                    TABLES.EUNLISTEDBRANDS.BRAND_ID + "=?  and " + TABLES.EUNLISTEDBRANDS.CONTENT_ID + "=?";
                            var selectValues = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), tempqr2[1], tempqr2[0]);
                            $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
                                var dataset = data.rows;
                                if (dataset.length > 0) {

                                } else {
//                                            db.transaction(function (tx) {
//                                                tx.executeSql("INSERT INTO EUNLISTEDBRANDS(DCRULDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCRUID"), $.session.get("ActivityID"), qr3[1], qr3[0], playingtime, 0, 0], function (tx, result) {
                                    clearInterval(timer);
                                    playingtime = 0;
                                    timer = setInterval(increment, 1000);

                                    $.session.set("customerDCRSLNNO", $.session.get("customerDCRSLNNO"));
                                    var tempQR = value.split('#')
                                    $.session.set("VDP", tempQR[1]);
                                    localStorage.setItem('fromedtail', true);
                                    console.log(item["LOCALFILEPATH"]);
                                    window.location.href = item["LOCALFILEPATH"] + "/index.html";
//                                                });
//                                            });

                                }
                            });
                        } else {
                            var tempqr = value.split('#');

                            var tempqr2 = tempqr[1].split('&');

                            var selectQuery = "SELECT * FROM " + TABLES.EBRANDS.TABLE + " WHERE " + TABLES.EBRANDS.DCRDOCTOR_SLNO + "=? and " + TABLES.EBRANDS.DCR_SL_NO + "=? and "
                                    + TABLES.EBRANDS.BRAND_ID + "=?  and " + TABLES.EBRANDS.CONTENT_ID + "=?";
                            var selectValues = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), tempqr2[1], tempqr2[0]);
                            $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
                                var dataset = data.rows;
                                if (dataset.length > 0) {
                                    alert("Brand already edetailed");
                                } else {
//                                            db.transaction(function (tx) {
//                                                tx.executeSql("INSERT INTO EBRANDS(DCRDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCALLID"), $.session.get("ActivityID"), qr3[1], qr3[0], playingtime, 0, 0], function (tx, result) {
//                                                    clearInterval(timer);
                                    playingtime = 0;
                                    timer = setInterval(increment, 1000);


                                    var tempQR = value.split('#')
                                    $.session.set("VDP", tempQR[1]);
                                    localStorage.setItem('fromedtail', true);
                                    console.log(item[TABLES.CONTENT.LOCAL_FILE_PATH]);
                                    window.location.href = item[TABLES.CONTENT.LOCAL_FILE_PATH] + "/index.html";
//                                                });
//                                            });

                                }
                            });

                        }
                    }
                } else {
                    if ($.session.get("VDP") == null || $.session.get("VDP") == undefined || $.session.get("VDP") == "") {

                    } else {
                        if ($.session.get('fromUnlisted') === "true") {

                            $.session.set("customerDCRSLNNO", $.session.get("customerDCRSLNNO"));
                            var qr3 = $.session.get("VDP").split('&');
                            insertintoULebrand(qr3[1], qr3[0], playingtime);
                        } else {
                            var qr3 = $.session.get("VDP").split('&');

                            insertintoebrand(qr3[1], qr3[0], playingtime);
                        }

                    }

                    clearInterval(timer);
                    playingtime = 0;
                    timer = setInterval(increment, 1000);


                    var qr = value.split('#');

                    var qr2 = qr[1].split('&');
                    $.session.set("VDP", qr[1]);
                    if (item[TABLES.CONTENT.FILE_TYPE_ID] == 2) {
                        if ($.session.get('fromUnlisted') === "true") {
                            $.session.set("customerDCRSLNNO", $.session.get("customerDCRSLNNO"));
                        }
                        screen.lockOrientation('landscape');
                        localStorage.setItem('fromedtail', true);
                        $.session.set("pdfFilePath", item[TABLES.CONTENT.LOCAL_FILE_PATH]);
                        document.location = "Tracking.html";
                    } else {
                        window.plugins.fileOpener.open(item[TABLES.CONTENT.LOCAL_FILE_PATH]);
                    }
                }

            }
        } else {

        }
    }).fail(function (_errormessage) {

    });
}

function insertintoebrand(BrandID, ContentID, Time)
{
    var selectQuery = "SELECT * FROM " + TABLES.EBRANDS.TABLE + " WHERE " + TABLES.EBRANDS.DCRDOCTOR_SLNO + "=? and " +
            TABLES.EBRANDS.DCR_SL_NO + "=? and " + TABLES.EBRANDS.BRAND_ID + "=?  and " + TABLES.EBRANDS.CONTENT_ID + "=?";
    var selectValues = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID);

    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
            var updateQuery = "Update " + TABLES.EBRANDS.TABLE + " set " + TABLES.EBRANDS.TIME + "=?  where " +
                    TABLES.EBRANDS.DCRDOCTOR_SLNO + "= ? AND " + TABLES.EBRANDS.BRAND_ID + "= ? AND " + TABLES.EBRANDS.CONTENT_ID + "=?";
            var updateArray = new Array(Time, $.session.get("customerDCRSLNNO"), BrandID, ContentID);
            $.when(dbObject.execute(updateQuery, updateArray)).done(function (data) {

            });
        } else {
            var insertQuery = "INSERT INTO " + TABLES.EBRANDS.TABLE + "(" + TABLES.EBRANDS.DCRDOCTOR_SLNO +
                    "," + TABLES.EBRANDS.DCR_SL_NO + "," + TABLES.EBRANDS.BRAND_ID + "," +
                    TABLES.EBRANDS.CONTENT_ID + "," + TABLES.EBRANDS.TIME + "," + TABLES.EBRANDS.KEY_ID + "," +
                    TABLES.EBRANDS.FEEDBCK_ID + ") VALUES (?,?,?,?,?,?,?)";
            var insertArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0);
            $.when(dbObject.execute(insertQuery, insertArray)).done(function (data) {

            });

        }
    });
}

function insertintoULebrand(BrandID, ContentID, Time)
{

    var selectQuery = "SELECT * FROM " + TABLES.EUNLISTEDBRANDS.TABLE + " WHERE " + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "=? and "
            + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "=? and " +
            TABLES.EUNLISTEDBRANDS.BRAND_ID + "=? and " + TABLES.EUNLISTEDBRANDS.CONTENT_ID + "=?";
    var selectArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID);
    $.when(dbObject.execute(selectQuery, selectArray)).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
//            checkUNEBD();
        } else {
            var insertQuery = "INSERT INTO " + TABLES.EUNLISTEDBRANDS.TABLE + "(" +
                    TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "," + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "," +
                    TABLES.EUNLISTEDBRANDS.BRAND_ID + "," + TABLES.EUNLISTEDBRANDS.CONTENT_ID + "," +
                    TABLES.EUNLISTEDBRANDS.TIME + "," + TABLES.EUNLISTEDBRANDS.KEY_ID + "," + TABLES.EUNLISTEDBRANDS.FEEDBCK_ID +
                    ") VALUES (?,?,?,?,?,?,?)";
            var insertArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0);
            $.when(dbObject.execute(insertQuery, insertArray)).done(function (data) {
            });

        }
    });




}

function insertintoULebrandlast(BrandID, ContentID, Time)
{

    var selectQuery = "SELECT * FROM " + TABLES.EUNLISTEDBRANDS.TABLE + " WHERE " + TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "=? and "
            + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "=? and " +
            TABLES.EUNLISTEDBRANDS.BRAND_ID + "=? and " + TABLES.EUNLISTEDBRANDS.CONTENT_ID + "=?";
    var selectArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID);

    $.when(dbObject.execute(selectQuery, selectArray)).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
//            checkUNEBD();
        } else {
            var insertQuery = "INSERT INTO " + TABLES.EUNLISTEDBRANDS.TABLE + "(" +
                    TABLES.EUNLISTEDBRANDS.DCR_UL_DOCTOR_SLNO + "," + TABLES.EUNLISTEDBRANDS.DCR_SLNO + "," +
                    TABLES.EUNLISTEDBRANDS.BRAND_ID + "," + TABLES.EUNLISTEDBRANDS.CONTENT_ID + "," +
                    TABLES.EUNLISTEDBRANDS.TIME + "," + TABLES.EUNLISTEDBRANDS.KEY_ID + "," + TABLES.EUNLISTEDBRANDS.FEEDBCK_ID +
                    ") VALUES (?,?,?,?,?,?,?)";
            var insertArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0);
            $.when(dbObject.execute(insertQuery, insertArray)).done(function (data) {
            });
        }
    });




}
function insertintoebrandlast(BrandID, ContentID, Time)
{

    var selectQuery = "SELECT * FROM " + TABLES.EBRANDS.TABLE + " WHERE " + TABLES.EBRANDS.DCRDOCTOR_SLNO + "=? and " +
            TABLES.EBRANDS.DCR_SL_NO + "=? and " + TABLES.EBRANDS.BRAND_ID + "=?  and " + TABLES.EBRANDS.CONTENT_ID + "=?";
    var selectValues = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID);

    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataset = data.rows;
        if (dataset.length > 0) {
            CheckEBD();
        } else {
            var insertQuery = "INSERT INTO " + TABLES.EBRANDS.TABLE + "(" + TABLES.EBRANDS.DCRDOCTOR_SLNO +
                    "," + TABLES.EBRANDS.DCR_SL_NO + "," + TABLES.EBRANDS.BRAND_ID + "," +
                    TABLES.EBRANDS.CONTENT_ID + "," + TABLES.EBRANDS.TIME + "," + TABLES.EBRANDS.KEY_ID + "," +
                    TABLES.EBRANDS.FEEDBCK_ID + ") VALUES (?,?,?,?,?,?,?)";
            var insertArray = new Array($.session.get("customerDCRSLNNO"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0);
            $.when(dbObject.execute(insertQuery, insertArray)).done(function (data) {

            });

        }
    });
}


function CheckEBD() {
    displayAddedEbrands();
}

function checkUNEBD() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EUNLISTEDBRANDS E inner join PRODUCTGROUPS P on P.PRODUCTGROUP_ID=E.BRANDID inner join CONTENT C on C.ID=E.CONTENTID  WHERE DCRULDOCTOR_SLNO=? and DCR_SLNO=?  ", [$.session.get("customerDCRSLNNO"), $.session.get("ActivityID")], function (tx, result) {
            dataset = result.rows;
            var dd = $('#UNEDETAILBRANDIDBODY').empty();
            if (dataset.length > 0) {
                ESTATUS = true;
                $('#UNEDETAILBRANDID').show();
//      var ele = document.getElementById("EDETAILBRANDID");
//       ele.style.display='block';
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    var ID = item["DCRDOCTOR_SLNO"] + 'A' + item["DCR_SLNO"] + 'A' + item["BRANDID"] + 'A' + item["CONTENTID"];
                    var value = item["BRANDID"] + '$' + item["CONTENTID"];
                    dd.append(' <tr><td style="width:25%">' + item["PRODUCTGROUPNAME"] + '</td>' +
                            ' <td style="width:25%">' + item["NAME"] + '</td>' +
                            '<td  style="width:15%">' + item["TIME"] + '</td>' +
                            ' <td  style="width:20%"><select class="" id=' + ID + ' data-theme="b"><option selected value="0">Select</option> </select></td>' +
                            '<td  style="width:15%"><button data-theme="b" data-iconpos="notext" onclick="deleteUNEbrand(\'' + value + '\')"  data-icon="delete"> </button></td>'
                            + '</tr>');
                    displayFeedback(ID);
                }

                $('#UNEDETAILBRANDID').trigger('create');
            } else {
                ESTATUS = false;
                $('#UNEDETAILBRANDID').hide();
//        var ele = document.getElementById("EDETAILBRANDID");
//       ele.style.display='none';
            }
        });

        $('#UNEDETAILBRANDID').trigger('create');
    });
}

function gotoUnlisted() {
    $.session.set("VDP", "");

    window.location = "DailyReport.html#UNLISTEDDOCID";
}

function gotohomepage() {
    $.session.set("VDP", "");

    window.location = "DailyReport.html#DoctorFieldID";
}

function increment() {
    playingtime = playingtime + 1;
}