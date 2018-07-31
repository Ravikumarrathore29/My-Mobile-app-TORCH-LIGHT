var buttons = {
    mainContainer: $('#mainContentWrapper'),
    pageLikeBtn: $('.glyphicon-thumbs-up'),
    pageDislikeBtn: $('.glyphicon-thumbs-down'),
    btnNext: $('#btnNext'),
    btnBack: $('#btnBack'),
    carouselBtnNext: $('#carouselBtnNext'),
    carouselBtnBack: $('#carouselBtnBack')
};

var elements = {
    sideNav: $("#mySidenav"),
    navButtonsWrapper: $('#navBtnWrapper'),
//    topMenu: $('#topMenu'),
    canvas: document.getElementById('canvas'),
    pageElement: document.getElementById('mainContentWrapper'),
    carouselElement: document.getElementById('myCarousel')
};

var count = 0;
var timer = $.timer(function () {
    count++;
});
var navTimer = $.timer(function () {
    elements.navButtonsWrapper.hide(1000);
    navTimer.stop();
});
navTimer.set({time: 3000});
timer.set({time: 1000, autostart: true});
var pdfFile;
var currPageNumber = 1;
var zoomed = false;
var dbConnection = function () {
    this.getConnection = function () {
        this.dbInstance = openDatabase('KEAPRO', '1.0', 'Master DB', 2 * 1024 * 1024);
    };
    this.insertIntoTrackingPage = function (_pageId, _count) {
        this.getConnection();
        var qr3 = $.session.get("VDP").split('&');
        this.dbInstance.transaction(function (tx) {
            tx.executeSql("INSERT INTO " + TABLES.DCREDETAILPAGETRACKING.TABLE + "(" + TABLES.DCREDETAILPAGETRACKING.PAGE_ID + "," +
                    TABLES.DCREDETAILPAGETRACKING.DCRDOCTOR_SLNO + "," + TABLES.DCREDETAILPAGETRACKING.CONTENT_ID
                    + "," + TABLES.DCREDETAILPAGETRACKING.BRAND_ID + "," + TABLES.DCREDETAILPAGETRACKING.VIEW_TIME +
                    "," + TABLES.DCREDETAILPAGETRACKING.PAGE_TITLE +
                    ") VALUES (?,?,?,?,?,?)", [_pageId, $.session.get("customerDCRSLNNO"), qr3[0], qr3[1], _count, ""], null, function () {
                alert("Error in inserting tracking data");
            });
        });

    };

    this.insertIntoLike = function (_pageId, _count) {
        this.getConnection();
        var qr3 = $.session.get("VDP").split('&');
        this.dbInstance.transaction(function (tx) {
            tx.executeSql("INSERT INTO " + TABLES.DCREDETAILPAGETRACKING.TABLE + "(" + TABLES.DCREDETAILPAGETRACKING.PAGE_ID + "," +
                    TABLES.DCREDETAILPAGETRACKING.DCRDOCTOR_SLNO + "," + TABLES.DCREDETAILPAGETRACKING.CONTENT_ID
                    + "," + TABLES.DCREDETAILPAGETRACKING.BRAND_ID + "," + TABLES.DCREDETAILPAGETRACKING.VIEW_TIME +
                    "," + TABLES.DCREDETAILPAGETRACKING.PAGE_TITLE +
                    ") VALUES (?,?,?,?,?,?)", [_pageId, $.session.get("customerDCRSLNNO"), qr3[0], qr3[1], _count, ""], function (tx, result) {
                tx.executeSql('SELECT MAX(ID) as ID FROM DCREDetailPageTracking',
                        null,
                        function (tx, results) {
                            var dataRows = results.rows;
                            var dataItem = dataRows.item(0);
                            var pageId = dataItem["ID"];

                            tx.executeSql('INSERT INTO DCREDetailPageLIKE (PageTrackingId,likes) VALUES(?,?)', [pageId, "1"], null, null);
                        });
            }, function () {
                alert("Error in inserting tracking data");
            });
        });
    };

    this.insertIntoDisLike = function (_pageId, _count) {
        this.getConnection();
        var qr3 = $.session.get("VDP").split('&');
        this.dbInstance.transaction(function (tx) {
            tx.executeSql("INSERT INTO DCREDetailPageTracking (PageId,DCRDOCTOR_SLNO,CONTENTID,BRANDID,ViewTime,PageTitle) VALUES (?,?,?,?,?,?)", [_pageId, $.session.get("customerDCRSLNNO"), qr3[0], qr3[1], _count, ""], function () {
                tx.executeSql('SELECT MAX(ID) as ID FROM DCREDetailPageTracking',
                        null,
                        function (tx, results) {
                            var dataRows = results.rows;
                            var dataItem = dataRows.item(0);
                            var pageId = dataItem["ID"];

                            tx.executeSql('INSERT INTO DCREDetailPageLIKE (PageTrackingId,likes) VALUES(?,?)', [pageId, "-1"], null, null);
                        });
            }, function () {
                alert("Error in inserting tracking data");
            });
        });
    };
};
var dbObject = new dbConnection();


