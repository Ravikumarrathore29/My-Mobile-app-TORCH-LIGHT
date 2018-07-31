function ConvertYYMMDD(input) {
    var d = new Date(input);
    var a = d.getFullYear();
    var b = ("0" + (d.getMonth() + 1)).slice(-2);
    var c = ("0" + d.getDate()).slice(-2);
    var e = a + '-' + b + '-' + c;
    return e;
}

var db = openDatabase("KEAPRO", "1.0", "KEAPRO", (5 * 1024 * 1024));
document.addEventListener("deviceready", function () {
    screen.lockOrientation('landscape');
    $('.sidenav .row').css('margin-top', '70px');
//    $('.CustomerImage').css('height','50px');
//    $('.CustomerImage').css('width','50px');
//    $('.fa').css('fontSize', '50px');
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
}, false);

$(function () {
    init_data();
    assignEvents();
});

function init_data() {
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

    $("#brandBtn").click(function (e) {
        e.preventDefault();
        $("#brandCaret").toggleClass("open");
        $('#brand').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#fileTypeBtn").click(function (e) {
        e.preventDefault();
        $("#fileTypeCaret").toggleClass("open");
        $('#fileType').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#groupBtn").click(function (e) {
        e.preventDefault();
        $("#groupCaret").toggleClass("open");
        $('#group').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#favoritesBtn").click(function (e) {
        e.preventDefault();
        $("#favoritesCaret").toggleClass("open");
        $('#favorites').toggle("2000");
        $('.FILETYPE').prop('checked', false);
        $('.GROUPS').prop('checked', false);
        $('.EBRANDMAP').prop('checked', false);
    });

    $('.btn').removeClass('ui-btn');
    $('.btn').removeClass('ui-shadow');
    $('.btn').removeClass('ui-corner-all');
    $('.btn').removeClass('ui-link');
//    $('label').parent().removeClass();
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $('.btn').removeClass('ui-btn');
        $('.btn').removeClass('ui-shadow');
        $('.btn').removeClass('ui-corner-all');
        $('.btn').removeClass('ui-link');
        $('label').parent().removeClass('ui-checkbox');
        $('label').removeClass();
        console.log($('#brand').html().toString());
        if (toogleClicked === 0) {
            toogleClicked = 1;
        } else {
            toogleClicked = 0;
        }
        $("#wrapper").toggleClass("toggled");

        if ($('.edetailContentsWrapper').hasClass('col-xs-6')) {
            $('.edetailContentsWrapper').removeClass('col-xs-6').addClass('col-xs-12');
        } else {
            $('.edetailContentsWrapper').removeClass('col-xs-12').addClass('col-xs-6');
        }
    });
    $('#clearFilters').click(function (e) {
        $('.FILETYPE').prop('checked', false);
        $('.GROUPS').prop('checked', false);
        $('.EBRANDMAP').prop('checked', false);
        $('.FAVOURITERD').prop('checked', false);
        displayContents();
    });
    $("#brandBtn").click(function (e) {
        e.preventDefault();
        $("#brandCaret").toggleClass("open");
        $('#brand').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#fileTypeBtn").click(function (e) {
        e.preventDefault();
        $("#fileTypeCaret").toggleClass("open");
        $('#fileType').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#groupBtn").click(function (e) {
        e.preventDefault();
        $("#groupCaret").toggleClass("open");
        $('#group').toggle("2000");
        $('.FAVOURITERD').prop('checked', false);
    });
    $("#favoritesBtn").click(function (e) {
        e.preventDefault();
        $("#favoritesCaret").toggleClass("open");
        $('#favorites').toggle("2000");
        $('.FILETYPE').prop('checked', false);
        $('.GROUPS').prop('checked', false);
        $('.EBRANDMAP').prop('checked', false);
    });
    getFileTypes();
    getGroups();
    getFAVOURITE();
    getEBRANDMAP();
    displayContents();


    $('#btnBackVedioPLAYID').click(function () {

        var qr2 = $.session.get("VDP").split('&');

        insertintoebrand(qr2[1], qr2[0], playingtime);
        clearInterval(timer);


    });


    $('#btnDoneVedioID').click(function () {




        if ($.session.get("VDP") == null || $.session.get("VDP") == undefined || $.session.get("VDP") == "") {
            if ($.session.get('fromUnlisted') !== "true") {
                gotohomepage();
            } else {
                //checkUNEBD();
                //insertintoULebrandlast(qr3[1], qr3[0], playingtime);
                db.transaction(function (tx) {
                    tx.executeSql("Select * from dcrunlisteddoctors where DCRUNLISTEDDOCTOR_SLNO= ?", [$.session.get("DCRUID")], function (tx, resultData) {
                        var ULDataset = resultData.rows;
                        var item = ULDataset.item(0);
                        $('#UNAMEID').val(item["DOCTORNAME"]);
                        $('#UCLASSID').selectmenu();
                        $('#UCLASSID').val(parseInt(item["SPECIALITY_ID"]));
                        $('#UCLASSID').selectmenu('refresh', true);
                        var workedWith = item["WorkedWith"];
                        workedWith = workedWith.split(",");
                        var i = 0, chkd = "";
                        $('.WorkedwithUDoctor').each(function () {
                            if (workedWith[i] == "1") {
                                $(this).prop('checked', true);
                                chkd += $(this).val() + ",";
                            }
                            i++;
                        });
                        chkd = chkd.slice(0, -1);
                        $('#UselecteditemDoctor').text(chkd);

                        DisplayUNDoctorBrand();
                        checkUNEBD();
                        DisplayUNDoctorAddedSamples();
                        gotoUnlisted();
                    });
                });
            }

        } else {

            var qr3 = $.session.get("VDP").split('&');
            if ($.session.get('fromUnlisted') !== "true") {
                insertintoebrandlast(qr3[1], qr3[0], playingtime);
                clearInterval(timer);
                //syncPageTracking();
                gotohomepage();
            } else {
                //checkUNEBD();
                if ($.session.get("fileTypeLastPlayed") != 6) {
                    insertintoULebrandlast(qr3[1], qr3[0], playingtime);
                    db.transaction(function (tx) {
                        tx.executeSql("Select * from dcrunlisteddoctors where DCRUNLISTEDDOCTOR_SLNO= ?", [$.session.get("DCRUID")], function (tx, resultData) {
                            var ULDataset = resultData.rows;
                            var item = ULDataset.item(0);
                            $('#UNAMEID').val(item["DOCTORNAME"]);
                            $('#UCLASSID').selectmenu();
                            $('#UCLASSID').val(parseInt(item["SPECIALITY_ID"]));
                            $('#UCLASSID').selectmenu('refresh', true);
                            var workedWith = item["WorkedWith"];
                            workedWith = workedWith.split(",");
                            var i = 0, chkd = "";
                            $('.WorkedwithUDoctor').each(function () {
                                if (workedWith[i] == "1") {
                                    $(this).prop('checked', true);
                                    chkd += $(this).val() + ",";
                                }
                                i++;
                            });
                            chkd = chkd.slice(0, -1);
                            $('#UselecteditemDoctor').text(chkd);

                            DisplayUNDoctorBrand();
                            checkUNEBD();
                            DisplayUNDoctorAddedSamples();
                            gotoUnlisted();
                        });
                    });
                } else {
                    checkUNEBD();
                    gotoUnlisted();
                }

            }

        }

    })
    if ($.session.get("FAV") == "YES") {
        $('#Combinations').hide();
    }

    $('#Combinations').click(function () {
        db.transaction(function (tx) {
            tx.executeSql("select DCREDetailPageGrouping.GroupID,DCREDetailPageFAVORITES.ContentID,Content.FROMDATE,Content.TODATE from DCREDetailPageGrouping inner join DCREDetailPageFAVORITES on DCREDetailPageFAVORITES.ID = DCREDetailPageGrouping.FAVID inner join Content on Content.ID = DCREDetailPageFAVORITES.ContentID Where '" + ConvertYYMMDD($.session.get("lastSynced")) + "' not between Content.FROMDATE and Content.TODATE group by Content.ID,DCREDetailPageGrouping.GroupID", [], function (tx1, result) {
                var dataRows = result.rows;
                var expiredCombinations = new Array();
                if (dataRows.length > 0) {
                    for (var i = 0; i < dataRows.length; i++) {
                        var dataItem = dataRows.item(i);
                        expiredCombinations.push(dataItem["GroupId"]);
                    }
                }
                tx.executeSql("select * from DCREDetailPageGrouping inner join DCREDetailPageFAVORITES on DCREDetailPageFAVORITES.ID = DCREDetailPageGrouping.FAVID group by GroupId", [], function (tx, result) {

                    //var dd = $('#tblFavouritesID');
                    var dd = $('#CONENTIDIMAGE').empty();
                    var htmlFavDataset = result.rows;
                    if (htmlFavDataset.length > 0) {
                        for (var i = 0, item = null; i < htmlFavDataset.length; i++) {
                            item = htmlFavDataset.item(i);
                            if ($.inArray(item["GroupId"], expiredCombinations) > -1) {

                            } else {
                                //dd.append('<label><a data-theme="a" style="font-size: 16px;color:blue" name="FAVOURITE" class="FAVOURITE" id="' + item["ID"] + '" onclick="groupedFav(' + item["GroupId"] + ',' + item["CONTENTID"] + ',' + item["BRANDID"] + ')">' + item["GroupName"] + '</a></label> <br />');
                                dd.append('<li><figure><a id="' + item["ID"] + '" onclick="groupedFav(' + item["GroupId"] + ',' + item["CONTENTID"] + ',' + item["BRANDID"] + ')" ><img src="Images/html5_150.png" alt="Image not found" /><figcaption>' + item["GroupName"] + ' </figcaption></a></figure></li>');
                            }
                        }
                        $('#tblFavouritesID').controlgroup().trigger('create');

                    } else {
                        alert("No Combinations");
                        displayContents();
                    }
                });
            });

        });
    });

    $('#clearFilters').click();


}

