var inHome = 0, online = true;
document.addEventListener("deviceready", function () {
    screen.unlockOrientation();
    document.addEventListener("offline", function () {
        var networkState = navigator.connection.type;

        if (networkState !== Connection.NONE) {
            online = true;
        } else {
            online = false;
        }
    }, false);
    document.addEventListener("online", function () {
        var networkState = navigator.connection.type;

        if (networkState !== Connection.NONE) {
            online = true;
        } else {
            online = false;
        }
        //checkCompeletion();
    }, false);
}, false);
$(function () {
    init_data();
    assignEvents();
//    SinkService();
    SELECTRECORDSTOSYNC();
});

function init_data() {
    $('#customerSideNavPanel').load('sideBarNavigation.html');
    $('#rightSideActivitySelection').load('rightSideBarCustomerDetails.html', function () {
        $('#rightSideActivitySelection').trigger("loaddone");
    });

    $('#footerSideActivitySelection').load('footerCustomerDetails.html', function () {
        $('#footerSideActivitySelection').trigger("loaddone");
    });
    if ($.session.get("DoctorName") !== undefined && $.session.get("DoctorName") !== '') {
        $('#doctorName').html($.session.get("DoctorName"));
        $('#doctorNameWrapper').show();
    } else {
        $('#doctorNameWrapper').hide();
    }
    if ($.session.get("chemistName") !== undefined && $.session.get("chemistName") !== '') {
        $('#doctorName').html($.session.get("chemistName"));
        $('#doctorNameWrapper').show();
    } else {
        $('#doctorNameWrapper').hide();
    }
    if ($.session.get("stockiestName") !== undefined && $.session.get("stockiestName") !== '') {
        $('#doctorName').html($.session.get("stockiestName"));
        $('#doctorNameWrapper').show();
    } else {
        $('#doctorNameWrapper').hide();
    }
    // $('#activityNavBarWrapper').load('activitySelection.html');
    
    if(window.location.href  =="file:///android_asset/www/index.html"){
       $('#footerSideActivitySelection').hide();
       console.log("This is  index page ="+   window.location.href+" If page is File Activity the we dont want to show ooter ");
    }
        
   
}

function assignEvents() {
    $('#homeBtn').click(function () {
        document.location = "index.html";
    });

    $('#jccBtn').click(function () {
        var workedWithArray = $.session.get('customerWorkedWith').split(",");
        for (var i = 0; i < workedWithArray.length; i++) {
            $("input[type=checkbox][value='" + workedWithArray[i] + "']").prop('checked', true);
        }
        $('#infoModal').modal('toggle');
    });

    $('#swipeRightBtn').click(function () {
        rightSwiped();
    });

    $('#swipeLeftBtn').click(function () {
        leftSwiped();
    });

    $('#submitDCR').click(function () {
        showAddedCustomers();
    });

    $('#finalDCRSubmit').click(function () {
        $.session.set('customerDCRSLNNO', '');
        $.session.set('chemistName', '');
        $.session.set('DoctorName', '');
        $.session.set('ActivityId', '');
        $.session.set('stockiestName', '');
        if (online) {
            $('#cutomerModal').modal('toggle');
            $('#summaryModal').modal('toggle');
            SinkService();
        } else {
            getActivityInfonew();
        }
    });

    $('.container').swipe({
        swipeUp: function (event, direction, distance, duration) {

        },
        swipeDown: function (event, direction, distance, duration) {
        },
        swipeRight: function (event, direction, distance, duration) {
            if (!inHome) {
                rightSwiped();
            }
        },
        swipeLeft: function (event, direction, distance, duration) {
            if (!inHome) {
                leftSwiped();
            }
        },
        click: function (event, target) {
        },
        threshold: 100,
        allowPageScroll: "vertical"
    });

    $('.container').click(function (e) {
        if ($('.customerSideBarOverlayWrapper').hasClass('sideBarOverlayWrapperDisplay')) {
            $('.customerSideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
        }
        if ($('.sidenav').hasClass('sideBarOverlayWrapperDisplay')) {
            $('.sidenav').toggleClass('sideBarOverlayWrapperDisplay');
        }
        if ($('#contentWrapper').hasClass("toggled")) {
            $('#contentWrapper').toggleClass("toggled");
            rearrangeContents();
        }
    });

    $('#activitySelection').click(function () {
//        if ($('#wrapper').hasClass('toggled')) {
//            $("#menu-toggle").click();
//        }
//        if ($('.customerSideBarOverlayWrapper').hasClass('sideBarOverlayWrapperDisplay')) {
//            $('#customerSelection').click();
//        } else {
//            rearrangeContents();
//        }
//        $('.activitySideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
//        $('#contentWrapper').toggleClass("toggled");

    });
}

function rearrangeContents() {

    if ($('.edetailContentsWrapper').hasClass('col-xs-4')) {
        $('.edetailContentsWrapper').removeClass('col-xs-4').addClass('col-xs-4');
    } else {
        $('.edetailContentsWrapper').removeClass('col-xs-4').addClass('col-xs-4');
    }
}


function rightSwiped() {
    if ($('#wrapper').hasClass('toggled')) {
        $("#menu-toggle").click();
    }
    if ($('.activitySideBarOverlayWrapper').hasClass('sideBarOverlayWrapperDisplay')) {
        $("#activitySelection").click();
    }
    $('.customerSideBarOverlayWrapper').toggleClass('sideBarOverlayWrapperDisplay');
    $('#contentWrapper').toggleClass("toggled");
    rearrangeContents();
}

function leftSwiped() {
    $('.sidenav').toggleClass('sideBarOverlayWrapperDisplay');
}