var events = {
    reachedEdge: false,
    touchStartPoint: null,
    touchStartPointY: null,
    touchDown: false,
    lastTouchTime: 0,
    context: elements.canvas.getContext(canvasConstants.CANVAS_DIMENSION),
    showMenus: function (e) {
        if (e.pageX > (buttons.mainContainer.width() - 100)) {
            elements.sideNav.css('width', navBarConstants.SIDE_NAV_MENU_WIDTH);
            elements.navButtonsWrapper.hide(1000);
            $(".footer1").toggleClass("open");
            $('.footer').addClass('slide-down', 5000, 'easeOutBounce');
            $('.footer').removeClass('slide-up');
        } else {
            elements.sideNav.css('width', navBarConstants.HIDE_MENU_WIDTH);
            elements.navButtonsWrapper.show(1000);
            navTimer.play();
            $(".footer1").toggleClass("open");
            $('.footer').addClass('slide-down', 5000, 'easeOutBounce');
            $('.footer').removeClass('slide-up');
        }
    },
    touchStart: function (e) {
        events.touchDown = true;

        if (e.timeStamp - events.lastTouchTime < 100) {
            events.lastTouchTime = 0;
            events.toggleZoom();
        } else {
            events.lastTouchTime = e.timeStamp;
        }
    },
    touchMove: function (e) {
        if (elements.pageElement.scrollLeft === 0 || elements.pageElement.scrollLeft === elements.pageElement.scrollWidth - page.clientWidth) {
            events.reachedEdge = true;
        } else {
            events.reachedEdge = false;
            events.touchStartPoint = null;
            events.touchStartPointY = null;
        }

        if (events.reachedEdge && events.touchDown) {
            if (events.touchStartPoint === null) {
                events.touchStartPoint = e.changedTouches[0].clientX;
                events.touchStartPointY = e.changedTouches[0].clientY;
            } else {
                var distance = e.changedTouches[0].clientX - events.touchStartPoint;
                var distanceY = e.changedTouches[0].clientY - events.touchStartPointY;
                if (distanceY < 0) {
                    distanceY = -(distanceY);
                }
                if (distance < trackingContants.NEXT_PAGE_CHANGE_DISTANCE && distanceY < 10) {
                    events.touchStartPoint = null;
                    events.touchStartPointY = null;
                    events.reachedEdge = false;
                    events.touchDown = false;
                    events.openNextPage();

                } else if (distance > trackingContants.PREV_PAGE_CHANGE_DISTANCE && distanceY < 10) {
                    events.touchStartPoint = null;
                    events.touchStartPointY = null;
                    events.reachedEdge = false;
                    events.touchDown = false;
                    events.openPrevPage();

                }
            }
        }
    },
    toggleZoom: function () {
        zoomed = !zoomed;
        events.openPage(pdfFile, currPageNumber);
    },
    touchEnd: function (e) {
        events.touchStartPoint = null;
        events.touchStartPointY = null;
        events.touchDown = false;
    },
    openNextPage: function () {
        var pageNumber = Math.min(pdfFile.numPages, currPageNumber + 1);
        if (pageNumber !== currPageNumber) {
            if (localStorage.getItem('fromedtail') === "true") {
                dbObject.insertIntoTrackingPage(currPageNumber, count);
            }
            count = 0;
            currPageNumber = pageNumber;
            buttons.pageLikeBtn.css('color', navBarConstants.GLYPH_DEFAULT_COLOR);
            buttons.pageDislikeBtn.css('color', navBarConstants.GLYPH_DEFAULT_COLOR);

            events.openPage(pdfFile, currPageNumber);
        }
    },
    openPrevPage: function () {
        var pageNumber = Math.max(1, currPageNumber - 1);
        if (pageNumber !== currPageNumber) {
            if (localStorage.getItem('fromedtail') === "true") {
                dbObject.insertIntoTrackingPage(currPageNumber, count);
            }
            count = 0;
            currPageNumber = pageNumber;

            buttons.pageLikeBtn.css('color', navBarConstants.GLYPH_DEFAULT_COLOR);
            buttons.pageDislikeBtn.css('color', navBarConstants.GLYPH_DEFAULT_COLOR);

            events.openPage(pdfFile, currPageNumber);
        }
    },
    openPage: function (pdfFile, pageNumber) {
        var scale = zoomed ? fitScale : 1;

        pdfFile.getPage(pageNumber).then(function (page) {
            viewport = page.getViewport(1);

            if (zoomed) {
                var scale = elements.pageElement.clientWidth / viewport.width;
                viewport = page.getViewport(scale);
            }

            elements.canvas.height = viewport.height;
            elements.canvas.width = viewport.width;

            var renderContext = {
                canvasContext: events.context,
                viewport: viewport
            };

            page.render(renderContext);
        });
    },
    pageLike: function () {
        dbObject.insertIntoLike(currPageNumber, count);
        count = 0;
    },
    pageDisLike: function () {
        dbObject.insertIntoDisLike(currPageNumber, count);
        count = 0;
    }
};