function assignEvents() {
    $('.edetailContentsWrapper').click(function () {
        $(this).toggleClass('contentSelected');
    });

    $('#edetailDoneBtn').click(function () {
        $('.edetailContentsWrapper').each(function () {
            if ($(this).hasClass('contentSelected')) {
                $(this).toggleClass('contentSelected');
            } else {
                $(this).hide();
            }
        });
    });
}

function getFileTypes() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT Distinct F.ID,F.NAME FROM FILETYPE  F inner join CONTENT C on C.FILETYPEID=F.ID ", [], function (tx, result) {
            var dd = $('#fileType');

            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if (item["ID"] == "6") {
                        dd.append('<label data-role="none" style="color:white"><input data-role="none" type="checkbox" name="FILETYPE" class="FILETYPE" id="' + item["ID"] + '"  value=' + item["ID"] + '  />html</label>');
                    } else {
                        dd.append('<label data-role="none" style="color:white"><input data-role="none" type="checkbox" name="FILETYPE" class="FILETYPE" id="' + item["ID"] + '"  value=' + item["ID"] + '  />' + item["NAME"] + '</label>');
                    }
                }
                $('.FILETYPE').change(function () {

                    displayContents();
                    $('.FAVOURITERD').prop('checked', false);

                });

                //$('#fileType').controlgroup().trigger('create');
            } else {

            }
        });
        //$('#fileType').controlgroup().trigger('create');

    });
}


function getGroups() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT Distinct F.ID,F.NAME FROM EGROUP F inner join CONTENT C on C.GROUPID=F.ID ", [], function (tx, result) {
            var dd = $('#group');

            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<label data-role="none" style="color:white"><input data-role="none" type="checkbox" name="GROUPS" class="GROUPS"  id="' + item["ID"] + '"  value=' + item["ID"] + '  />' + item["NAME"] + '</label>');
                }
                //dd.append('<label ><input type="checkbox" name="GROUPS" value="true" class="GROUPS"  id="pageGroups" /> Grouped Pages</label>');


                $('.GROUPS').change(function () {

                    displayContents();
                    $('.FAVOURITERD').prop('checked', false);
                    $('.FAVOURITE').prop('checked', false);

                });
                //$('#group').controlgroup().trigger('create');
            } else {

            }
        });
        //$('#group').controlgroup().trigger('create');

    });
}

function getFAVOURITE() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT Distinct * FROM FAVOURITE ", [], function (tx, result) {
            var dd = $('#favorites').empty();
            var dd1;
            if ($.session.get("FAV") == "YES") {
                dd1 = $("#DoctorWorkSelectIDTABLE").empty();

            }
            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if ($.session.get("FAV") == "YES") {

                        dd.append('<label style="color:white"><input type="radio" name="FAVOURITERD" class="FAVOURITERD" onclick="checkfavorite(' + item["ID"] + ');" id="' + item["ID"] + '"  value=' + item["ID"] + '  />' + item["NAME"] + '</label>');

                    } else {
                        dd.append('<label data-role="none" style="color:white"><input data-role="none" type="checkbox" name="FAVOURITE" class="FAVOURITE" id="' + item["ID"] + '"  value=' + item["ID"] + '  />' + item["NAME"] + '</label>');

                    }
                    if ($.session.get("FAV") == "YES") {
                        dd1.append('<label><input type="radio" name="FAVOURITERADIO" class="FAVOURITERADIO" id="' + item["ID"] + '"  value=' + item["ID"] + '  />' + item["NAME"] + '</label>');

                    }


                }
                $('.FAVOURITE').change(function () {

                    displayContents();
                    $('.FILETYPE').prop('checked', false);
                    $('.GROUPS').prop('checked', false);
                    $('.EBRANDMAP').prop('checked', false);

                });


                //$('#favorites').controlgroup().trigger('create');
                if ($.session.get("FAV") == "YES") {
                    dd1.append('<label ><a href="" onclick="javascript:submitFormRD()"   data-role="button"   >Save</a></label>');
                    $('#DoctorWorkSelectIDTABLE').controlgroup().trigger('create');
                }
            } else {

            }
        });


        //$('#tblFavouritesID').controlgroup().trigger('create');
        if ($.session.get("FAV") == "YES") {
            $('#DoctorWorkSelectIDTABLE').controlgroup().trigger('create');

        }

    });
}

function groupedFav(_groupId, _contentId, _brandId) {
    localStorage.setItem('fromGroup', true);
    localStorage.setItem('groupId', _groupId);
    var value = _contentId + '&' + _brandId;
    $.session.set("VDP", value);
    if ($.session.get('fromUnlisted') === "true") {
        $.session.set("DCALLID", $.session.get("DCRUID"));
    }
    window.location.href = "EdetailDisplayFavouritesGrouping.html";
}

function getEBRANDMAP() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT Distinct EB.BRANDID as ID,PRODUCTGROUPNAME as NAME FROM EBRANDMAP  EB inner join PRODUCTGROUPS PD on PD.PRODUCTGROUP_ID =EB.BRANDID", [], function (tx, result) {
            var dd = $('#brand');

            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<label data-role="none" style="color:white"><input data-role="none" type="checkbox" name="EBRANDMAP" class="EBRANDMAP" id="' + item["ID"] + '"  value=' + item["ID"] + ' />' + item["NAME"] + '</label>');
                }
                $('.EBRANDMAP').change(function () {

                    displayContents();
                    $('.FAVOURITERD').prop('checked', false);

                });

                //$('#brand').controlgroup().trigger('create');
            } else {

            }
        });
        //$('#brand').controlgroup().trigger('create');

    });
}