var fitScale = 1;
$(function () {
    assignEvents();
    pdfTracking();
    $('.footer1').click(function () {
        if ($('.footer').hasClass('slide-up')) {
            $(".footer1").toggleClass("open");
            $('.footer').addClass('slide-down', 5000, 'easeOutBounce');
            $('.footer').removeClass('slide-up');
        } else {
            $(".footer1").toggleClass("open");
            $('.footer').removeClass('slide-down');
            $('.footer').addClass('slide-up', 5000, 'easeOutBounce');
        }
    });
});

function showPageThumbnail(pdfFile, pageNumber, canvas) {

    pdfFile.getPage(pageNumber).then(function (page) {
        var viewport = page.getViewport(0.4);
        var context = canvas.getContext('2d');
        viewport.height = 250;
        viewport.width = 250;
        canvas.height = 250;
        canvas.width = 250;

        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

function pdfTracking() {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {
            return window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
        })();
    }
    var appendContent = "";
    PDFJS.disableStream = true;
    PDFJS.getDocument($.session.get("pdfFilePath")).then(function (pdf) {
        pdfFile = pdf;

        events.openPage(pdf, currPageNumber, 1);

        for (var i = 0; i < pdf.numPages; i = i + 4) {
            if (i === 0) {
                appendContent += '<div class = "item active" style="z-index:1">';
                appendContent += '<div class = "row-fluid">';
                appendContent += '<canvas id = "canvas' + (i + 1) + '" data=' + (i + 1) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;opacity: 1"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 2) + '" data=' + (i + 2) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 3) + '" data=' + (i + 3) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 4) + '" data=' + (i + 4) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += "</div>";
                appendContent += "</div>";
            } else {
                appendContent += '<div class = "item" style="z-index:1">';
                appendContent += '<div class = "row-fluid">';
                appendContent += '<canvas id = "canvas' + (i + 1) + '" data=' + (i + 1) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;opacity: 1"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 2) + '" data=' + (i + 2) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 3) + '" data=' + (i + 3) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += '<canvas id = "canvas' + (i + 4) + '" data=' + (i + 4) + ' class="canvasClick" style="margin-left: 10px;width: 23.404255319148934%;display: block;min-height: 30px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: left;"></canvas>';
                appendContent += "</div>";
                appendContent += "</div>";
            }
        }

        $('#carousel-inner').append(appendContent);

        $('.canvasClick').click(function () {
            var pageNumber = $(this).attr('data');
            currPageNumber = parseInt(pageNumber);
            dbObject.insertIntoTrackingPage(parseInt(currPageNumber), count);
            count = 0;
            events.openPage(pdfFile, parseInt(currPageNumber));
            $('.footer1').click();
        });

        $('#myCarousel').carousel({
            interval: false
        });

        buttons.carouselBtnBack.click(function () {
            $("#myCarousel").carousel('prev');
        });

        buttons.carouselBtnNext.click(function () {
            $('#myCarousel').carousel('next');
        });
        for (var i = 0; i < pdf.numPages; i = i + 4) {
            showPageThumbnail(pdfFile, parseInt(i + 1), document.getElementById('canvas' + (i + 1)));
            showPageThumbnail(pdfFile, parseInt(i + 2), document.getElementById('canvas' + (i + 2)));
            showPageThumbnail(pdfFile, parseInt(i + 3), document.getElementById('canvas' + (i + 3)));
            showPageThumbnail(pdfFile, parseInt(i + 4), document.getElementById('canvas' + (i + 4)));
        }
    });
}

function assignEvents() {
    buttons.mainContainer.click(function (e) {
        events.showMenus(e);
    });

    elements.pageElement.addEventListener('touchstart', function (e) {
        events.touchStart(e);
    });

    elements.pageElement.addEventListener('touchmove', function (e) {
        events.touchMove(e);
    });

    elements.pageElement.addEventListener('touchend', function (e) {
        events.touchEnd(e);
    });

    $('#btnViewDone').click(function () {
        $('.glyphicon-home').css('color', navBarConstants.GLYPH_COLOR);
        dbObject.insertIntoTrackingPage(currPageNumber, count);
        count = 0;
        window.history.back();
    });

    buttons.pageLikeBtn.click(function () {
        buttons.pageLikeBtn.css('color', navBarConstants.GLYPH_COLOR);
        elements.sideNav.css('width', navBarConstants.HIDE_MENU_WIDTH);
//        elements.topMenu.css('width', navBarConstants.HIDE_MENU_WIDTH);
        events.pageLike();
    });

    buttons.pageDislikeBtn.click(function () {
        buttons.pageDislikeBtn.css('color', navBarConstants.GLYPH_COLOR);
        elements.sideNav.css('width', navBarConstants.HIDE_MENU_WIDTH);
//        elements.topMenu.css('width', navBarConstants.HIDE_MENU_WIDTH);
        events.pageDisLike();
    });

    buttons.btnNext.click(function (e) {
        e.preventDefault();
        events.openNextPage();
    });

    buttons.btnBack.click(function () {
        events.openPrevPage();
    });



    elements.navButtonsWrapper.hide();
}