function displayContents() {

    var FILETYPEA = [];
    var GROUPSA = [];
    var FAVOURITEA = [];
    var EBRANDMAPA = [];
    var Qry = "";
    var groupedClicked;
    var filteredBy = "";
    $('input:checkbox[name=FILETYPE]:checked').each(function ()
    {
        FILETYPEA.push($(this).val());
    });


    $('input:checkbox[name=GROUPS]:checked').each(function ()
    {
        if ($(this).val() == "true") {
            groupedClicked = true;
        } else {
            GROUPSA.push($(this).val());
        }
    });



    $('input:checkbox[name=FAVOURITE]:checked').each(function ()
    {
        FAVOURITEA.push($(this).val());
    });


    $('input:checkbox[name=EBRANDMAP]:checked').each(function ()
    {
        EBRANDMAPA.push($(this).val());
    });



    if (FILETYPEA.length > 0) {
        Qry = 'FILETYPEID in (' + FILETYPEA + ')';
        filteredBy += "FileType";
    } else {
        Qry = '0=0';
    }
    if (GROUPSA.length > 0)
    {
        Qry += ' and GROUPID in (' + GROUPSA + ')';
        if (filteredBy.length > 0) {
            filteredBy += ",Group";
        } else {
            filteredBy += "Group";
        }
    } else {
        Qry += ' and 0=0'
    }

    if (FAVOURITEA.length > 0)
    {
        Qry += ' and FAVOURITEID in (' + FAVOURITEA + ')';
        filteredBy = "Favorites";
    } else {
        Qry += ' and 0=0'
    }

    if (EBRANDMAPA.length > 0)
    {
        Qry += ' and BRANDID in (' + EBRANDMAPA + ')';
        if (filteredBy.length > 0) {
            filteredBy += ",Brand";
        } else {
            filteredBy += "Brand";
        }
    } else {
        Qry += ' and 0=0'
    }
    if ((FILETYPEA.length === 0) && (GROUPSA.length === 0) && (FAVOURITEA.length === 0) && (EBRANDMAPA.length === 0)) {
        filteredBy = "";
    }
    var query2 = "";
//    if ($.session.get("FAV") == "YES") {
//        query2 = "select DISTINCT  EGROUP.NAME AS GroupName,C.NAME,C.ID,B.BRANDID,C.FILETYPEID,C.LOCALFILEPATH,PG.PRODUCTGROUPNAME from CONTENT  C inner join EGROUP on C.GROUPID = EGROUP.ID  inner join EBRANDMAP B on C.ID=B.CONTENTID left outer join FAVOURITEDETAIL F on C.ID=F.CONTENT and B.BRANDID=F.BRAND inner join PRODUCTGROUPS PG on PG.PRODUCTGROUP_ID=B.BRANDID inner join DETAILINGTO DT on DT.ID=C.DETALINGTO  where upper(DT.NAME)='DOCTOR' and SYNCED=1 and  (( C.TODATE >='" + ConvertYYMMDD(new Date()) + "' ) OR (C.FROMDATE is '' or C.TODATE is '' )) and " + Qry + " order by PG.PRODUCTGROUPNAME";
//
//    } else {
//    query2 = "select DISTINCT  e_group.NAME AS GroupName,C.NAME,C.ID,B.BRANDID,C.FILETYPEID,C.LOCALFILEPATH,PG.PRODUCTGROUPNAME from CONTENT  C inner join e_group on C.GROUPID = e_group.ID inner join EBRANDMAP B on C.ID=B.CONTENTID left outer join FAVOURITEDETAIL F on C.ID=F.CONTENT and B.BRANDID=F.BRAND inner join PRODUCTGROUPS PG on PG.PRODUCTGROUP_ID=B.BRANDID  inner join DETAILINGTO DT on DT.ID=C.DETALINGTO  where upper(DT.NAME)='DOCTOR' and SYNCED=1 and (( '" + ConvertYYMMDD($.session.get("lastSynced")) + "'   between C.FROMDATE and C.TODATE ) OR (C.FROMDATE is '' or C.TODATE is '' )) and " + Qry + " order by PG.PRODUCTGROUPNAME";
//    "inner join EBRANDMAP B on C.ID=B.CONTENTID left outer join FAVOURITEDETAIL F on C.ID=F.CONTENT and B.BRANDID=F.BRAND \n\
//    inner join PRODUCTGROUPS PG on PG.PRODUCTGROUP_ID=B.BRANDID  \n\
//    inner join DETAILINGTO DT on DT.ID=C.DETALINGTO  \n\
//where upper(DT.NAME)='DOCTOR' and SYNCED=1 and \n\
//(( '" + ConvertYYMMDD($.session.get("lastSynced")) + "'   \n\
//between C.FROMDATE and C.TODATE ) OR (C.FROMDATE is '' or C.TODATE is '' )) \n\
//and " + Qry + " order by PG.PRODUCTGROUPNAME";

    query2 = "SELECT DISTINCT " + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.NAME + " AS groupName, C." + TABLES.CONTENT.NAME +
            ",C." + TABLES.CONTENT.ID + ",C." + TABLES.CONTENT.FILE_TYPE_ID + ",C." + TABLES.CONTENT.LOCAL_FILE_PATH
            + ",B." + TABLES.EBRANDMAP.BRAND_ID + "," + "PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME +
            " FROM " + TABLES.CONTENT.TABLE + " C INNER JOIN " + TABLES.EGROUP.TABLE + " ON C." +
            TABLES.CONTENT.GROUP_ID + " = " + TABLES.EGROUP.TABLE + "." + TABLES.EGROUP.ID +
            " INNER JOIN " + TABLES.EBRANDMAP.TABLE + " B ON C." + TABLES.CONTENT.ID + " = B." + TABLES.EBRANDMAP.CONTENT_ID + " LEFT OUTER JOIN " +
            TABLES.FAVOURITEDETAIL.TABLE + " F ON C." + TABLES.CONTENT.ID + "=" + "F." + TABLES.FAVOURITEDETAIL.CONTENT
            + " AND B." + TABLES.EBRANDMAP.BRAND_ID + "= F." + TABLES.FAVOURITEDETAIL.BRAND +
            " INNER JOIN " + TABLES.PRODUCTGROUPS.TABLE + " PG ON PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_ID + "= B." + TABLES.EBRANDMAP.BRAND_ID
            + " INNER JOIN " + TABLES.DETAILINGTO.TABLE + " DT ON DT." + TABLES.DETAILINGTO.ID + "= C." + TABLES.CONTENT.DETALING_TO
            + " WHERE UPPER(DT." + TABLES.DETAILINGTO.NAME + ") = 'DOCTOR' AND " + TABLES.CONTENT.SYNCED + "=1 AND (( ' "
            + ConvertYYMMDD($.session.get("lastSynced")) + "' BETWEEN  C." + TABLES.CONTENT.FROM_DATE + " AND C." + TABLES.CONTENT.TO_DATE +
            ") OR ( C." + TABLES.CONTENT.FROM_DATE + " IS '' OR C." + TABLES.CONTENT.TO_DATE + " IS '' )) AND "
            + Qry + " ORDER BY PG." + TABLES.PRODUCTGROUPS.PRODUCT_GROUP_NAME;


    //query2="select DISTINCT  C.NAME,C.ID,B.BRANDID,C.FILETYPEID,PG.PRODUCTGROUPNAME from CONTENT  C inner join EBRANDMAP B on C.ID=B.CONTENTID left outer join FAVOURITEDETAIL F on C.ID=F.CONTENT and B.BRANDID=F.BRAND inner join PRODUCTGROUPS PG on PG.PRODUCTGROUP_ID=B.BRANDID  where ( ('"+ConvertYYMMDD($.session.get("ActivityDate"))+"'   between C.FROMDATE and C.TODATE ) OR (C.FROMDATE is '' or C.TODATE is '' )) and "+ Qry;
//    }


    console.log(query2);
    $('#fliteredBy').text(filteredBy);
    lastDisplayedBrand = "";
    db.transaction(function (tx) {

        tx.executeSql(query2, [], function (tx, result) {
            var dd = $('#CONENTIDIMAGE').empty();
            var sometext = "hdf"
            //dd.append('<li> <button onclick=viewHTml("' + sometext.toString() + '") style="font-size:10px"> View</button> <figure><a><img src="Images/html5_150.png" alt="Image not found" /></a><figcaption>' + sometext + ')<input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></figcaption></figure></li>');

            dataset = result.rows;
            if (dataset.length > 0) {


                dd.append('<div class="col-xs-12">');

                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                  
                    Images = "";
                    if (item["FILETYPEID"] == 1)
                    {
                        //videos
                        Images = "Images/mp4_150.png"
                    } else if (item["FILETYPEID"] == 2)
                    {
                        //pdf
                        Images = "Images/pdf_150.png"
                    } else if (item["FILETYPEID"] == 3)
                    {
                        //ppt
                        Images = "Images/ppt_150.png"
                    } else if (item["FILETYPEID"] == 4)
                    {
                        //docx
                        Images = "Images/docx_150.png"
                    } else if (item["FILETYPEID"] == 5 || item["FILETYPEID"] == 6)
                    {
                        //html5
                        Images = "Images/html5_150.png"
                    }
                    var values = item["ID"] + '&' + item["BRANDID"];
                    var qv = "'" + Qry + '#' + values + "'";
                    //dd.append('<div class="ui-grid-a">');
                    if (lastDisplayedBrand !== item["PRODUCTGROUPNAME"]) {
                        dd.append('<div class="row" style="margin-top:5px">');
                        dd.append('<div class="col-xs-12" style="font-weight:bold;font-size:16px;background-color:#f9f9f9; color: orange;"><u>' + item["PRODUCTGROUPNAME"] + '</u></div>');
                        dd.append('</div>');
                    }
                    if ($.session.get("FAV") == "YES") {
                        if ((lastDisplayedBrand === item["PRODUCTGROUPNAME"])) {
                            if (toogleClicked) {
//                                if (item["FILETYPEID"] == 6) {
                                dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item["LOCALFILEPATH"] + '","' + values + '","' + item["FILETYPEID"] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
                                //           dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                            } else {
//                                if (item["FILETYPEID"] == 6) {
                                dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item["LOCALFILEPATH"] + '","' + values + '","' + item["FILETYPEID"] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                            }
                        } else {
                            dd.append('<div class="row">');
                            if (toogleClicked) {
//                                if (item["FILETYPEID"] == 6) {
                                dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item["LOCALFILEPATH"] + '","' + values + '","' + item["FILETYPEID"] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                            } else {
//                                if (item["FILETYPEID"] == 6) {
                                dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input><br/><button class="btn btn-success" onclick=viewHTml("' + item["LOCALFILEPATH"] + '","' + values + '","' + item["FILETYPEID"] + '") style="font-size:10px;margin-top:10px"> View</button> </div>');
//                                } else {
//                                    dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:75px;height:75px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p><br/><input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></div>');
//                                }
                            }
                            dd.append('</div>');
                        }
                    } else {
                        if ((lastDisplayedBrand === item["PRODUCTGROUPNAME"])) {
                            if (toogleClicked) {
                                dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><a style="font-size:12px" onclick="GOTOPLAYSECTION(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:60px;height:60px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p> </a></div>');
                            } else {
                                dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><a style="font-size:12px"  onclick="GOTOPLAYSECTION(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:60px;height:60px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p> </a></div>');
                            }
                        } else {
                            dd.append('<div class="row">');
                            if (toogleClicked) {
                                dd.append('<div style="font-size:12px" class="col-xs-12 edetailContentsWrapper"><a onclick="GOTOPLAYSECTION(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:60px;height:60px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p> </a></div>');
                            } else {
                                dd.append('<div style="font-size:12px" class="col-xs-6 edetailContentsWrapper"><a onclick="GOTOPLAYSECTION(' + qv + ')"><img src="' + Images + '" alt="Image not found" style="object-fit:contain;width:60px;height:60px"/><p style="display:inline-block"> <b>FileName&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</b> ' + item["NAME"] + '<br/><b>Brand Name&nbsp:</b> ' + item["PRODUCTGROUPNAME"] + '<br/><b>Group Name&nbsp:</b> ' + item["GroupName"] + '</p> </a></div>');
                            }
                            dd.append('</div>');
                        }
                    }
                    lastDisplayedBrand = item["PRODUCTGROUPNAME"];
                }
                dd.append('</div>');

                //dd.append('</div>');
                //$('#CONENTIDIMAGE').trigger('create');
//                if (groupedClicked) {
//                    tx.executeSql("select * from DCREDetailPageGrouping inner join DCREDetailPageFAVORITES on DCREDetailPageFAVORITES.ID = DCREDetailPageGrouping.FAVID group by GroupId", [], function (tx, result) {
//
//                        var htmlFavDataset = result.rows;
//                        if (htmlFavDataset.length > 0) {
//                            for (var i = 0, item = null; i < htmlFavDataset.length; i++) {
//                                item = htmlFavDataset.item(i);
//                                if ($.session.get("FAV") == "YES") {
//                                    //dd.append('<label><a data-theme="a" style="font-size: 16px;color:blue" name="FAVOURITE" class="FAVOURITE" id="' + item["ID"] + '" onclick="groupedFav(' + item["GroupId"] + ',' + item["CONTENTID"] + ',' + item["BRANDID"] + ')">' + item["GroupName"] + '</a></label> <br />');
//
//                                    dd.append('<li> <figure><a><img src="Images/html5_150.png" alt="Image not found" /></a><figcaption>' + item["NAME"] + '(' + item["PRODUCTGROUPNAME"] + ')<input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></figcaption></figure></li>');
//                                } else {
//                                    dd.append('<li><figure><a><img src="Images/html5_150.png" alt="Image not found" /></a><figcaption>' + item["NAME"] + '(' + item["PRODUCTGROUPNAME"] + ')<input type="checkbox" name="FAVNADD" onclick=checkFAVRAD() class="FAVNADD" value=' + values + '> </input></figcaption></figure></li>');
//                                }
//                            }
//                        }
//                        $('#CONENTIDIMAGE').trigger('create');
//                    });
//                } else {
//                    $('#CONENTIDIMAGE').trigger('create');
//                }
            } else {

            }

            //$('#CONENTIDIMAGE').trigger('create');
        });
    });

}

var timer;
function increment() {
    playingtime = playingtime + 1;
//    if (playingtime != null && playingtime != "null") {
//        //localStorage.setItem("platTime", playingtime);
//    }


}

function viewHTml(_localPath, _values, _fileType) {
      alert(item["LOCALFILEPATH"]);
    $.session.set("FDP", _values);
    if (_fileType == 6) {
        window.location.href = _localPath + "/index.html";
    } else if (_fileType == 2) {
        $.session.set("pdfFilePath", _localPath);
        document.location = "Edetailing/Tracking.html";
    } else {
        window.plugins.fileOpener.open(_localPath);
    }
}


function GOTOPLAYSECTION(value) {

    var qr = value.split('#');

    var qr2 = qr[1].split('&');
    db.transaction(function (tx) {

        tx.executeSql(" Select distinct ID,CONTENT,LOCALFILEPATH,FILETYPEID,NAME from CONTENT where ID=?", [qr2[0]], function (tx, result) {

            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    //  alert(item["LOCALFILEPATH"]);
                    // window.plugins.fileOpener.open();
                    $.session.set("fileTypeLastPlayed", item["FILETYPEID"]);
                    fileTypeLastPlayed = item["FILETYPEID"];
                    if (item["FILETYPEID"] == 6) {
                        //window.location="DailyReport.html#EDetailhtmldes"
                        screen.lockOrientation('landscape');
                        if ($.session.get("VDP") == null || $.session.get("VDP") == undefined || $.session.get("VDP") == "") {
                            clearInterval(timer);
                            playingtime = 0;
                            timer = setInterval(increment, 1000);

                            if ($.session.get('fromUnlisted') === "true") {
                                $.session.set("DCALLID", $.session.get("DCRUID"));
                            }
                            var tempQR = value.split('#')
                            $.session.set("VDP", tempQR[1]);
                            localStorage.setItem('fromedtail', true);
                            console.log(item["LOCALFILEPATH"]);
                            window.location.href = item["LOCALFILEPATH"] + "/index.html";
                        } else {

                            var qr3 = $.session.get("VDP").split('&');


                            //insertintoebrand(qr3[1], qr3[0], playingtime)
                            if ($.session.get('fromUnlisted') === "true") {
                                var tempqr = value.split('#');

                                var tempqr2 = tempqr[1].split('&');
                                db.transaction(function (tx) {
                                    tx.executeSql("SELECT * FROM EUNLISTEDBRANDS WHERE DCRULDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCRUID"), $.session.get("ActivityID"), tempqr2[1], tempqr2[0]], function (tx, result) {
                                        dataset = result.rows;
                                        if (dataset.length > 0) {

                                        } else {
//                                            db.transaction(function (tx) {
//                                                tx.executeSql("INSERT INTO EUNLISTEDBRANDS(DCRULDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCRUID"), $.session.get("ActivityID"), qr3[1], qr3[0], playingtime, 0, 0], function (tx, result) {
                                            clearInterval(timer);
                                            playingtime = 0;
                                            timer = setInterval(increment, 1000);

                                            $.session.set("DCALLID", $.session.get("DCRUID"));
                                            var tempQR = value.split('#')
                                            $.session.set("VDP", tempQR[1]);
                                            localStorage.setItem('fromedtail', true);
                                            console.log(item["LOCALFILEPATH"]);
                                            window.location.href = item["LOCALFILEPATH"] + "/index.html";
//                                                });
//                                            });

                                        }
                                    });


                                });
                            } else {
                                var tempqr = value.split('#');

                                var tempqr2 = tempqr[1].split('&');
                                db.transaction(function (tx) {
                                    console.log("SELECT * FROM EBRANDS WHERE DCRDOCTOR_SLNO=" + $.session.get("DCALLID") + " and DCR_SLNO=" + $.session.get("ActivityID") + " and BRANDID=" + tempqr2[1] + " and CONTENTID=" + tempqr2[0]);
                                    tx.executeSql("SELECT * FROM EBRANDS WHERE DCRDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCALLID"), $.session.get("ActivityID"), tempqr2[1], tempqr2[0]], function (tx, result) {
                                        dataset = result.rows;
                                        if (dataset.length > 0) {
                                            alert("BRand already edetailed");
                                        } else {
//                                            db.transaction(function (tx) {
//                                                tx.executeSql("INSERT INTO EBRANDS(DCRDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCALLID"), $.session.get("ActivityID"), qr3[1], qr3[0], playingtime, 0, 0], function (tx, result) {
//                                                    clearInterval(timer);
                                            playingtime = 0;
                                            timer = setInterval(increment, 1000);


                                            var tempQR = value.split('#')
                                            $.session.set("VDP", tempQR[1]);
                                            localStorage.setItem('fromedtail', true);
                                            console.log(item["LOCALFILEPATH"]);
                                            window.location.href = item["LOCALFILEPATH"] + "/index.html";
//                                                });
//                                            });

                                        }
                                    });


                                });
                            }
                        }



//                        zip.unzip(item["LOCALFILEPATH"], "file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content",
//                                /*success*/function () {
//                                    //alert("Unzipped and assigned");
//                                    localStorage.setItem('fromedtail', true);
//                                    window.location.href = "file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html";
//                                    //$('#EDetailhtmldes').load("file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html");
//                                },
//                                /*fail*/function (error) {
//                                    //alert("Unzip failed: " + error.code);
//                                    localStorage.setItem('fromedtail', true);
//                                    window.location.href = "file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html";
//                                    //$('#EDetailhtmldes').load("file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html");
//                                }
//                        );
                    } else {
                        if ($.session.get("VDP") == null || $.session.get("VDP") == undefined || $.session.get("VDP") == "") {

                        } else {
                            if ($.session.get('fromUnlisted') === "true") {

                                $.session.set("DCALLID", $.session.get("DCRUID"));
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
                        if (item["FILETYPEID"] == 2) {
                            if ($.session.get('fromUnlisted') === "true") {
                                $.session.set("DCALLID", $.session.get("DCRUID"));
                            }
                            screen.lockOrientation('landscape');
                            localStorage.setItem('fromedtail', true);
                            $.session.set("pdfFilePath", item["LOCALFILEPATH"]);
                            document.location = "Edetailing/Tracking.html";
                        } else {

//                            var ref = window.open(item["LOCALFILEPATH"], '_blank', 'location=no');
//                            ref.addEventListener('exit', function () {
//                                ref.removeEventListener('exit', function () {
//                                });
//                                 ref.close();
//
//
//                            });
                            window.plugins.fileOpener.open(item["LOCALFILEPATH"]);
                        }
                    }



//            cordova.plugins.fileOpener2.open(
//    item["LOCALFILEPATH"], // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
//    'application/pdf', 
//    { 
//        error : function(e) { 
//            
//        },
//        success : function () {
//                    
//        }
//    }
//);
                }
            } else {

            }


        });

    });

//    var query2='select DISTINCT  C.NAME,C.ID,B.BRANDID from CONTENT  C inner join EBRANDMAP B on C.ID=B.CONTENTID left outer join FAVOURITEDETAIL F on C.ID=F.CONTENT and B.BRANDID=F.BRAND where  '+ qr[0];
//
// db.transaction(function (tx){
//     
//       tx.executeSql(query2, [], function (tx, result) {
//      var dd=$('#SelectedConetentID').empty();
//    
//       dataset = result.rows;
//       if (dataset.length > 0) {
//           
//         
//                for (var i = 0, item = null; i < dataset.length; i++) {
//                item = dataset.item(i);
//             var values=item["ID"]+'&'+item["BRANDID"];
//             var qv="'"+qr[0]+'#'+values+"'";
//             
//               dd.append( '<li><a onclick="GOTOPLAYSECTIONNEW('+qv+')"><figure><img src="Images/capsule.png" alt="Image not found" /><figcaption>'+item["NAME"]+' </figcaption></figure></a></li>');
//           
//               }
//             $('#SelectedConetentID').trigger('create');
//          
//        }
//   else {
//        
//         }
//         
//            $('#SelectedConetentID').trigger('create');
//        });
//     
//});
//    




    //  window.location="DailyReport.html#EDetailVedioPlayPageID"

}

function GOTOPLAYSECTIONNEW(value) {



    var qr = value.split('#');
    var qr2 = qr[1].split('&');
    $.session.set("VDP", qr[1]);

    insertintoebrand(qr2[1], qr2[0], playingtime)
    clearInterval(timer);
    playingtime = 1;
    timer = setInterval(increment, 1000);
    db.transaction(function (tx) {

        tx.executeSql(" Select * from CONTENT where ID=?", [qr2[0]], function (tx, result) {


            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);

                    $('#COntentVideoID').attr('src', "122.mp4");
                    var video = $('#COntentVideoID').get(0);
                    video.load();
                    video.play();
                }
            } else {

            }


        });

    });



}

function insertintoebrand(BrandID, ContentID, Time)
{


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EBRANDS WHERE DCRDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCALLID"), $.session.get("ActivityID"), BrandID, ContentID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                tx.executeSql("Update EBRANDS set TIME=?  where DCRDOCTOR_SLNO = ? AND BRANDID= ? AND CONTENTID =?", [Time, $.session.get("DCALLID"), BrandID, ContentID], Check, onError);
            } else {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO EBRANDS(DCRDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCALLID"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0], Check, onError);
                });

            }
        });


    });


}

function insertintoULebrand(BrandID, ContentID, Time)
{


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EUNLISTEDBRANDS WHERE DCRULDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCRUID"), $.session.get("ActivityID"), BrandID, ContentID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                checkUNEBD();
            } else {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO EUNLISTEDBRANDS(DCRULDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCRUID"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0], Check, onError);
                });

            }
        });


    });


}

function insertintoULebrandlast(BrandID, ContentID, Time)
{


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EUNLISTEDBRANDS WHERE DCRULDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCRUID"), $.session.get("ActivityID"), BrandID, ContentID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                checkUNEBD();
            } else {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO EUNLISTEDBRANDS(DCRULDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCRUID"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0], checkUNEBD, onError);
                });

            }
        });


    });


}
function insertintoebrandlast(BrandID, ContentID, Time)
{


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EBRANDS WHERE DCRDOCTOR_SLNO=? and DCR_SLNO=? and BRANDID=?  and CONTENTID=?", [$.session.get("DCALLID"), $.session.get("ActivityID"), BrandID, ContentID], function (tx, result) {
            dataset = result.rows;
            if (dataset.length > 0) {
                CheckEBD();
            } else {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO EBRANDS(DCRDOCTOR_SLNO,DCR_SLNO,BRANDID,CONTENTID,TIME,KEYID,FEEDBCKID) VALUES (?,?,?,?,?,?,?)", [$.session.get("DCALLID"), $.session.get("ActivityID"), BrandID, ContentID, Time, 0, 0], CheckEBD, onError);
                });

            }
        });


    });


}


function CheckEBD() {
    displayAddedEbrands();
}

function checkUNEBD() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EUNLISTEDBRANDS E inner join PRODUCTGROUPS P on P.PRODUCTGROUP_ID=E.BRANDID inner join CONTENT C on C.ID=E.CONTENTID  WHERE DCRULDOCTOR_SLNO=? and DCR_SLNO=?  ", [$.session.get("DCRUID"), $.session.get("ActivityID")], function (tx, result) {
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


function displayAddedEbrands() {

    $('#EDETAILBRANDIDBODY').empty();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM EBRANDS E inner join PRODUCTGROUPS P on P.PRODUCTGROUP_ID=E.BRANDID inner join CONTENT C on C.ID=E.CONTENTID  WHERE DCRDOCTOR_SLNO=? and DCR_SLNO=?  ", [$.session.get("DCALLID"), $.session.get("ActivityID")], function (tx, result) {
            dataset = result.rows;
            var dd = $('#EDETAILBRANDIDBODY').empty();
            if (dataset.length > 0) {
                ESTATUS = true;
                $('#EDETAILBRANDID').show();
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
                            '<td  style="width:15%"><button data-theme="b" data-iconpos="notext" onclick="deleteEbrand(\'' + value + '\')"  data-icon="delete"> </button></td>'
                            + '</tr>');
                    displayFeedback(ID);
                }

                $('#EDETAILBRANDID').trigger('create');
            } else {
                ESTATUS = false;
                $('#EDETAILBRANDID').hide();
//        var ele = document.getElementById("EDETAILBRANDID");
//       ele.style.display='none';
            }
        });

        $('#EDETAILBRANDID').trigger('create');
    });
}


function deleteEbrand(ID) {
    var values = ID.split('$');
    DELETEEBRANDS(values[0], values[1]);
    displayAddedEbrands();
}

function deleteUNEbrand(ID) {
    var values = ID.split('$');
    DELETEUNEBRANDS(values[0], values[1]);
    checkUNEBD();
}


function displayFeedback(ID) {


    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM FEEDBACKINFO order by rating asc", [], function (tx, result) {
            dataset = result.rows;
            var dd = $('#' + ID);
            if (dataset.length > 0) {

                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    dd.append('<option value="' + item["ID"] + '">' + item["NAME"] + ' </option>');
                }
                $('#' + ID).selectmenu();
                $('#' + ID).val("0");
                $('#' + ID).selectmenu('refresh', true);

            } else {

            }
        });

        $('#' + ID).selectmenu();
        $('#' + ID).val("0");
        $('#' + ID).selectmenu('refresh', true);
    });
}




function checkFAVRAD() {

    getFAVOURITE();
}
